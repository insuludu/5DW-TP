namespace backend.Services
{
    public interface IDomainService
    {
        /// <summary>
        ///     Simon Déry - 10 octobre 2025
        ///     Permet de retourner le domain name de l'application (ex: http://loclahost:3001)
        /// </summary>
        /// <returns>String du nom de doamine complet</returns>
        public string GetCurrentDomain();
    }

    public class DomainService : IDomainService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public DomainService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        ///     Implémentation concrète de l'interface
        /// </summary>
        public string GetCurrentDomain() 
        {
            return $"{_httpContextAccessor.HttpContext!.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
        }
    }
}
