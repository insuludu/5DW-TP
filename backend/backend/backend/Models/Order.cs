using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Order
    {
        public int OrderID { get; set; }

        // Relation avec User (Guid)
        public User? User { get; set; }
        public Guid? UserID { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Phone]
        public string PhoneNumber { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Province { get; set; }

        [Required]
        public string Country { get; set; }

        [Required]
        public string PostalCode { get; set; }

        [Required]
        public string OrderNumber { get; set; }

        [Required]
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;

        public List<OrderProducts> Products { get; set; } = new();

        public decimal SubTotal => Products.Sum(p =>
            (decimal)(p.DiscountPrice ?? p.Price) * p.Quantity
        );
    }
}