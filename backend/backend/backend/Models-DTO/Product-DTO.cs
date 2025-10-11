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
}
