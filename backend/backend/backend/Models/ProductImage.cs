using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ProductImage
    {
        public int Id { get; set; }

        [Required]
        public int ProductID { get; set; }

        public Product Product { get; set; }

        [Required]
        public int Order { get; set; }

        [Required]
        public byte[]? ImageData { get; set; }

        [Required]
        public string ContentType { get; set; } = "image/png";

        public string ImageAlt { get; set; } = "Product Image";
    }
}