using Azure;
using backend.Models;
using backend.Models_DTO;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Formats.Asn1;
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
                if (newProduct.Categories != null)
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
                if (newProduct.ImagesData != null)
                {
                    for (int x = 0; x < newProduct.ImagesData!.Count; x++)
                    {
                        ProductImage newimage = new ProductImage()
                        {
                            Order = x,
                            ContentType = newProduct.ImagesData[x].ContentType,
                            ImageAlt = newProduct.ImagesData[x].FileName,
                            ImageData = ImageController.ConvertToByteArray(newProduct.ImagesData[x])
                        };
                        ProductImages.Add(newimage);
                        _context.ProductImages.Add(newimage);
                    }
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
                return Ok(new { success = true });
            }
            catch (Exception)
            {
                errorMessage = "Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer." +
                    "\n Si le problème persiste veuillez contacter un administrateur";
                return BadRequest(errorMessage);
            }
        }



        /// <summary>
        ///		Alexis Bergeron
        ///		Permet de modifier un produit a partir de la page de modification de produit
        ///		[FromForm] permet la conversion de l'object form automatiquement
        /// </summary>
        /// <param name="newProduct">le produit convertie de json vers CreateProductDTO</param>
        /// <returns></returns>
        [HttpPost("EditProduct")]
        public ActionResult EditProduct([FromForm] EditProductDTO editedProduct)
        {
            string errorMessage = "";
            try
            {
                Product product = _context.Products.Where(p => p.ID == editedProduct.ID).Include(p => p.Images).Include(p => p.Categories).FirstOrDefault()!;

                if (product == null)
                    throw new Exception("Le produit en modification est introuvable");

                List<Category> ProductCategories = new List<Category>();
                if (editedProduct.Categories != null)
                    foreach (string categories in editedProduct.Categories)
                    {
                        Category cat = _context.Categories.FirstOrDefault(c => c.Name == categories)!;
                        if (cat == null)
                        {
                            cat = new Category() { Name = categories };
                            _context.Categories.Add(cat);
                        }
                        ProductCategories.Add(cat);
                    }

                List<ProductImage> images = new List<ProductImage>();
                if (editedProduct.ImagesData != null || editedProduct.ImagesData!.Count != 0)
                    for (int x = 0; x < editedProduct.ImagesData.Count; x++)
                    {
                        var imageForm = editedProduct.ImagesData[x];

                        if (imageForm.File != null)
                        {
                            ProductImage newimage = new ProductImage()
                            {
                                Order = x,
                                ContentType = imageForm.File.ContentType,
                                ImageAlt = imageForm.File.FileName,
                                ImageData = ImageController.ConvertToByteArray(imageForm.File)
                            };
                            images.Add(newimage);
                            _context.ProductImages.Add(newimage);
                        }
                        else if (imageForm.Image != null)
                        {
                            var imageDB = _context.ProductImages.FirstOrDefault(i => i.Id == imageForm.Image.ID);
                            if (imageDB != null)
                                images.Add(imageDB);
                        }
                    }


                product.Name = editedProduct.Name;
                product.Description = editedProduct.Description;
                product.Price = editedProduct.Price;
                product.DiscountPrice = editedProduct.DiscountPrice;
                product.UnitsInStock = editedProduct.UnitsInStock;
                product.Status = (ProductStatus)editedProduct.Status;
                product.Categories = ProductCategories;
                product.Images = images;

                _context.SaveChanges();

                return Ok(new { success = true });
            }
            catch (Exception)
            {
                errorMessage = "Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer." +
                    "\n Si le problème persiste veuillez contacter un administrateur";
                return BadRequest(errorMessage);
            }
        }

        /// <summary>
        ///		Alexis Bergeron
        ///		Permet d'obtenir les informations du produit a modifier
        /// </summary>
        /// <param name="id">L'id du produit</param>
        /// <returns></returns>
        [HttpGet("GetEditProduct/{id}")]
        public ActionResult GetEditProduct(int id)
        {
            var result = _context.Products
                .Where(p => p.ID == id)
                .Select(p => new EditProductDTO
                {
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    DiscountPrice = p.DiscountPrice,
                    Status = (int)p.Status,
                    Categories = p.Categories.Select(c => c.Name).ToList(),
                    UnitsInStock = p.UnitsInStock,
                    ImagesData = p.Images.Select(i => new ImageFormDTO
                    {
                        File = null,
                        Image = new ImageDTO
                        {
                            ID = i.Id,
                            Alt = i.ImageAlt,
                            Order = i.Order,
                            Url = _domainService.GetCurrentDomain() + Constants.ImageApiRoute + i.Id.ToString()
                        }
                    }).OrderBy(i => i.Image!.Order).ToList(),
                })
                .FirstOrDefault();

            if (result == null)
                return NotFound();

            return Ok(result);
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
            List<string> statusList = _context.Categories.Select(c => c.Name).ToList();
            return Ok(statusList);
        }

        /// <summary>
        ///     Simon Déry - 12 octobre 2025
        ///     Modifier par Alexandre Chagnon le 18 octobre 2025 pour la pagination
        ///     Modifié pour ajouter le tri et les filtres côté serveur
        ///     Correction du tri par Jacob Manseau - 19 octobre 2025
        ///     Permet d'obtenir des produits pour afficher dans le catalogue
        /// </summary>
        /// <returns></returns>
        [HttpGet("CatalogProducts")]
        public ActionResult GetCatalogProducts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 3,
            [FromQuery] string? sort = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] string? status = null,
            [FromQuery] string? discount = null,
            [FromQuery] string? categories = null)
        {
            // Validation des paramètres
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 3;

            // Commencer la requête
            IQueryable<Product> query = _context.Products;

            // Appliquer les filtres

            // Filtre de prix minimum (utilise le prix avec rabais s'il existe)
            if (minPrice.HasValue)
            {
                query = query.Where(p => (decimal)(p.DiscountPrice != null ? p.DiscountPrice.Value : p.Price) >= minPrice.Value);
            }

            // Filtre de prix maximum
            if (maxPrice.HasValue)
            {
                query = query.Where(p => (decimal)(p.DiscountPrice != null ? p.DiscountPrice.Value : p.Price) <= maxPrice.Value);
            }

            // Filtre de rabais
            if (!string.IsNullOrEmpty(discount))
            {
                if (discount == "discount")
                {
                    query = query.Where(p => p.DiscountPrice != null);
                }
                else if (discount == "no-discount")
                {
                    query = query.Where(p => p.DiscountPrice == null);
                }
            }

            // Filtre de catégories
            if (!string.IsNullOrEmpty(categories))
            {
                var categoryIds = categories.Split(',').Select(int.Parse).ToList();
                query = query.Where(p => p.Categories.Any(c => categoryIds.Contains(c.ID)));
            }

            // Filtre de statut/disponibilité
            if (!string.IsNullOrEmpty(status))
            {
                ProductStatus statusEnum = status switch
                {
                    "available" => ProductStatus.Available,
                    "unavailable" => ProductStatus.Unavailable,
                    "outofstock" => ProductStatus.OutOfStock,
                    "comingsoon" => ProductStatus.ComingSoon,
                    _ => ProductStatus.Available
                };

                query = query.Where(p => p.Status == statusEnum);
            }

            // Appliquer le tri APRÈS les filtres
            // IMPORTANT: On doit séparer les tris par prix des autres pour éviter les problèmes avec Entity Framework
            switch (sort)
            {
                case "price-asc":
                    query = query.OrderBy(p => p.DiscountPrice != null ? p.DiscountPrice : p.Price);
                    break;
                case "price-desc":
                    query = query.OrderByDescending(p => p.DiscountPrice != null ? p.DiscountPrice : p.Price);
                    break;
                case "name-asc":
                    query = query.OrderBy(p => p.Name);
                    break;
                case "name-desc":
                    query = query.OrderByDescending(p => p.Name);
                    break;
                default:
                    query = query.OrderBy(p => p.ID); // Par défaut
                    break;
            }

            // Calculer le nombre total de produits (après filtres)
            int totalProducts = query.Count();
            int totalPages = (int)Math.Ceiling(totalProducts / (double)pageSize);

            // Récupérer les produits pour la page demandée (APRÈS le tri)
            List<ShopProductDTO> products = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
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
                }).ToList();

            // Créer la réponse avec métadonnées
            var result = new PaginatedProductsDTO
            {
                Products = products,
                CurrentPage = page,
                PageSize = pageSize,
                TotalProducts = totalProducts,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            };

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

        /// <summary>
        ///		Jacob Manseau - 17 octobre 2025
        ///		Modifié par Alexandre Chagnon - 19 octobre 2025 pour la pagination
        ///		Permet la recherche de produit pour le catalog avec pagination
        /// </summary>
        /// <param name="query">Le texte rechercher</param>
        /// <param name="page">Numéro de la page</param>
		/// <param name="pageSize">Nombre de produits par page</param>
        /// <returns></returns>
        [HttpGet("SearchProducts")]
        public ActionResult SearchProducts([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int pageSize = 3)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("La recherche ne peut pas être vide.");

            // Validation des paramètres
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 3;

            // Requête de base pour la recherche
            var searchQuery = _context.Products
                .Where(p =>
                    p.Name.ToLower().Contains(query.ToLower()) ||
                    p.Description.ToLower().Contains(query.ToLower()) ||
                    p.Categories.Any(c => c.Name.ToLower().Contains(query.ToLower()))
                );

            // Calculer le nombre total de résultats
            int totalProducts = searchQuery.Count();
            int totalPages = (int)Math.Ceiling(totalProducts / (double)pageSize);

            // Appliquer la pagination
            List<ShopProductDTO> products = searchQuery
                .OrderBy(p => p.ID)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
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

            // Créer la réponse avec métadonnées
            var result = new PaginatedProductsDTO
            {
                Products = products,
                CurrentPage = page,
                PageSize = pageSize,
                TotalProducts = totalProducts,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            };

            return Ok(result);
        }

        /// <summary>
        ///		Jacob Manseau - 18 octobre 2025
        ///		Permet d'obtenir les informations d'un produit cliquer
        /// </summary>
        /// <param name="id">L'id du produit cliquer</param>
        /// <returns></returns>
        [HttpGet("GetProductById/{id}")]
        public ActionResult GetProductById(int id)
        {
            var result = _context.Products
                .Where(p => p.ID == id)
                .Select(p => new DetailProductDTO
                {
                    ID = p.ID,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    DiscountedPrice = p.DiscountPrice,
                    Status = p.Status,
                    UnitsInStock = p.UnitsInStock,
                    categories = p.Categories.Select(c => new CategoryDTO { ID = c.ID, Name = c.Name }).ToList(),
                    imagesData = p.Images.Select(i => new ImageDTO
                    {
                        ID = i.Id,
                        Alt = i.ImageAlt,
                        Order = i.Order,
                        Url = _domainService.GetCurrentDomain() + Constants.ImageApiRoute + i.Id.ToString()
                    }).OrderBy(i => i.Order).ToList(),
                })
                .FirstOrDefault();

            if (result == null)
                return NotFound();

            return Ok(result);
        }
    }
}