using Azure;
using backend.Models;
using backend.Models_DTO;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Formats.Asn1;
using System.Security.Claims;
using System.Text.Json;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private IDomainService _domainService;

        public CartController(ApplicationDbContext context, UserManager<User> userManager, IDomainService domainService)
        {
            _context = context;
            _userManager = userManager;
            _domainService = domainService;
        }

        /// <summary>
        ///		Alexis Bergeron
        ///		Permet d'ajouter un produit au cart de l'utilisateur
        /// </summary>
        /// <param name="Id">l'id du produit a ajouter</param>
        /// <returns></returns>

        [HttpPost("add")]
        public async Task<ActionResult> addProductAsync([FromBody] int id)
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Unauthorized userId" });

            User? user = await _userManager.FindByIdAsync(userId);
            Product? product = _context.Products.Find(id);

            if (user == null)
                return Unauthorized(new { message = "Unauthorized userId" });
            if (product == null)
                return NotFound();

            Cart? cart = _context.Carts.Include(x => x.Products).FirstOrDefault(x => x.UserID == user.Id);


            productCart productcart = new productCart()
            {
                Product = product,
                Amount = 1
            };

            if (cart == null)
            {

                cart = new Cart()
                {
                    UserID = user.Id,
                    Products = { productcart }
                };
                _context.Carts.Add(cart);

            }
            else
            {
                cart.Products.Add(productcart);
            }
            _context.SaveChanges();

            return Ok();
        }

        /// <summary>
        ///		Alexis Bergeron
        ///		Permet de vider le panier de l'utilisateur connecter
        /// </summary>
        /// <returns></returns>
        [HttpPost("clear")]
        public async Task<ActionResult> clearProduct()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Unauthorized userId" });

            User? user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return Unauthorized(new { message = "Unauthorized userId" });

<<<<<<< HEAD
            Cart? cart = _context.Carts.FirstOrDefault(x => x.UserID == user.Id);

            if (cart != null)
            {
                var productCarts = await _context.ProductCarts
    .Where(pc => pc.Id == cart.Id)
    .ToListAsync();

                _context.ProductCarts.RemoveRange(productCarts);

                _context.Carts.Remove(cart);

                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        /// <summary>
        ///		Alexis Bergeron
        ///		Permet de vider le panier de l'utilisateur connecter
        /// </summary>
        /// <returns></returns>
        [HttpGet("products")]
        public async Task<ActionResult> getProduct()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Unauthorized userId" });

            User? user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return Unauthorized(new { message = "Unauthorized userId" });

            Cart? cart = _context.Carts.Include(x => x.Products).ThenInclude(x => x.Product).ThenInclude(x => x.Images).FirstOrDefault(x => x.UserID == user.Id);

            if (cart == null)
                return NotFound();

            var result = cart.Products
                .Select(p => new CartProductDTO
                {
                    id = p.Product.ID,
                    name = p.Product.Name,
                    Price = p.Product.Price,
                    DiscountPrice = p.Product.DiscountPrice,
                    Status = (int)p.Product.Status,
                    Amount = p.Amount,
                    MaxQuantity = p.Product.UnitsInStock,
                    ImagesData = p.Product.Images.Select(i => new ImageDTO
                    {
                        ID = i.Id,
                        Alt = i.ImageAlt,
                        Order = i.Order,
                        Url = _domainService.GetCurrentDomain() + Constants.ImageApiRoute + i.Id.ToString()
                    }).FirstOrDefault(),
                })
                .ToArray();

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        /// <summary>
        ///		Alexis Bergeron
        ///		Permet de supprimer un produit au cart de l'utilisateur
        /// </summary>
        /// <param name="Id">l'id du produit a suppriemr</param>
        /// <returns></returns>
        [HttpPost("remove")]
        public async Task<ActionResult> removeProduct([FromBody] int productId)
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Unauthorized userId" });

            User? user = await _userManager.FindByIdAsync(userId);
            Product? product = _context.Products.Find(productId);

            if (user == null)
                return Unauthorized(new { message = "Unauthorized userId" });
            if (product == null)
                return NotFound();

            Cart? cart = _context.Carts.Include(x => x.Products).FirstOrDefault(x => x.UserID == user.Id);

            if (cart != null)
            {
                productCart productcart = cart.Products.First(x => x.Product == product);
                cart.Products.Remove(productcart);
                _context.ProductCarts.Remove(productcart);
                _context.SaveChanges();
            }

            return Ok();
        }

        public class idquantity
        {
            public int productId { get; set; }
            public int quantity { get; set; }
        }

        /// <summary>
        ///		Alexis Bergeron
        ///		Permet de mettre a jour la quantity d'un produit du cart de l'utilisateur
        /// </summary>
        /// <param name="Id">l'id du produit a modifier</param>
        /// <returns></returns>
        [HttpPost("update-quantity")]
        public async Task<ActionResult> UpdateQuantityProduct([FromBody] idquantity values)
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Unauthorized userId" });

            User? user = await _userManager.FindByIdAsync(userId);
            Product? product = _context.Products.Find(values.productId);

            if (user == null)
                return Unauthorized(new { message = "Unauthorized userId" });
            if (product == null)
                return NotFound();

            Cart? cart = _context.Carts.Include(x => x.Products).FirstOrDefault(x => x.UserID == user.Id);

            if (cart != null)
            {
                productCart productcart = cart.Products.First(x => x.Product == product);
                productcart.Amount = values.quantity;
                _context.SaveChanges();
            }

            return Ok();
        }

        /// <summary>
        ///		Alexis Bergeron
        ///		Permet de mettre a jour la quantity d'un produit du cart de l'utilisateur
        /// </summary>
        /// <param name="Id">l'id du produit a modifier</param>
        /// <returns></returns>
        [HttpGet("quantity/{productId}")]
        public async Task<ActionResult> QuantityProduct(int productId)
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Unauthorized userId" });

            User? user = await _userManager.FindByIdAsync(userId);
            Product? product = _context.Products.Find(productId);

            if (user == null)
                return Unauthorized(new { message = "Unauthorized userId" });

            if (product == null)
                return NotFound();

            Cart? cart = _context.Carts.Include(x => x.Products).FirstOrDefault(x => x.UserID == user.Id);

            if (cart != null)
            {

                productCart? productcart = cart.Products.FirstOrDefault(x => x.Product == product);
                return Ok(new { quantity = productcart?.Amount ?? 0 });
            }

            return Ok(new { quantity = 0 });
        }
    }
}