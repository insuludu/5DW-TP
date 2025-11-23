
using System.ComponentModel.DataAnnotations;

public class FieldValidationRequest
{
    [Required]
    public string FieldName { get; set; }

    public string Value { get; set; }
}