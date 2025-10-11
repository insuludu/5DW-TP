using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Seeder
{
    public static class Seeder
    {
        public static void Seed(DbContext context)
        {
            if (!context.Set<Category>().Any() && !context.Set<ProductImage>().Any() && !context.Set<Product>().Any())
            {
                Category pikaCollection = new Category { Name = "PikaCollection" };
                Category toys = new Category { Name = "Jouets" };
                Category batBoyCollection = new Category { Name = "Bat Boy Collection" };
                Category starFightersCollection = new Category { Name = "Star Fighters Collection" };
                Category spaceFriendCollection = new Category { Name = "Space Friend Collection" };

                context.Set<Category>().AddRange([pikaCollection, toys, batBoyCollection, starFightersCollection, spaceFriendCollection]);

                ProductImage spiderChuImage1 = new ProductImage { ImageAlt = "Image de produit 1: Spider-Chu", Order = 0, ImageData = GetImageFromFile("spider-chu-1.png"), ContentType = "image/png"};
                ProductImage batChuImage1 = new ProductImage { ImageAlt = "Image de produit 1: Bat-Chu", Order = 0, ImageData = GetImageFromFile("bat-chu-1.png"), ContentType = "image/png"};
                ProductImage superChuImage1 = new ProductImage { ImageAlt = "Image de produit 1: Super-Chu", Order = 0, ImageData = GetImageFromFile("super-chu-1.png"), ContentType = "image/png"};

                context.Set<ProductImage>().AddRange([spiderChuImage1, batChuImage1, superChuImage1]);

                Product spiderChu = new Product { Name = "Spider-Chu", Description = "Spider-Chu est le meilleur compagnons pour vous accompagner dans vos aventures épiques !", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [pikaCollection, toys], Status = ProductStatus.Available, UnitsInStock = 50, Images = [spiderChuImage1] };
                Product batChu = new Product {  Name = "Bat-Chu", Description = "Bat-Chu est le meilleur compagnons pour vous accompagner dans vos aventures farfelues !", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [pikaCollection, batBoyCollection, toys], Status = ProductStatus.Available, UnitsInStock = 50, Images = [batChuImage1] };
                Product superChu = new Product { Name = "Super-Chu", Description = "Super-Chu sera toujours là afin de vous aider à sauver le monde !", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [pikaCollection, toys], Status = ProductStatus.Available, UnitsInStock = 50, Images = [superChuImage1] };

                context.Set<Product>().AddRange([spiderChu, batChu, superChu]);
                context.SaveChanges();
            }
        }

        /// <summary>
        ///     Simon Déry - 10 octobre 2025
        ///     Permet de retourner le data d'une image depuis le nom du fichier.
        ///     Ce fichier doit se retouver dans /Seeder/Images
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        private static byte[] GetImageFromFile(string fileName)
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Seeder", "Images", fileName);
            if (!File.Exists(filePath))
                throw new FileNotFoundException();
            return File.ReadAllBytes(filePath);
        }
    }
}
