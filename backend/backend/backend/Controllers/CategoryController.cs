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
