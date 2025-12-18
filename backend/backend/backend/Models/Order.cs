using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public enum OrderStatus
    {
        Confirmed,
        Canceled,
        Preperation,
        Shipping,
        Shipped,
        Returned
    }

    public class Order
    {
        public int OrderID { get; set; }

        // Relation avec User (Guid)
        public User? User { get; set; }
        public Guid? UserID { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Phone]
        public string PhoneNumber { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Province { get; set; }

        [Required]
        public string Country { get; set; }

        [Required]
        public string PostalCode { get; set; }

        [Required]
        public string OrderNumber { get; set; }

        [Required]
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;

        public OrderStatus OrderStatus { get; set; } = OrderStatus.Confirmed;

        public List<OrderProducts> Products { get; set; } = new();

        // ==========================
        // Paiement / Reçu
        // ==========================

        /// <summary>
        /// Statut de paiement (simple, sans webhook):
        /// "None", "Pending", "Succeeded", "Failed"
        /// </summary>
        public string? PaymentStatus { get; set; } = "None";

        /// <summary>
        /// Date/heure du paiement (UTC)
        /// </summary>
        public DateTime? PaidAtUtc { get; set; }

        /// <summary>
        /// Nom sur la carte (ou billing name)
        /// </summary>
        public string? BillingName { get; set; }

        /// <summary>
        /// Adresse de facturation (format texte)
        /// </summary>
        public string? BillingAddress { get; set; }

        /// <summary>
        /// Téléphone associé à la facturation
        /// </summary>
        public string? BillingPhone { get; set; }

        /// <summary>
        /// 4 derniers chiffres de la carte
        /// </summary>
        public string? CardLast4 { get; set; }

        /// <summary>
        /// Id de session Stripe Checkout (utile pour validation)
        /// </summary>
        public string? StripeCheckoutSessionId { get; set; }

        /// <summary>
        /// Id du PaymentIntent Stripe
        /// </summary>
        public string? StripePaymentIntentId { get; set; }

        // ==========================
        // Calculs
        // ==========================

        public decimal SubTotal => Products.Sum(p =>
            (decimal)(p.DiscountPrice ?? p.Price) * p.Quantity
        );
    }
}
