using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public enum ProductStatus
    {
        Available,
        Unavailable,
        OutOfStock,
        ComingSoon
    }

    public class Product
    {
        public int ID { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public float Price { get; set; }

        public float? DiscountPrice { get; set; } = null;

        public int UnitsInStock { get; set; } = 0;
        
        // Ici l'on veut dire les units réservés, à voir
        // public int UnitsOnOrder { get; set; } = 0;

        public List<Category> Categories { get; set; } = new List<Category>();

        public List<ProductImage> Images { get; set; } = new List<ProductImage>();

        public ProductStatus Status {  get; set; } = ProductStatus.Available;

        public DateTime CreationDate { get; set; } = DateTime.Now;

        public DateTime ModifyDate { get; set; } = DateTime.Now;
    }
}
