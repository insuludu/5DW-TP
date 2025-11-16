using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class User : IdentityUser<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<UserAdress> Adresses { get; set; } = new();
    }
}
