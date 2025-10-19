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

async function GetCatalogProducts(search?: string, page: number = 1): Promise<PaginatedResponse | ShopProductDTO[]> {
    const endpoint = search 
        ? `/api/shop/search-products?query=${encodeURIComponent(search)}&page=${page}&pageSize=1`
        : `/api/shop/catalog-products?page=${page}&pageSize=1`;

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

function getFinalPrice(product: ShopProductDTO): number {
    return product.discountedPrice ?? product.price;
}

function filterProducts(
    products: ShopProductDTO[],
    minPrice?: string,
    maxPrice?: string,
    status?: string,
    discount?: string,
    categories?: string,
    collections?: string
): ShopProductDTO[] {
    let filtered = [...products];

    // --- Prix minimum ---
    if (minPrice) {
        const min = parseFloat(minPrice);
        filtered = filtered.filter((p) => getFinalPrice(p) >= min);
    }

    // --- Prix maximum ---
    if (maxPrice) {
        const max = parseFloat(maxPrice);
        filtered = filtered.filter((p) => getFinalPrice(p) <= max);
    }

    // --- Rabais ---
    if (discount) {
        if (discount === "discount") {
            filtered = filtered.filter((p) => p.discountedPrice != null);
        } else if (discount === "no-discount") {
            filtered = filtered.filter((p) => p.discountedPrice == null);
        }
    }

    // --- Catégories ---
    if (categories) {
        const categoryIds = categories.split(",").map((id) => parseInt(id));
        filtered = filtered.filter((p) =>
            p.categories.some((cat) => categoryIds.includes(cat.id))
        );
    }

    // --- Collections ---
    if (collections) {
        const collectionIds = collections.split(",").map((id) => parseInt(id));
        filtered = filtered.filter((p) =>
            p.categories?.some((c) => collectionIds.includes(c.id))
        );
    }

    // --- Disponibilité (Status) ---
    if (status) {
        // Correspondance avec l'enum backend : Available=0, Unavailable=1, OutOfStock=2, ComingSoon=3
        // Le status peut être un string ou un number, on gère les deux cas
        switch (status) {
            case "available":
                filtered = filtered.filter((p) => {
                    const statusValue = typeof p.status === 'string' ? parseInt(p.status) : Number(p.status);
                    return statusValue === 0;
                });
                break;
            case "unavailable":
                filtered = filtered.filter((p) => {
                    const statusValue = typeof p.status === 'string' ? parseInt(p.status) : Number(p.status);
                    return statusValue === 1;
                });
                break;
            case "outofstock":
                filtered = filtered.filter((p) => {
                    const statusValue = typeof p.status === 'string' ? parseInt(p.status) : Number(p.status);
                    return statusValue === 2;
                });
                break;
            case "comingsoon":
                filtered = filtered.filter((p) => {
                    const statusValue = typeof p.status === 'string' ? parseInt(p.status) : Number(p.status);
                    return statusValue === 3;
                });
                break;
        }
    }

    return filtered;
}

function sortProducts(
    products: ShopProductDTO[],
    sortType?: string
): ShopProductDTO[] {
    const sorted = [...products];

    switch (sortType) {
        case "price-asc":
            return sorted.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
        case "price-desc":
            return sorted.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
        case "name-asc":
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case "name-desc":
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        default:
            return sorted;
    }
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
    const data = await GetCatalogProducts(search, 1);
    
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

    const filteredProducts = filterProducts(
        products,
        minPrice,
        maxPrice,
        status,
        discount,
        categories,
        collections
    );
    const sortedProducts = sortProducts(filteredProducts, sort);

    return (
        <div>
            {search && (
                <p className="fs-5 mb-4 text-center">
                    Résultats pour « {search} »
                </p>
            )}

            {sortedProducts.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted">
                        Aucun produit ne correspond à vos critères de filtrage.
                    </p>
                </div>
            ) : (
                <>
                    <div className={styles.catalogGridContainer}>
                        {sortedProducts.map((p) => (
                            <div key={p.id} className="mb-3 rounded-3 overflow-hidden">
                                <ShopCard product={p} />
                            </div>
                        ))}
                        
                        {/* Composant client intégré dans la MÊME grille */}
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
                </>
            )}
        </div>
    );
}