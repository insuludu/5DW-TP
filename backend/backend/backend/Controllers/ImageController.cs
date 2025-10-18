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

        /// <summary>
        ///     Simon Déry - 10 octobre 2025
        ///     Permet de renvoyer le contenu d'une image au client avec son id
        /// </summary>
        /// <param name="id">L'id de l'image</param>
        /// <returns>Contenu de l'image</returns>
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

		public static byte[] ConvertToByteArray(IFormFile file)
		{
			using (var memoryStream = new MemoryStream())
			{
				file.CopyTo(memoryStream);
				return memoryStream.ToArray();
			}
		}

	}
}
