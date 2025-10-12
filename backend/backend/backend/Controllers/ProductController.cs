using backend.Models;
using backend.Models_DTO;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private ApplicationDbContext _context;
        private IDomainService _domainService;
        public ProductController(ApplicationDbContext context, IDomainService domainService)
        {
            _context = context;
            _domainService = domainService;
        }

        /// <summary>
        ///     Simon Déry - 12 octobre 2025
        ///     Permet d'obtenir des produits pour afficher dans le catalogue
        /// </summary>
        /// <returns></returns>
        [HttpGet("CatalogProducts")]
        public ActionResult GetCatalogProducts()
        {
            List<ShopProductDTO> result = _context.Products.Select(
                p => new ShopProductDTO { 
                    ID = p.ID, 
                    Name = p.Name, 
                    Price = p.Price, 
                    DiscountedPrice = p.DiscountPrice, 
                    Status = p.Status,
                    categories = p.Categories.Select(c => new CategoryDTO { ID = c.ID, Name = c.Name }).ToList(),
                    imagesData = p.Images.Select(i => new ImageDTO { ID = i.Id, Alt = i.ImageAlt, Order = i.Order, 
                        Url = _domainService.GetCurrentDomain() + Constants.ImageApiRoute + i.Id.ToString() }).Where(i => i.Order <= 1).Take(2).OrderBy(i => i.Order).ToList()
                }).ToList();

            if (result.Count == 0)
                return NotFound();

            return Ok(result);
        }

        /// <summary>
        ///     Simon Déry - 10 octobre 2025
        ///     Permet d'obtenir les produits vedettes pour la page d'accueil
        /// </summary>
        /// <param name="count">Nombre de produit à aller chercher</param>
        /// <returns>List<StarProductDTO></returns>
        [HttpGet("StarProducts")]
        public ActionResult GetStarProducts([FromQuery] int count = 1)
        {
            List<StarProductDTO> result = _context.Products.Select(p => new StarProductDTO
            {
                ID = p.ID,
                Name = p.Name,
                ImageData = p.Images.Select(i => new ImageDTO
                {
                    ID = i.Id,
                    Alt = i.ImageAlt,
                    Order = i.Order,
                    Url = _domainService.GetCurrentDomain() + Constants.ImageApiRoute + i.Id.ToString()
                }).FirstOrDefault(i => i.Order == 0)
            }).Take(count).ToList();

            if (result.Count == 0)
                return NotFound();

            return Ok(result);
        }
    }
}
