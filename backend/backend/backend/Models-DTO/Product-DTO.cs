using backend.Models;
using System.ComponentModel.DataAnnotations;

namespace backend.Models_DTO
{
    /// <summary>
    ///     Simon Déry - 10 octobre 2025
    ///     Produit en vedette sur le page d'accueil
    /// </summary>
    public class StarProductDTO
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public ImageDTO? ImageData { get; set; }
    }

    public class ShopProductDTO
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public float? DiscountedPrice { get; set; }
        public ProductStatus Status { get; set; }
        public List<CategoryDTO>? categories { get; set; }
        public List<ImageDTO>? imagesData { get; set; }
    }

    public class DetailProductDTO
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
        public float? DiscountedPrice { get; set; }
		public int UnitsInStock { get; set; }
        public ProductStatus Status { get; set; }
		public List<CategoryDTO>? categories { get; set; }
        public List<ImageDTO>? imagesData { get; set; }
    }

	public class EditProductDTO
	{
		public int ID { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public float Price { get; set; }
		public float? DiscountPrice { get; set; }
		public int UnitsInStock { get; set; }
		public int Status { get; set; }
		public List<string>? Categories { get; set; }
		public List<ImageFormDTO>? ImagesData { get; set; }
	}

	public class CreateProductDTO
	{
		[Required(ErrorMessage = "Le nom du produit est requis.")]
		[StringLength(100, MinimumLength = 3, ErrorMessage = "Le nom doit contenir entre 2 et 100 caractères.")]
		public string Name { get; set; }

		[Required(ErrorMessage = "La description est requise.")]
		[StringLength(1000, MinimumLength = 5, ErrorMessage = "La description doit avoir entre 5 et 1000 caractères.")]
		public string Description { get; set; }

		[Required(ErrorMessage = "Le prix est requis.")]
		[Range(0.00f, 999999.99f, ErrorMessage = "Le prix doit être supérieur ou éguale à 0")]
		public float Price { get; set; }

		[Range(0.00f, 999999.99f, ErrorMessage = "Le prix en rabais doit être supérieur ou éguale à 0")]
		public float? DiscountPrice { get; set; }

		[Required(ErrorMessage = "Le nombre d'unités en stock est requis.")]
		[Range(0, int.MaxValue, ErrorMessage = "Le stock doit être positif.")]
		public int UnitsInStock { get; set; }

		[Required(ErrorMessage = "Au moins une catégorie doit être sélectionnée.")]
		[MinLength(1, ErrorMessage = "Sélectionnez au moins une catégorie.")]
		public string[] Categories { get; set; }

		[Required(ErrorMessage = "Le statut est requis.")]
		[Range(0, (int)ProductStatus.COUNT, ErrorMessage = "Le statut doit être valide.")]
		public int Status { get; set; }

		// Optional: Validate uploaded images
		[MaxLength(10, ErrorMessage = "Vous ne pouvez pas téléverser plus de 10 images.")]
		public List<IFormFile>? ImagesData { get; set; }
	}

	public class ImageFormDTO
	{
		public IFormFile? File { get; set; }
		public ImageDTO? Image { get; set; }
	}

    /// <summary>
    ///     Alexandre Chagnon - 18 octobre 2025
    ///     DTO pour la pagination des produits Contient les produits et les métadonnées de pagination
    /// </summary>
    public class PaginatedProductsDTO
    {
        public List<ShopProductDTO> Products { get; set; } = new List<ShopProductDTO>();
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalProducts { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }
}
