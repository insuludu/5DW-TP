using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class OrderProducts
    {
        public int OrderProductsID { get; set; }

        public Order Order { get; set; }
        public int OrderID { get; set; }

        public Product Product { get; set; }
        public int ProductID { get; set; }

        [Required]
        public string Name { get; set; }

        // Argent = decimal (jamais float)
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountPrice { get; set; } = null;

        public int Quantity { get; set; } = 0;
    }
}
