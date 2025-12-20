using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PayementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        // Ajuste si tu veux inclure les taxes dans le paiement
        private const decimal TaxFactor = 1.14975m;

        public PayementsController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;

            var secretKey = _config["Stripe:SecretKey"];
            if (string.IsNullOrWhiteSpace(secretKey))
                throw new InvalidOperationException("Stripe:SecretKey est manquant dans appsettings.json");

            StripeConfiguration.ApiKey = secretKey;
        }

        public record CreateCheckoutSessionRequest(int OrderId);
        public record CreateCheckoutSessionResponse(string Url);

        public record ConfirmPaymentRequest(int OrderId, string SessionId);

        /// <summary>
        /// EF28 - Crée une session Stripe Checkout et retourne l'URL pour rediriger l'utilisateur.
        /// </summary>
        [HttpPost("checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] CreateCheckoutSessionRequest req)
        {
            if (req.OrderId <= 0)
                return BadRequest(new { message = "OrderId invalide" });

            var order = await _context.Orders
                .Include(o => o.Products)
                .FirstOrDefaultAsync(o => o.OrderID == req.OrderId);

            if (order == null)
                return NotFound(new { message = "Commande introuvable" });

            if (order.OrderStatus == OrderStatus.Canceled)
                return BadRequest(new { message = "Commande annulée, paiement impossible" });

            // Si déjà payée, on évite de recréer une session
            if (string.Equals(order.PaymentStatus, "Succeeded", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { message = "Commande déjà payée" });

            // Total calculé depuis la DB
            var subtotal = order.Products.Sum(p => (p.DiscountPrice ?? p.Price) * p.Quantity);
            if (subtotal <= 0)
                return BadRequest(new { message = "Montant invalide" });

            // Choisis si tu charges AVEC ou SANS taxes
            var total = subtotal * TaxFactor;
            var amountCents = (long)Math.Round(total * 100m);

            var frontendUrl = _config["App:FrontendUrl"] ?? "http://localhost:3000";
            var successUrl = $"{frontendUrl}/order-confirmation/{order.OrderID}?session_id={{CHECKOUT_SESSION_ID}}";
            var cancelUrl = $"{frontendUrl}/checkout?canceled=1";

            var options = new SessionCreateOptions
            {
                Mode = "payment",
                SuccessUrl = successUrl,
                CancelUrl = cancelUrl,

                // EF28: infos minimales (nom sur carte, adresse, téléphone)
                BillingAddressCollection = "required",
                PhoneNumberCollection = new SessionPhoneNumberCollectionOptions { Enabled = true },

                // Un seul line item = total de la commande (simple)
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Quantity = 1,
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "cad",
                            UnitAmount = amountCents,
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = $"Commande {order.OrderNumber}"
                            }
                        }
                    }
                },
                Metadata = new Dictionary<string, string>
                {
                    ["orderId"] = order.OrderID.ToString(),
                    ["orderNumber"] = order.OrderNumber
                }
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            // ✅ Sauvegarder la session + statut pending
            order.StripeCheckoutSessionId = session.Id;
            order.PaymentStatus = "Pending";
            await _context.SaveChangesAsync();

            return Ok(new CreateCheckoutSessionResponse(session.Url));
        }

        /// <summary>
        /// EF29/EF30 - Confirmation SANS webhook (appelée depuis success_url).
        /// Vérifie chez Stripe, puis enregistre le reçu.
        /// </summary>
        [HttpPost("confirm")]
        public async Task<IActionResult> Confirm([FromBody] ConfirmPaymentRequest req)
        {
            if (req.OrderId <= 0 || string.IsNullOrWhiteSpace(req.SessionId))
                return BadRequest(new { message = "Requête invalide" });

            var order = await _context.Orders
                .Include(o => o.Products)
                .FirstOrDefaultAsync(o => o.OrderID == req.OrderId);

            if (order == null)
                return NotFound(new { message = "Commande introuvable" });

            if (order.OrderStatus == OrderStatus.Canceled)
                return BadRequest(new { message = "Commande annulée" });

            foreach (OrderProducts op in order.Products)
            {
                Models.Product realProduct = _context.Products.FirstOrDefault(p => p.ID == op.ProductID);
                if (realProduct is not null)
                    realProduct.UnitsInStock -= op.Quantity;
            }

            // ✅ Déjà confirmé => on renvoie le reçu directement (refresh safe)
            if (string.Equals(order.PaymentStatus, "Succeeded", StringComparison.OrdinalIgnoreCase))
            {
                return Ok(new
                {
                    success = true,
                    receipt = new
                    {
                        paidAtUtc = order.PaidAtUtc,
                        billingName = order.BillingName,
                        billingPhone = order.BillingPhone,
                        billingAddress = order.BillingAddress,
                        cardLast4 = order.CardLast4
                    }
                });
            }

            // Récupérer la session Stripe
            var sessionService = new SessionService();
            var session = await sessionService.GetAsync(req.SessionId);

            // Vérifier que la session correspond à CETTE commande
            if (session?.Metadata == null ||
                !session.Metadata.TryGetValue("orderId", out var orderIdStr) ||
                orderIdStr != req.OrderId.ToString())
            {
                order.PaymentStatus = "Failed";
                await _context.SaveChangesAsync();
                return BadRequest(new { message = "Session Stripe invalide pour cette commande" });
            }

            // (Bonus) Vérifier que la session correspond à la dernière session sauvegardée pour cette commande
            if (!string.IsNullOrWhiteSpace(order.StripeCheckoutSessionId) &&
                !string.Equals(order.StripeCheckoutSessionId, session.Id, StringComparison.Ordinal))
            {
                order.PaymentStatus = "Failed";
                await _context.SaveChangesAsync();
                return BadRequest(new { message = "Session Stripe ne correspond pas à la commande" });
            }

            // Paiement OK ?
            if (!string.Equals(session.PaymentStatus, "paid", StringComparison.OrdinalIgnoreCase))
            {
                order.PaymentStatus = "Failed";
                await _context.SaveChangesAsync();
                return Ok(new { success = false, message = "Paiement non complété" });
            }

            // Récupérer détails reçu via PaymentIntent -> LatestCharge
            string? billingName = null;
            string? billingPhone = null;
            string? billingAddress = null;
            string? last4 = null;

            if (!string.IsNullOrWhiteSpace(session.PaymentIntentId))
            {
                var piService = new PaymentIntentService();
                var pi = await piService.GetAsync(session.PaymentIntentId, new PaymentIntentGetOptions
                {
                    Expand = new List<string> { "latest_charge" }
                });

                order.StripePaymentIntentId = pi.Id;

                var charge = pi.LatestCharge as Charge;
                if (charge != null)
                {
                    billingName = charge.BillingDetails?.Name;
                    billingPhone = charge.BillingDetails?.Phone;

                    var addr = charge.BillingDetails?.Address;
                    if (addr != null)
                    {
                        billingAddress = $"{addr.Line1} {addr.Line2}, {addr.City}, {addr.State}, {addr.Country}, {addr.PostalCode}"
                            .Replace(" ,", ",")
                            .Trim();
                    }

                    last4 = charge.PaymentMethodDetails?.Card?.Last4;
                }
            }

            // ✅ Enregistrer le reçu (EF30) + statut succès (EF29)
            order.PaidAtUtc = DateTime.UtcNow;
            order.BillingName = billingName ?? "";
            order.BillingPhone = billingPhone ?? "";
            order.BillingAddress = billingAddress ?? "";
            order.CardLast4 = last4 ?? "";
            order.PaymentStatus = "Succeeded";

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                receipt = new
                {
                    paidAtUtc = order.PaidAtUtc,
                    billingName = order.BillingName,
                    billingPhone = order.BillingPhone,
                    billingAddress = order.BillingAddress,
                    cardLast4 = order.CardLast4
                }
            });
        }
    }
}
