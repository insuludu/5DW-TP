using backend.Models;
using backend.Models_DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Utils.Extension
{
    public static class Extensions
    {
        /// <summary>
        ///     Simon Déry - 20 Novembre 2025
        ///     Permet de trasnformer un forumalire de création en utilisateur identity
        /// </summary>
        /// <param name="form">Le formulaire d'inscription rempli</param>
        /// <returns>Le nouvel utilisateur créé</returns>
        public static User ToUser(this RegisterForm form)
        {
            return new User
            {
                FirstName = form.FirstName,
                LastName = form.LastName,
                Email = form.Email,
                UserName = form.Email,
                PhoneNumber = form.PhoneNumber
            };
        }

        /// <summary>
        ///     Simon Déry - 21 Novembre 2025
        ///     Permet de générer un JWT pour un utilisateur Identity
        /// </summary>
        /// <param name="userManager">Extension de usermanager</param>
        /// <param name="user">L'utilisateur associé au nouveau JWT</param>
        /// <returns>Le string du token JWt</returns>
        public async static Task<string> GenerateJwtTokenAsync(this UserManager<User> userManager, User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new(ClaimTypes.Email, user.Email),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            IList<string> roles = await userManager.GetRolesAsync(user);

            foreach (string role in roles)
            {
                claims.Add(new(ClaimTypes.Role, role));
            }

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("s85Wo8weW4aausbUNnpXd7omaa9wPI5W"));
            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            JwtSecurityToken token = new JwtSecurityToken(
                issuer: "http://localhost:3001",
                audience: "http://localhost:3000",
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
