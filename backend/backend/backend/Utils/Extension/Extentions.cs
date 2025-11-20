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
        public static User ToUser(this RegisterForm form)
        {
            return new User
            {
                FirstName = form.FirstName,
                LastName = form.LastName,
                Email = form.Email,
                UserName = form.Email
            };
        }

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
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
