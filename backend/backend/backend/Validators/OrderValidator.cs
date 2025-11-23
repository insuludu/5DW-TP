using System.Text.RegularExpressions;
using backend.Controllers;

namespace backend.Validators
{
    public class OrderValidationResult
    {
        public bool IsValid { get; set; }
        public Dictionary<string, List<string>> Errors { get; set; } = new();

        public void AddError(string field, string message)
        {
            if (!Errors.ContainsKey(field))
            {
                Errors[field] = new List<string>();
            }
            Errors[field].Add(message);
        }
    }

    public static class OrderValidator
    {
        // Validation du prénom et nom
        public static void ValidateName(string value, string fieldName, OrderValidationResult result)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                result.AddError(fieldName, $"{fieldName} est requis");
                return;
            }

            if (value.Length < 2)
            {
                result.AddError(fieldName, $"{fieldName} doit contenir au moins 2 caractères");
            }

            if (value.Length > 50)
            {
                result.AddError(fieldName, $"{fieldName} ne peut pas dépasser 50 caractères");
            }

            // Accepter lettres, espaces, traits d'union, apostrophes (pour noms comme "O'Brien", "Jean-Paul")
            if (!Regex.IsMatch(value, @"^[a-zA-ZÀ-ÿ\s'-]+$"))
            {
                result.AddError(fieldName, $"{fieldName} contient des caractères invalides");
            }
        }

        // Validation de l'email selon RFC 5322 simplifié mais robuste
        public static void ValidateEmail(string email, OrderValidationResult result)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                result.AddError("Email", "L'adresse courriel est requise");
                return;
            }

            if (email.Length > 254) // RFC 5321
            {
                result.AddError("Email", "L'adresse courriel est trop longue");
                return;
            }

            // Pattern robuste pour validation email
            var emailPattern = @"^[a-zA-Z0-9]([a-zA-Z0-9._+-])*[a-zA-Z0-9]@[a-zA-Z0-9]([a-zA-Z0-9.-])*\.[a-zA-Z]{2,}$";

            if (!Regex.IsMatch(email, emailPattern))
            {
                result.AddError("Email", "L'adresse courriel n'est pas valide");
                return;
            }

            // Vérifier que la partie locale (avant @) n'est pas trop longue
            var parts = email.Split('@');
            if (parts[0].Length > 64) // RFC 5321
            {
                result.AddError("Email", "La partie avant @ est trop longue");
            }

            // Éviter les doubles points
            if (email.Contains(".."))
            {
                result.AddError("Email", "L'adresse courriel contient des points consécutifs invalides");
            }
        }

        // Validation du numéro de téléphone (formats nord-américains flexibles)
        public static void ValidatePhoneNumber(string phone, OrderValidationResult result)
        {
            if (string.IsNullOrWhiteSpace(phone))
            {
                result.AddError("PhoneNumber", "Le numéro de téléphone est requis");
                return;
            }

            // Retirer tous les caractères non-numériques pour la validation
            var digitsOnly = Regex.Replace(phone, @"[^\d]", "");

            // Formats acceptés:
            // - 10 chiffres: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
            // - 11 chiffres: +1 (123) 456-7890, 1-123-456-7890
            if (digitsOnly.Length == 10)
            {
                // Format nord-américain sans indicatif pays
                if (!Regex.IsMatch(phone, @"^[\d\s().-]+$"))
                {
                    result.AddError("PhoneNumber", "Le numéro de téléphone contient des caractères invalides");
                }
            }
            else if (digitsOnly.Length == 11 && digitsOnly.StartsWith("1"))
            {
                // Format nord-américain avec indicatif pays
                if (!Regex.IsMatch(phone, @"^[\+]?1?[\d\s().-]+$"))
                {
                    result.AddError("PhoneNumber", "Le numéro de téléphone contient des caractères invalides");
                }
            }
            else
            {
                result.AddError("PhoneNumber", "Le numéro de téléphone doit contenir 10 chiffres (format nord-américain)");
            }
        }

        // Validation de l'adresse civique
        public static void ValidateAddress(string address, OrderValidationResult result)
        {
            if (string.IsNullOrWhiteSpace(address))
            {
                result.AddError("Address", "L'adresse civique est requise");
                return;
            }

            if (address.Length < 5)
            {
                result.AddError("Address", "L'adresse civique doit contenir au moins 5 caractères");
            }

            if (address.Length > 100)
            {
                result.AddError("Address", "L'adresse civique ne peut pas dépasser 100 caractères");
            }

            // Doit contenir au moins un chiffre (numéro civique)
            if (!Regex.IsMatch(address, @"\d"))
            {
                result.AddError("Address", "L'adresse doit contenir un numéro civique");
            }
        }

        // Validation de la ville
        public static void ValidateCity(string city, OrderValidationResult result)
        {
            if (string.IsNullOrWhiteSpace(city))
            {
                result.AddError("City", "La ville est requise");
                return;
            }

            if (city.Length < 2)
            {
                result.AddError("City", "Le nom de la ville doit contenir au moins 2 caractères");
            }

            if (city.Length > 50)
            {
                result.AddError("City", "Le nom de la ville ne peut pas dépasser 50 caractères");
            }

            // Accepter lettres, espaces, traits d'union, apostrophes
            if (!Regex.IsMatch(city, @"^[a-zA-ZÀ-ÿ\s'-]+$"))
            {
                result.AddError("City", "Le nom de la ville contient des caractères invalides");
            }
        }

        // Validation de la province (formats canadiens)
        public static void ValidateProvince(string province, OrderValidationResult result)
        {
            if (string.IsNullOrWhiteSpace(province))
            {
                result.AddError("Province", "La province est requise");
                return;
            }

            var validProvinces = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                // Codes à 2 lettres
                "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT",
                // Noms complets
                "Alberta", "British Columbia", "Manitoba", "New Brunswick",
                "Newfoundland and Labrador", "Nova Scotia", "Northwest Territories",
                "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Québec",
                "Saskatchewan", "Yukon",
                // Noms français
                "Colombie-Britannique", "Nouveau-Brunswick", "Terre-Neuve-et-Labrador",
                "Nouvelle-Écosse", "Territoires du Nord-Ouest", "Île-du-Prince-Édouard"
            };

            if (!validProvinces.Contains(province))
            {
                result.AddError("Province", "Province canadienne invalide");
            }
        }

        // Validation du pays
        public static void ValidateCountry(string country, OrderValidationResult result)
        {
            if (string.IsNullOrWhiteSpace(country))
            {
                result.AddError("Country", "Le pays est requis");
                return;
            }

            // Pour l'instant, accepter seulement Canada (commerce électronique canadien)
            var validCountries = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "Canada", "CA", "CAN"
            };

            if (!validCountries.Contains(country))
            {
                result.AddError("Country", "Actuellement, nous livrons seulement au Canada");
            }
        }

        // Validation du code postal canadien (format A1A 1A1)
        public static void ValidatePostalCode(string postalCode, OrderValidationResult result)
        {
            if (string.IsNullOrWhiteSpace(postalCode))
            {
                result.AddError("PostalCode", "Le code postal est requis");
                return;
            }

            // Retirer les espaces pour la validation
            var cleanedPostalCode = postalCode.Replace(" ", "").Replace("-", "").ToUpper();

            // Format canadien: A1A1A1 ou A1A 1A1
            // A = Lettre (sauf D, F, I, O, Q, U, W, Z)
            // 1 = Chiffre
            var canadianPostalCodePattern = @"^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$";

            if (!Regex.IsMatch(cleanedPostalCode, canadianPostalCodePattern))
            {
                result.AddError("PostalCode", "Le code postal n'est pas valide (format: A1A 1A1)");
                return;
            }

            // Vérifier certaines restrictions spécifiques
            // W et Z ne sont pas utilisés dans la première position
            if (cleanedPostalCode[0] == 'W' || cleanedPostalCode[0] == 'Z')
            {
                result.AddError("PostalCode", "Le code postal commence par une lettre invalide");
            }
        }

        // Validation complète du formulaire
        public static OrderValidationResult ValidateOrder(CreateOrderDto orderDto)
        {
            var result = new OrderValidationResult { IsValid = true };

            // Valider tous les champs
            ValidateName(orderDto.FirstName, "FirstName", result);
            ValidateName(orderDto.LastName, "LastName", result);
            ValidateEmail(orderDto.Email, result);
            ValidatePhoneNumber(orderDto.PhoneNumber, result);
            ValidateAddress(orderDto.Address, result);
            ValidateCity(orderDto.City, result);
            ValidateProvince(orderDto.Province, result);
            ValidateCountry(orderDto.Country, result);
            ValidatePostalCode(orderDto.PostalCode, result);

            // Valider les items du panier
            if (orderDto.CartItems == null || !orderDto.CartItems.Any())
            {
                result.AddError("CartItems", "Le panier ne peut pas être vide");
            }
            else
            {
                foreach (var item in orderDto.CartItems)
                {
                    if (item.ProductId <= 0)
                    {
                        result.AddError("CartItems", $"ID de produit invalide: {item.ProductId}");
                    }
                    if (item.Quantity <= 0)
                    {
                        result.AddError("CartItems", $"Quantité invalide pour le produit {item.ProductId}");
                    }
                }
            }

            result.IsValid = !result.Errors.Any();
            return result;
        }
    }
}