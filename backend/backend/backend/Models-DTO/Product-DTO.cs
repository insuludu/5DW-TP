namespace backend.Models_DTO
{
    /// <summary>
    ///     Simon Déry - 10 octobre 2025
    ///     Produit en vedette sur le page d'accueil
    /// </summary>
    public class StarProductDTO
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public ImageDTO? ImageData { get; set; }
    }

    public class ShopProductDTO
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public float? DiscountedPrice { get; set; }
        public List<CategoryDTO>? categories { get; set; }
        public List<ImageDTO>? imagesData { get; set; }
    }

    public class CategoryDTO
    {
        public int ID { get; set; }
        public string Name { get; set; }
    }

}
