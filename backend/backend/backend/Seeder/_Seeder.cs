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
                Category superHero = new Category { Name = "Superhéro" };
                Category superVillain = new Category { Name = "Supervillain" };

                context.Set<Category>().AddRange([pikaCollection, toys, batBoyCollection, starFightersCollection, spaceFriendCollection, superHero, superVillain]);

                ProductImage spiderChuImage0 = new ProductImage { ImageAlt = "Image de produit 1: Spider-Chu", Order = 0, ImageData = GetImageFromFile("spider-chu-0.png"), ContentType = "image/png"};
                ProductImage spiderChuImage1 = new ProductImage { ImageAlt = "Image de produit 2: Spider-Chu", Order = 1, ImageData = GetImageFromFile("spider-chu-1.png"), ContentType = "image/png"};
                ProductImage batChuImage0 = new ProductImage { ImageAlt = "Image de produit 1: Bat-Chu", Order = 0, ImageData = GetImageFromFile("bat-chu-0.png"), ContentType = "image/png"};
                ProductImage batChuImage1 = new ProductImage { ImageAlt = "Image de produit 2: Bat-Chu", Order = 1, ImageData = GetImageFromFile("bat-chu-1.png"), ContentType = "image/png"};
                ProductImage superChuImage0 = new ProductImage { ImageAlt = "Image de produit 1: Super-Chu", Order = 0, ImageData = GetImageFromFile("super-chu-0.png"), ContentType = "image/png"};
                ProductImage superChuImage1 = new ProductImage { ImageAlt = "Image de produit 2: Super-Chu", Order = 1, ImageData = GetImageFromFile("super-chu-1.png"), ContentType = "image/png"};
                ProductImage superGuyImage0 = new ProductImage { ImageAlt = "Image de produit 1: SuperGuy", Order = 0, ImageData = GetImageFromFile("superguy-0.png"), ContentType = "image/png" };
                ProductImage superGuyImage1 = new ProductImage { ImageAlt = "Image de produit 2: SuperGuy", Order = 1, ImageData = GetImageFromFile("superguy-1.png"), ContentType = "image/png" };
                ProductImage evilGuyImage0 = new ProductImage { ImageAlt = "Image de produit 1: EvilGuy", Order = 0, ImageData = GetImageFromFile("evilguy-0.png"), ContentType = "image/png" };
                ProductImage evilGuyImage1 = new ProductImage { ImageAlt = "Image de produit 2: EvilGuy", Order = 1, ImageData = GetImageFromFile("evilguy-1.png"), ContentType = "image/png" };

                context.Set<ProductImage>().AddRange([spiderChuImage0, spiderChuImage1, batChuImage0, batChuImage1, superChuImage0, superChuImage1, superGuyImage0, superGuyImage1, evilGuyImage0, evilGuyImage1]);

                Product spiderChu = new Product { Name = "Spider-Chu", Description = "Spider-Chu est le meilleur compagnons pour vous accompagner dans vos aventures épiques !", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, DiscountPrice = 20.99f, Categories = [pikaCollection, toys], Status = ProductStatus.Available, UnitsInStock = 50, Images = [spiderChuImage0, spiderChuImage1] };
                Product batChu = new Product {  Name = "Bat-Chu", Description = "Bat-Chu est le meilleur compagnons pour vous accompagner dans vos aventures farfelues !", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [pikaCollection, batBoyCollection, toys], Status = ProductStatus.Available, UnitsInStock = 50, Images = [batChuImage0, batChuImage1] };
                Product superChu = new Product { Name = "Super-Chu", Description = "Super-Chu sera toujours là afin de vous aider à sauver le monde !", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [pikaCollection, toys], Status = ProductStatus.Available, UnitsInStock = 50, Images = [superChuImage0, superChuImage1] };
                Product superGuy = new Product { Name = "SuperGuy", Description = "SuperGuy est le sauveur de l'humanité. Il est le protecteur de ce monde et combat contre les machants comme EvilGuy.", CreationDate = DateTime.Now, Price = 29.99f, ModifyDate = DateTime.Now, Categories = [toys, superHero], Status = ProductStatus.Available, UnitsInStock = 100, Images = [superGuyImage0, superGuyImage1] };
                Product evilGuy = new Product { Name = "EvilGuy", Description = "EvilGuy est le destructeur de l'humanité. Il est le méchant de ce monde et combat contre les héros comme SuperGuy.", CreationDate = DateTime.Now, Price = 29.99f, ModifyDate = DateTime.Now, Categories = [toys, superVillain], Status = ProductStatus.Available, UnitsInStock = 100, Images = [evilGuyImage0, evilGuyImage1] };

                context.Set<Product>().AddRange([spiderChu, batChu, superChu, superGuy, evilGuy]);
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
