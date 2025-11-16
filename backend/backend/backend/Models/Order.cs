using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Order
    {
        public int OrderID { get; set; }

        // public User? User { get; set; }
        // public int? UserID { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;
        public List<OrderProducts> Products { get; set; } = new();
    }
}
