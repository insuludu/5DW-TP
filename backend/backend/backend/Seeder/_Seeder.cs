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
                Category superHero = new Category { Name = "Superhéro" };
                Category superVillain = new Category { Name = "Supervillain" };
                Category starFightersCollection = new Category { Name = "Star Fighters Collection" };
                Category starShip = new Category { Name = "Vaisseau Spatial" };
                Category cars = new Category { Name = "Voitures" };

                context.Set<Category>().AddRange([pikaCollection, toys, batBoyCollection, superHero, superVillain, starFightersCollection, starShip, cars]);

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
                ProductImage cosmicBasiliskImage0 = new ProductImage { ImageAlt = "Image de produit 1: Cosmic Basilisk", Order = 0, ImageData = GetImageFromFile("cosmic-basilisk-0.png"), ContentType = "image/png" };
                ProductImage cosmicBasiliskImage1 = new ProductImage { ImageAlt = "Image de produit 2: Cosmic Basilisk", Order = 1, ImageData = GetImageFromFile("cosmic-basilisk-1.png"), ContentType = "image/png" };
                ProductImage golemKnigthImage0 = new ProductImage { ImageAlt = "Image de produit 1: Golem Knigth", Order = 0, ImageData = GetImageFromFile("golem-knigth-0.png"), ContentType = "image/png" };
                ProductImage golemKnigthImage1 = new ProductImage { ImageAlt = "Image de produit 2: Golem Knigth", Order = 1, ImageData = GetImageFromFile("golem-knigth-1.png"), ContentType = "image/png" };
                ProductImage neoWyrmImage0 = new ProductImage { ImageAlt = "Image de produit 1: Neo Wyrm", Order = 0, ImageData = GetImageFromFile("neo-wyrm-0.png"), ContentType = "image/png" };
                ProductImage neoWyrmImage1 = new ProductImage { ImageAlt = "Image de produit 2: Neo Wyrm", Order = 1, ImageData = GetImageFromFile("neo-wyrm-1.png"), ContentType = "image/png" };
                ProductImage starforgeExplorerImage0 = new ProductImage { ImageAlt = "Image de produit 1: Starforge Explorer", Order = 0, ImageData = GetImageFromFile("starforge-explorer-0.png"), ContentType = "image/png" };
                ProductImage starforgeExplorerImage1 = new ProductImage { ImageAlt = "Image de produit 2: Starforge Explorer", Order = 1, ImageData = GetImageFromFile("starforge-explorer-1.png"), ContentType = "image/png" };
                ProductImage ironHaulerImage0 = new ProductImage { ImageAlt = "Image de produit 1: Iron Hauler", Order = 0, ImageData = GetImageFromFile("iron-hauler-0.png"), ContentType = "image/png" };
                ProductImage ironHaulerImage1 = new ProductImage { ImageAlt = "Image de produit 2: Iron Hauler", Order = 1, ImageData = GetImageFromFile("iron-hauler-1.png"), ContentType = "image/png" };
                ProductImage turboBlazeImage0 = new ProductImage { ImageAlt = "Image de produit 1: Turbo Blaze", Order = 0, ImageData = GetImageFromFile("turbo-blaze-0.png"), ContentType = "image/png" };
                ProductImage turboBlazeImage1 = new ProductImage { ImageAlt = "Image de produit 2: Turbo Blaze", Order = 1, ImageData = GetImageFromFile("turbo-blaze-1.png"), ContentType = "image/png" };
                ProductImage texDinocoImage0 = new ProductImage { ImageAlt = "Image de produit 1: Tex Dinoco", Order = 0, ImageData = GetImageFromFile("tex-dinoco-0.png"), ContentType = "image/png" };
                ProductImage texDinocoImage1 = new ProductImage { ImageAlt = "Image de produit 2: Tex Dinoco", Order = 1, ImageData = GetImageFromFile("tex-dinoco-1.png"), ContentType = "image/png" };
                ProductImage boltRacerImage0 = new ProductImage { ImageAlt = "Image de produit 1: Bolt Racer", Order = 0, ImageData = GetImageFromFile("bolt-racer-0.png"), ContentType = "image/png" };
                ProductImage boltRacerImage1 = new ProductImage { ImageAlt = "Image de produit 2: Bolt Racer", Order = 1, ImageData = GetImageFromFile("bolt-racer-1.png"), ContentType = "image/png" };
                ProductImage skyhawkStreakImage0 = new ProductImage { ImageAlt = "Image de produit 1: Skyhawk Streak", Order = 0, ImageData = GetImageFromFile("skyhawk-streak-0.png"), ContentType = "image/png" };
                ProductImage skyhawkStreakImage1 = new ProductImage { ImageAlt = "Image de produit 2: Skyhawk Streak", Order = 1, ImageData = GetImageFromFile("skyhawk-streak-1.png"), ContentType = "image/png" };
                ProductImage rustyHookImage0 = new ProductImage { ImageAlt = "Image de produit 1: Rusty Hook", Order = 0, ImageData = GetImageFromFile("rusty-hook-0.png"), ContentType = "image/png" };
                ProductImage rustyHookImage1 = new ProductImage { ImageAlt = "Image de produit 2: Rusty Hook", Order = 1, ImageData = GetImageFromFile("rusty-hook-1.png"), ContentType = "image/png" };

                context.Set<ProductImage>().AddRange([spiderChuImage0, spiderChuImage1, batChuImage0, batChuImage1, superChuImage0, superChuImage1, superGuyImage0, superGuyImage1, evilGuyImage0, evilGuyImage1, 
                    cosmicBasiliskImage0, cosmicBasiliskImage1, golemKnigthImage0, golemKnigthImage1, neoWyrmImage0, neoWyrmImage1, starforgeExplorerImage0, starforgeExplorerImage1, ironHaulerImage0, ironHaulerImage1,
                    turboBlazeImage0, turboBlazeImage1, texDinocoImage0, texDinocoImage1, boltRacerImage0, boltRacerImage1, skyhawkStreakImage0, skyhawkStreakImage1, rustyHookImage0, rustyHookImage1]);

                Product spiderChu = new Product { Name = "Spider-Chu", Description = "Spider-Chu est le meilleur compagnons pour vous accompagner dans vos aventures épiques !", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, DiscountPrice = 20.99f, Categories = [pikaCollection, toys], Status = ProductStatus.Available, UnitsInStock = 50, Images = [spiderChuImage0, spiderChuImage1] };
                Product batChu = new Product {  Name = "Bat-Chu", Description = "Bat-Chu est le meilleur compagnons pour vous accompagner dans vos aventures farfelues !", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [pikaCollection, batBoyCollection, toys], Status = ProductStatus.Available, UnitsInStock = 50, Images = [batChuImage0, batChuImage1] };
                Product superChu = new Product { Name = "Super-Chu", Description = "Super-Chu sera toujours là afin de vous aider à sauver le monde !", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [pikaCollection, toys], Status = ProductStatus.Available, UnitsInStock = 50, Images = [superChuImage0, superChuImage1] };
                Product superGuy = new Product { Name = "SuperGuy", Description = "SuperGuy est le sauveur de l'humanité. Il est le protecteur de ce monde et combat contre les machants comme EvilGuy.", CreationDate = DateTime.Now, Price = 29.99f, ModifyDate = DateTime.Now, Categories = [toys, superHero], Status = ProductStatus.Available, UnitsInStock = 100, Images = [superGuyImage0, superGuyImage1] };
                Product evilGuy = new Product { Name = "EvilGuy", Description = "EvilGuy est le destructeur de l'humanité. Il est le méchant de ce monde et combat contre les héros comme SuperGuy.", CreationDate = DateTime.Now, Price = 29.99f, ModifyDate = DateTime.Now, Categories = [toys, superVillain], Status = ProductStatus.Available, UnitsInStock = 100, Images = [evilGuyImage0, evilGuyImage1] };
                Product cosmicBasilisk = new Product { Name = "Cosmic Basilisk", Description = "Le Basilisk cosmique vous observe depuis les étoiles, un ajout mythique à votre collection!", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [toys, superVillain, starFightersCollection], Status = ProductStatus.Available, UnitsInStock = 50, Images = [cosmicBasiliskImage0, cosmicBasiliskImage1] };
                Product golemKnigth = new Product { Name = "Golem Knigth", Description = "Ce Chevalier Golem est prêt à défendre votre bureau contre toutes les menaces imaginables.", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [toys, superHero, starFightersCollection], Status = ProductStatus.Available, UnitsInStock = 50, Images = [golemKnigthImage0, golemKnigthImage1] };
                Product neoWyrm = new Product { Name = "Neo Wyrm", Description = "Le Neo Wyrm, un dragon cybernétique élégant et puissant pour votre collection de créatures épiques.", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [toys, superVillain, starFightersCollection], Status = ProductStatus.ComingSoon, UnitsInStock = 50, Images = [neoWyrmImage0, neoWyrmImage1] };
                Product starforgeExplorer = new Product { Name = "Starforge Explorer", Description = "Un explorateur courageux équipé pour les confins de l'espace. L'aventure vous attend!", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 29.99f, Categories = [toys, starShip, starFightersCollection], Status = ProductStatus.OutOfStock, UnitsInStock = 100, Images = [starforgeExplorerImage0, starforgeExplorerImage1] };
                Product ironHauler = new Product { Name = "Iron Hauler", Description = "Le transporteur de fer, un véhicule robuste conçu pour déplacer de lourdes charges à travers la galaxie.", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 29.99f, Categories = [toys, starShip, starFightersCollection], Status = ProductStatus.Unavailable, UnitsInStock = 100, Images = [ironHaulerImage0, ironHaulerImage1] };
                Product turboBlaze = new Product { Name = "Turbo Blaze", Description = "Le Turbo Blaze est la voiture de course la plus rapide sur la piste. Une fusée de vitesse pure!", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [toys, cars], Status = ProductStatus.Available, UnitsInStock = 50, Images = [turboBlazeImage0, turboBlazeImage1] };
                Product texDinoco = new Product { Name = "Tex Dinoco", Description = "Tex Dinoco, le magnat du pétrole connu pour ses designs élégants et sa puissance sous le capot.", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [toys, cars], Status = ProductStatus.Available, UnitsInStock = 50, Images = [texDinocoImage0, texDinocoImage1] };
                Product boltRacer = new Product { Name = "Bolt Racer", Description = "Le Bolt Racer, une merveille d'ingénierie aérodynamique, conçu pour fendre l'air.", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 24.99f, Categories = [toys, cars], Status = ProductStatus.Available, UnitsInStock = 50, Images = [boltRacerImage0, boltRacerImage1] };
                Product skyhawkStreak = new Product { Name = "Skyhawk Streak", Description = "Le Skyhawk Streak n'est pas qu'une voiture, c'est un jet sur roues, atteignant des vitesses incroyables!", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 29.99f, Categories = [toys], Status = ProductStatus.Available, UnitsInStock = 100, Images = [skyhawkStreakImage0, skyhawkStreakImage1] };
                Product rustyHook = new Product { Name = "Rusty Hook", Description = "Rusty Hook, un vieux camion de remorquage fiable et charmant, toujours prêt pour la rescousse.", CreationDate = DateTime.Now, ModifyDate = DateTime.Now, Price = 29.99f, Categories = [toys, cars], Status = ProductStatus.Available, UnitsInStock = 100, Images = [rustyHookImage0, rustyHookImage1] };

                context.Set<Product>().AddRange([spiderChu, batChu, superChu, superGuy, evilGuy, cosmicBasilisk, golemKnigth, neoWyrm, starforgeExplorer, ironHauler, turboBlaze, texDinoco, boltRacer, skyhawkStreak, rustyHook]);
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
