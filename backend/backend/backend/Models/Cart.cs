using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
	public class Cart
	{
		public int Id { get; set; }
		public User? User { get; set; }
		public Guid? UserID { get; set; }

		public List<productCart> Products { get; set; } = new();

	}

	public class productCart
	{
		public int Id { get; set; }
		public Product Product { get; set; }
		public int Amount { get; set; }
	}

}
