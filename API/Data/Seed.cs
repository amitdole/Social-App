using API.Entities;
using Azure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync())
            {
                return;
            }

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            //var options = new JsonSerializerOptions
            //{
            //    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            //};

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"}
            };

            foreach (var role in roles)
            {
                var result1 = await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                using var hmac = new HMACSHA512();

                user.UserName = user.UserName.ToLower();

                //user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Password"));

                //user.PasswordSalt = hmac.Key;

                //context.Users.Add(user);

                var result2 = await userManager.CreateAsync(user, "P$ssw0rd");

                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser
            {
                UserName = "admin",
            };

            var result3 = await userManager.CreateAsync(admin, "P$ssw0rd");
            await userManager.AddToRolesAsync(admin, new[] {"Admin", "Moderator"});


            //try
            //{
            //    await context.SaveChangesAsync();
            //}
            //catch (Exception ex)
            //{
            //}

        }
    }
}
