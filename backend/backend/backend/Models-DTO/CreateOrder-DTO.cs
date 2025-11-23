using System.ComponentModel.DataAnnotations;

public class CreateOrderDto
{
    // Informations client
    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
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

    // Items du panier envoyés depuis le frontend
    [Required]
    public List<CartItemDto> CartItems { get; set; }
}