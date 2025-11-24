using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Seeder
{
    public static class UserSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

            string adminEmail = "admin@admin.com";

            var admin = await userManager.FindByEmailAsync(adminEmail);

            if (admin == null)
            {
                admin = new User
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "Admin",
                    LastName = "Account",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(admin, "SuperSecret_123"); // MOT DE PASSE ADMIN!!!!
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }

            var allUsers = userManager.Users.ToList();
            foreach (var user in allUsers)
            {
                if (!await userManager.IsInRoleAsync(user, "User") && !await userManager.IsInRoleAsync(user, "Admin"))
                {
                    await userManager.AddToRoleAsync(user, "User");
                }
            }
        }
    }
}