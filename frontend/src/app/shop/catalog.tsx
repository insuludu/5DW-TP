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
): Promise<PaginatedResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", "12");
    
    if (search) {
        params.append("query", search);
    }
    if (sort) params.append("sort", sort);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (status) params.append("status", status);
    if (discount) params.append("discount", discount);
    if (categories) params.append("categories", categories);
    
    const endpoint = search 
        ? `/api/shop/search-products?${params.toString()}`
        : `/api/shop/catalog-products?${params.toString()}`;

    const response = await fetch(nextUrl + endpoint, {
        cache: "no-store",
    });

    if (response.status === 404) {
        return { products: [], currentPage: 1, pageSize: 3, totalProducts: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false };
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
    const data = await GetCatalogProducts(search, 1, sort, minPrice, maxPrice, status, discount, categories);
    
    const products = data.products;
    const hasNextPage = data.hasNextPage;

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

            <div className={styles.catalogGridContainer}>
                {products.map((p) => (
                    <div key={p.id} className="mb-3 rounded-3 overflow-hidden">
                        <ShopCard product={p} />
                    </div>
                ))}
                
                {/* IMPORTANT: Enlevez !search */}
                {hasNextPage && (
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
        </div>
    );
}