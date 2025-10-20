using backend.Models;
using backend.Models_DTO;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : Controller
    {
        private ApplicationDbContext _context;
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        ///     Simon Déry - 10 octobre 2025
        ///     Permet d'obtenir toutes les catégories, utilisé dans la page produit pour le aside de filtres
        /// </summary>
        /// <returns>List<CategoryDTO></returns>
        [HttpGet("All")]
        public ActionResult Get()
        {
            List<CategoryDTO> result = _context.Categories.Select(p => new CategoryDTO
            {
                ID = p.ID,
                Name = p.Name, 
            }).ToList();

            if (result.Count == 0)
                return NotFound();

            return Ok(result);
        }

        /// <summary>
        ///     Simon Déry - 19 octobre 2025
        ///     Permet d'obtenir les catégories vedettes pour la page d'accueil
        /// </summary>
        /// <param name="count">Nombre de catégories à aller chercher</param>
        /// <returns>List<CategoryDTO></returns>
        [HttpGet("StarCategories")]
        public ActionResult Get([FromQuery] int count = 1)
        {
            List<CategoryDTO> result = _context.Categories.Select(p => new CategoryDTO
            {
                ID = p.ID,
                Name = p.Name,
            }).Take(count).ToList();

            if (result.Count == 0)
                return NotFound();

            return Ok(result);
        }
    }
}
