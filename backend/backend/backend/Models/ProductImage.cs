using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ProductImage
    {
        public int Id { get; set; }

        [Required]
        public int ProductID { get; set; }

        public Product Product { get; set; }

        public byte[]? ImageData { get; set; }

        public string ImageAlt { get; set; } = "Product Image";
    }
}
