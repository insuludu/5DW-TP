using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class UserAdress
    {
        public int ID { get; set; }
        public int StreetNumber { get; set; }
        public string AppartementNumber { get; set; }
        public string StreetName { get; set; }
        public string City { get; set; }
        public string StateProvince { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }

        public Guid UserID { get; set; }
        [ForeignKey(nameof(UserID))]
        public User User { get; set; }
    }
}
