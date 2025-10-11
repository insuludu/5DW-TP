using backend.Models;
using backend.Models_DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private ApplicationDbContext _context;
        public ImageController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        [Produces("image/png", "image/jpeg")]
        [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
        public ActionResult Get(int id)
        {
            var img = _context.ProductImages.Where(pi => pi.Id == id)
                .Select(pi => new {
                    pi.ContentType,
                    pi.ImageData
                }).FirstOrDefault();

            if (img == null || img.ImageData == null)
                return NotFound();

            return File(img.ImageData, img.ContentType);
        }

    }
}
