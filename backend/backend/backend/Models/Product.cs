using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum ProductStatus
    {
        Available,
        Unavailable,
        OutOfStock,
        ComingSoon,
        COUNT
    }

    public class Product
    {
        public int ID { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        // Argent = decimal (JAMAIS float)
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountPrice { get; set; } = null;

        public int UnitsInStock { get; set; } = 0;

        public List<Category> Categories { get; set; } = new();

        public List<ProductImage> Images { get; set; } = new();

        public ProductStatus Status { get; set; } = ProductStatus.Available;

        public DateTime CreationDate { get; set; } = DateTime.Now;

        public DateTime ModifyDate { get; set; } = DateTime.Now;
    }
}
