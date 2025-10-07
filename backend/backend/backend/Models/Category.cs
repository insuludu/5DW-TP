using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Category
    {
        public int ID { get; set; }

        [Required]
        public string Name { get; set; }

        public List<Product> Products { get; set; } = new List<Product>();
    }
}
