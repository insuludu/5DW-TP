using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models_DTO
{
    public class RegisterForm
    {
        [Required]
        [JsonPropertyName("firstName")]
        public string FirstName { get; set; }

        [Required]
        [JsonPropertyName("lastName")]
        public string LastName { get; set; }

        [Required]
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [Required]
        [JsonPropertyName("password")]
        public string Password { get; set; }

        [Required]
        [JsonPropertyName("passwordConfirm")]
        public string PasswordConfirm { get; set; }
    }
}
