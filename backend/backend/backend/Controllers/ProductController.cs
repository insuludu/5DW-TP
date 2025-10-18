using backend.Models;
using backend.Models_DTO;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;

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
		///		Alexis Bergeron
		///		Permet de creer un nouveaux produit a partir de la page de creation de produit
		///		[FromForm] permet la conversion de l'object form automatiquement
		/// </summary>
		/// <param name="newProduct">le produit convertie de json vers CreateProductDTO</param>
		/// <returns></returns>
		[HttpPost("CreateProduct")]
		public ActionResult CreateProduct([FromForm] CreateProductDTO newProduct)
		{
			string errorMessage = "";
			try
			{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}


				List<Category> ProductCategories = new List<Category>();
				foreach (string categories in newProduct.Categories)
				{
					Category cat = _context.Categories.FirstOrDefault(c => c.Name == categories)!;
					if (cat == null)
					{
						cat = new Category() { Name = categories };
						_context.Categories.Add(cat);
					}
					ProductCategories.Add(cat);
				}

				List<ProductImage> ProductImages = new List<ProductImage>();
				for (int x = 0; x < newProduct.ImagesData!.Count; x++)
				{
					ProductImage newimage = new ProductImage()
					{
						Order = x,
						ContentType = newProduct.ImagesData[x].ContentType,
						ImageAlt = newProduct.ImagesData[x].Name,
						ImageData = ImageController.ConvertToByteArray(newProduct.ImagesData[x])
					};
					ProductImages.Add(newimage);
					_context.ProductImages.Add(newimage);
				}

				_context.Products.Add(new Product()
				{
					Name = newProduct.Name,
					Description = newProduct.Description,
					Price = newProduct.Price,
					DiscountPrice = newProduct.DiscountPrice,
					UnitsInStock = newProduct.UnitsInStock,
					Categories = ProductCategories,
					Status = (ProductStatus)newProduct.Status,
					Images = ProductImages
				});

				_context.SaveChanges();
				return Ok();
			}
			catch (Exception)
			{
				errorMessage = "Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer." +
					"\n Si le problème persiste veuillez contacter un administrateur";
				return BadRequest(errorMessage);
			}
		}

		/// <summary>
		///     Alexis Bergeron
		///     Permet de récupérer les status disponible pour un produit
		/// </summary>
		/// <returns></returns>
		[HttpGet("ProductsStatus")]
		public ActionResult GetStatus()
		{
			List<string> statusList = new List<string>(Enum.GetNames(typeof(ProductStatus)));
			statusList.Remove(ProductStatus.COUNT.ToString());
			return Ok(statusList);
		}

		/// <summary>
		///     Alexis Bergeron
		///     Permet de récupérer les categoris disponible pour un produit
		/// </summary>
		/// <returns></returns>
		[HttpGet("ProductsCategories")]
		public ActionResult GetCategories()
		{
			List<string> statusList = _context.Categories.Select(c => c.Name).ToList();
			return Ok(statusList);
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
				p => new ShopProductDTO
				{
					ID = p.ID,
					Name = p.Name,
					Price = p.Price,
					DiscountedPrice = p.DiscountPrice,
					Status = p.Status,
					categories = p.Categories.Select(c => new CategoryDTO { ID = c.ID, Name = c.Name }).ToList(),
					imagesData = p.Images.Select(i => new ImageDTO
					{
						ID = i.Id,
						Alt = i.ImageAlt,
						Order = i.Order,
						Url = _domainService.GetCurrentDomain() + Constants.ImageApiRoute + i.Id.ToString()
					}).Where(i => i.Order <= 1).Take(2).OrderBy(i => i.Order).ToList()
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


        [HttpGet("SearchProducts")]
        public ActionResult SearchProducts([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("La recherche ne peut pas être vide.");

            List<ShopProductDTO> result = _context.Products
                .Where(p => 
					p.Name.ToLower().Contains(query.ToLower()) || 
					p.Description.ToLower().Contains(query.ToLower())
				)
                .Select(p => new ShopProductDTO
                {
                    ID = p.ID,
                    Name = p.Name,
                    Price = p.Price,
                    DiscountedPrice = p.DiscountPrice,
                    Status = p.Status,
                    categories = p.Categories.Select(c => new CategoryDTO { ID = c.ID, Name = c.Name }).ToList(),
                    imagesData = p.Images.Select(i => new ImageDTO
                    {
                        ID = i.Id,
                        Alt = i.ImageAlt,
                        Order = i.Order,
                        Url = _domainService.GetCurrentDomain() + Constants.ImageApiRoute + i.Id.ToString()
                    }).Where(i => i.Order <= 1).Take(2).OrderBy(i => i.Order).ToList()
                })
                .ToList();

            if (result.Count == 0)
                return NotFound();

            return Ok(result);
        }
    }
}
