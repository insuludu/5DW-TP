using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class User : IdentityUser<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<UserAddress> Adresses { get; set; } = new();
    }
}
