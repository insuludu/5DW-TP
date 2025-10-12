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
