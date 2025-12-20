using backend.Models;
using backend.Models_DTO;
using backend.Services;
using backend.Validators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
		private IDomainService _domainService;


		public OrdersController(ApplicationDbContext context, UserManager<User> userManager, IDomainService domainService)
        {
            _context = context;
            _userManager = userManager;
			_domainService = domainService;
		}

        // EF21 - Vérifier le statut d'authentification avant de créer la commande
        [HttpPost("check-auth")]
        public IActionResult CheckAuthentication()
        {
            var isAuthenticated = User?.Identity?.IsAuthenticated ?? false;
            var userId = User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            return Ok(new
            {
                isAuthenticated = isAuthenticated,
                userId = userId
            });
        }

        // EF22 - Obtenir les informations du client authentifié pour préremplir le formulaire
        [HttpGet("customer-info")]
        [Authorize]
        public async Task<IActionResult> GetCustomerInfo()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return Unauthorized();
            }

            // Charger les adresses de l'utilisateur
            var userWithAddresses = await _context.Users
                .Include(u => u.Adresses)
                .FirstOrDefaultAsync(u => u.Id == user.Id);

            // Prendre la première adresse disponible
            var primaryAddress = userWithAddresses?.Adresses?.FirstOrDefault();

            // Construire l'adresse complète à partir de UserAddress
            string fullAddress = "";
            if (primaryAddress != null)
            {
                fullAddress = $"{primaryAddress.StreetNumber} {primaryAddress.StreetName}";
                if (!string.IsNullOrEmpty(primaryAddress.AppartementNumber))
                {
                    fullAddress += $", App. {primaryAddress.AppartementNumber}";
                }
            }

            return Ok(new
            {
                firstName = user.FirstName ?? "",
                lastName = user.LastName ?? "",
                email = user.Email ?? "",
                phoneNumber = user.PhoneNumber ?? "",
                address = fullAddress,
                city = primaryAddress?.City ?? "",
                province = primaryAddress?.StateProvince ?? "",
                country = primaryAddress?.Country ?? "Canada",
                postalCode = primaryAddress?.PostalCode ?? ""
            });
        }

        // ENF03 - Endpoint pour validation asynchrone des champs
        [HttpPost("validate-field")]
        public async Task<IActionResult> ValidateField([FromBody] FieldValidationRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.FieldName) || request.Value == null)
            {
                return BadRequest(new { message = "Requête invalide" });
            }

            var result = new OrderValidationResult { IsValid = true };

            switch (request.FieldName.ToLower())
            {
                case "firstname":
                    OrderValidator.ValidateName(request.Value, "FirstName", result);
                    break;
                case "lastname":
                    OrderValidator.ValidateName(request.Value, "LastName", result);
                    break;
                case "email":
                    OrderValidator.ValidateEmail(request.Value, result);

                    // Vérifier si l'email existe déjà pour un utilisateur authentifié
                    if (result.IsValid)
                    {
                        var emailExists = await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Value.Trim().ToLower());
                        if (emailExists)
                        {
                            result.IsValid = false;
                            if (!result.Errors.ContainsKey("Email"))
                            {
                                result.Errors["Email"] = new List<string>();
                            }
                            result.Errors["Email"].Add("Cet email est déjà associé à un compte. Veuillez vous connecter.");
                        }
                    }
                    break;
                case "phonenumber":
                    OrderValidator.ValidatePhoneNumber(request.Value, result);
                    break;
                case "address":
                    OrderValidator.ValidateAddress(request.Value, result);
                    break;
                case "city":
                    OrderValidator.ValidateCity(request.Value, result);
                    break;
                case "province":
                    OrderValidator.ValidateProvince(request.Value, result);
                    break;
                case "country":
                    OrderValidator.ValidateCountry(request.Value, result);
                    break;
                case "postalcode":
                    OrderValidator.ValidatePostalCode(request.Value, result);
                    break;
                default:
                    return BadRequest(new { message = "Champ inconnu" });
            }

            if (result.IsValid)
            {
                return Ok(new { isValid = true });
            }

            return Ok(new
            {
                isValid = false,
                errors = result.Errors.SelectMany(e => e.Value).ToList()
            });
        }

        // EF22 - Créer une commande avec les informations du formulaire et validation robuste (ENF03)
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto orderDto)
        {
            // Validation de base
            if (orderDto == null)
            {
                return BadRequest(new { message = "Données de commande manquantes" });
            }

            // ENF03 - Validation côté serveur complète
            var validationResult = OrderValidator.ValidateOrder(orderDto);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation échouée",
                    errors = validationResult.Errors
                });
            }

            // Récupérer l'utilisateur si authentifié
            Guid? userId = null;
            if (User?.Identity?.IsAuthenticated == true)
            {
                var currentUser = await _userManager.GetUserAsync(User);
                if (currentUser != null)
                {
                    userId = currentUser.Id;
                }
            }
            else
            {
                // Si l'utilisateur n'est PAS authentifié, vérifier que l'email n'existe pas
                var emailExists = await _context.Users.AnyAsync(u => u.Email.ToLower() == orderDto.Email.Trim().ToLower());

                if (emailExists)
                {
                    return BadRequest(new
                    {
                        message = "Validation échouée",
                        errors = new Dictionary<string, List<string>>
                {
                    { "Email", new List<string> { "Cet email est déjà associé à un compte. Veuillez vous connecter pour continuer." } }
                }
                    });
                }
            }

            // Valider que les produits existent et récupérer leurs informations actuelles
            var productIds = orderDto.CartItems.Select(item => item.ProductId).ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.ID))
                .ToListAsync();

            if (products.Count != productIds.Count)
            {
                return BadRequest(new { message = "Certains produits du panier n'existent plus" });
            }

            // Vérifier la disponibilité des produits
            foreach (var cartItem in orderDto.CartItems)
            {
                var product = products.FirstOrDefault(p => p.ID == cartItem.ProductId);
                if (product == null)
                {
                    return BadRequest(new { message = $"Le produit {cartItem.ProductId} n'existe pas" });
                }

                if (product.UnitsInStock < cartItem.Quantity)
                {
                    return BadRequest(new
                    {
                        message = $"Stock insuffisant pour {product.Name}. Disponible: {product.UnitsInStock}, Demandé: {cartItem.Quantity}"
                    });
                }
            }

            // Normaliser le code postal (ajouter l'espace si absent)
            var cleanedPostalCode = orderDto.PostalCode.Replace(" ", "").Replace("-", "").ToUpper();
            var formattedPostalCode = cleanedPostalCode.Length >= 6
                ? $"{cleanedPostalCode.Substring(0, 3)} {cleanedPostalCode.Substring(3, 3)}"
                : orderDto.PostalCode;

            // Créer les OrderProducts à partir des items du panier
            var orderProducts = new List<OrderProducts>();
            foreach (var cartItem in orderDto.CartItems)
            {
                var product = products.First(p => p.ID == cartItem.ProductId);

                orderProducts.Add(new OrderProducts
                {
                    ProductID = product.ID,
                    Name = product.Name,
                    Price = product.Price,
                    DiscountPrice = product.DiscountPrice,
                    Quantity = cartItem.Quantity
                });
            }

            // Créer la commande
            var order = new Order
            {
                OrderNumber = GenerateOrderNumber(),
                CreationDate = DateTime.UtcNow,
                UserID = userId,

                // Informations du formulaire (EF22) - normalisées
                FirstName = orderDto.FirstName.Trim(),
                LastName = orderDto.LastName.Trim(),
                Email = orderDto.Email.Trim().ToLower(),
                PhoneNumber = orderDto.PhoneNumber.Trim(),
                Address = orderDto.Address.Trim(),
                City = orderDto.City.Trim(),
                Province = orderDto.Province.Trim(),
                Country = orderDto.Country.Trim(),
                PostalCode = formattedPostalCode,

                // Produits de la commande
                Products = orderProducts
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Commande créée avec succès - ID: {order.OrderID}, Numéro: {order.OrderNumber}");

            return Ok(new { orderID = order.OrderID, orderNumber = order.OrderNumber });
        }

        // EF23 - Obtenir la confirmation de commande
        [HttpGet("{id}/confirmation")]
        public async Task<IActionResult> GetOrderConfirmation(int id)
        {

            Console.WriteLine($"=== GET /api/orders/{id}/confirmation ===");

            var order = await _context.Orders
                .Include(o => o.Products)
                    .ThenInclude(op => op.Product)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.OrderID == id);

            Console.WriteLine($"Commande trouvée: {order != null}");

            if (order == null)
            {
                Console.WriteLine($"❌ Commande {id} introuvable");
                return NotFound(new { message = "Commande introuvable" });
            }

            Console.WriteLine($"✅ Commande {id} trouvée - Numéro: {order.OrderNumber}");
            Console.WriteLine($"   Produits: {order.Products.Count}");

            if (order == null)
            {
                return NotFound(new { message = "Commande introuvable" });
            }

            // EF23 - Toutes les informations demandées dans la spécification
            return Ok(new
            {
                // Numéro de commande
                orderNumber = order.OrderNumber,
                createdAt = order.CreationDate,

                // Informations du client
                customer = new
                {
                    firstName = order.FirstName,
                    lastName = order.LastName,
                    email = order.Email,
                    phoneNumber = order.PhoneNumber,
                    fullAddress = $"{order.Address}, {order.City}, {order.Province}, {order.Country}, {order.PostalCode}",
                    address = order.Address,
                    city = order.City,
                    province = order.Province,
                    country = order.Country,
                    postalCode = order.PostalCode
                },

                // Articles commandés
                items = order.Products.Select(p => new
                {
                    productID = p.ProductID,
                    name = p.Name,
                    price = p.Price,
                    discountPrice = p.DiscountPrice,
                    finalPrice = p.DiscountPrice ?? p.Price,
                    quantity = p.Quantity,
                    total = (p.DiscountPrice ?? p.Price) * p.Quantity
                }).ToList(),

                // Total avant taxes
                subTotal = order.SubTotal
            });
        }

        /// <summary>
        ///     Simon Déry - 23 novembre 2025
        ///     Annuler une commande
        /// </summary>
        /// <param name="orderNumber">Order number de la commande</param>
        /// <returns></returns>
        [HttpPost("remove")]
        public IActionResult CancelOrder([FromBody] string orderNumber)
        {
            Order? order = _context.Orders.FirstOrDefault(o => o.OrderNumber == orderNumber);

            if (order is null)
            {
                return NotFound();
            }

            order.OrderStatus = OrderStatus.Canceled;
            _context.SaveChanges();

            return Ok();
        }

        // Méthode privée pour générer un numéro de commande unique
        private string GenerateOrderNumber()
        {
            // Format: ORD-YYYYMMDD-XXXXX
            var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
            var randomPart = new Random().Next(10000, 99999);
            return $"ORD-{datePart}-{randomPart}";
        }

        [HttpGet("getOrders")]
		public async Task<IActionResult> GetOrders()
        {
			string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

			if (string.IsNullOrEmpty(userId))
				return Unauthorized(new { message = "Unauthorized userId" });

			User? user = await _userManager.FindByIdAsync(userId);

			if (user == null)
				return Unauthorized(new { message = "Unauthorized userId" });

			List<OrderFullDTO> orders = _context.Orders.Where(x => x.UserID == user.Id && x.PaymentStatus != "Pending").Select(x => new OrderFullDTO
            {
                OrderStatus = x.OrderStatus,
                OrderNumber = x.OrderNumber,
                TotalBeforeTaxes = (decimal)x.Products.Sum(p => (p.DiscountPrice ?? p.Price) * p.Quantity),
                Total = (decimal)x.Products.Sum(p => (p.DiscountPrice ?? p.Price) * p.Quantity) * 1.14975m,
                ProductDTO = x.Products.Select(p => new CartProductDTO {
                    id = p.Product.ID,
                    name = p.Product.Name,
                    Price = p.Product.Price,
                    DiscountPrice = p.Product.DiscountPrice,
                    Status = (int)p.Product.Status,
                    Amount = p.Quantity,
                    MaxQuantity = p.Product.UnitsInStock,
                    ImagesData = p.Product.Images.Select(i => new ImageDTO
                    {
                        ID = i.Id,
                        Alt = i.ImageAlt,
                        Order = i.Order,
                        Url = _domainService.GetCurrentDomain() + Constants.ImageApiRoute + i.Id.ToString()
                    }).FirstOrDefault(),
                }).ToList()
            }).ToList();

            return Ok(orders);
		}

        [Authorize(Roles = "Admin")]
        [HttpGet("getOrdersAdmin")]
        public async Task<IActionResult> GetOrdersAdmin()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Unauthorized userId" });

            User? user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return Unauthorized(new { message = "Unauthorized userId" });

            List<OrderFullDTO> orders = _context.Orders.Select(x => new OrderFullDTO
            {
                OrderStatus = x.OrderStatus,
                OrderNumber = x.OrderNumber,
                TotalBeforeTaxes = (decimal)x.Products.Sum(p => (p.DiscountPrice ?? p.Price) * p.Quantity),
                Total = (decimal)x.Products.Sum(p => (p.DiscountPrice ?? p.Price) * p.Quantity) * 1.14975m,
                ProductDTO = x.Products.Select(p => new CartProductDTO
                {
                    id = p.Product.ID,
                    name = p.Product.Name,
                    Price = p.Product.Price,
                    DiscountPrice = p.Product.DiscountPrice,
                    Status = (int)p.Product.Status,
                    Amount = p.Quantity,
                    MaxQuantity = p.Product.UnitsInStock,
                    ImagesData = p.Product.Images.Select(i => new ImageDTO
                    {
                        ID = i.Id,
                        Alt = i.ImageAlt,
                        Order = i.Order,
                        Url = _domainService.GetCurrentDomain() + Constants.ImageApiRoute + i.Id.ToString()
                    }).FirstOrDefault(),
                }).ToList()
            }).ToList();

            return Ok(orders);
        }

        [HttpPost("getOrdersByNumber")]
		public IActionResult GetOrdersbyNumber([FromBody] string ordernumber)
		{
            if (ordernumber == null)
                return NotFound();

            Order? order = _context.Orders.Include(o => o.Products).ThenInclude(pc => pc.Product).ThenInclude(p => p.Images).FirstOrDefault(x => x.OrderNumber == ordernumber);

            if (order == null)
                return NotFound();

            OrderFullDTO orders = new OrderFullDTO
            {
                OrderStatus = order.OrderStatus,
                OrderNumber = order.OrderNumber,
                TotalBeforeTaxes = order.SubTotal,
                Total = order.SubTotal * 1.14975m,
                ProductDTO = order.Products.Select(p => new CartProductDTO
                {
                    id = p.Product.ID,
                    name = p.Product.Name,
                    Price = p.Product.Price,
                    DiscountPrice = p.Product.DiscountPrice,
                    Status = (int)p.Product.Status,
                    Amount = p.Quantity,
                    MaxQuantity = p.Product.UnitsInStock,
                    ImagesData = p.Product.Images.Select(i => new ImageDTO
                    {
                        ID = i.Id,
                        Alt = i.ImageAlt,
                        Order = i.Order,
                        Url = _domainService.GetCurrentDomain() + Constants.ImageApiRoute + i.Id.ToString()
                    }).FirstOrDefault(),
                }).ToList()
            };

			return Ok(orders);
		}

	}

}