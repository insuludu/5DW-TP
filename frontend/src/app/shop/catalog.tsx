import { ShopProductDTO } from "@/interfaces";
import ShopCard from "./shop-card";
import styles from "@/app/styles/page.module.css";
import CatalogClientWrapper from "./catalog-client-wrapper";

const nextUrl = process.env.API_MIDDLEWARE_URL;

interface PaginatedResponse {
    products: ShopProductDTO[];
    currentPage: number;
    pageSize: number;
    totalProducts: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

async function GetCatalogProducts(
    search?: string, 
    page: number = 1, 
    sort?: string,
    minPrice?: string,
    maxPrice?: string,
    status?: string,
    discount?: string,
    categories?: string
): Promise<PaginatedResponse | ShopProductDTO[]> {
    let endpoint = "";
    
    if (search) {
        endpoint = `/api/shop/search-products?query=${encodeURIComponent(search)}`;
    } else {
        // Construire l'URL avec tous les paramètres
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("pageSize", "3");
        
        if (sort) params.append("sort", sort);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (status) params.append("status", status);
        if (discount) params.append("discount", discount);
        if (categories) params.append("categories", categories);
        
        endpoint = `/api/shop/catalog-products?${params.toString()}`;
    }

    const response = await fetch(nextUrl + endpoint, {
        cache: "no-store",
    });

    if (response.status === 404) {
        return search ? [] : { products: [], currentPage: 1, pageSize: 3, totalProducts: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false };
    }

    if (!response.ok) {
        throw new Error("Incapable de communiquer avec le middleware");
    }

    return response.json();
}

interface CatalogProps {
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    status?: string;
    discount?: string;
    categories?: string;
    collections?: string;
    search?: string;
}

export default async function Catalog({
    sort,
    minPrice,
    maxPrice,
    status,
    discount,
    categories,
    collections,
    search,
}: CatalogProps) {
    // Passer TOUS les paramètres à l'API (tri + filtres)
    const data = await GetCatalogProducts(search, 1, sort, minPrice, maxPrice, status, discount, categories);
    
    // Gérer les deux types de réponse (recherche vs pagination)
    let products: ShopProductDTO[];
    let hasNextPage = false;
    
    if (Array.isArray(data)) {
        // Réponse de recherche (tableau simple)
        products = data;
    } else {
        // Réponse paginée
        products = data.products;
        hasNextPage = data.hasNextPage;
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-5">
                {search && (
                    <p className="fs-5 mb-4 text-center">
                        Résultats pour « {search} »
                    </p>
                )}
                <p className="text-muted">
                    {search 
                        ? "Aucun produit ne correspond à votre recherche."
                        : "Aucun produit disponible."
                    }
                </p>
            </div>
        );
    }

    return (
        <div>
            {search && (
                <p className="fs-5 mb-4 text-center">
                    Résultats pour « {search} »
                </p>
            )}

            {products.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted">
                        Aucun produit ne correspond à vos critères de filtrage.
                    </p>
                </div>
            ) : (
                <>
                    <div className={styles.catalogGridContainer}>
                        {products.map((p) => (
                            <div key={p.id} className="mb-3 rounded-3 overflow-hidden">
                                <ShopCard product={p} />
                            </div>
                        ))}
                        
                        {/* Composant client pour charger plus de produits */}
                        {!search && hasNextPage && (
                            <CatalogClientWrapper
                                initialProducts={products}
                                hasMore={hasNextPage}
                                searchQuery={search}
                                filters={{ sort, minPrice, maxPrice, status, discount, categories, collections }}
                            />
                        )}
                    </div>

                    {!hasNextPage && products.length > 0 && (
                        <div className="text-center py-4">
                            <p className="text-muted">
                                Vous avez vu tous les produits disponibles
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}