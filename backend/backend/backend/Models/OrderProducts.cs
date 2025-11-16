using System.ComponentModel.DataAnnotations;

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

        [Required]
        public float Price { get; set; }

        public float? DiscountPrice { get; set; } = null;

        public int Quantity { get; set; } = 0;
    }

}
