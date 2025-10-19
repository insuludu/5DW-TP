import { ShopProductDTO } from "@/interfaces";
import ShopCard from "./shop-card";
import styles from "@/app/styles/page.module.css";

const nextUrl = process.env.API_MIDDLEWARE_URL;

async function GetCatalogProducts(search?: string): Promise<ShopProductDTO[]> {
    const endpoint = search ? `/api/shop/search-products?query=${encodeURIComponent(search)}` : `/api/shop/catalog-products`;

    const response = await fetch(nextUrl + endpoint, {
        cache: "no-store",
    });

    if (response.status === 404) {
        return [];
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
    const products: ShopProductDTO[] = await GetCatalogProducts(search);

    if (!products || products.length === 0)
        return (
            <div className="text-center py-5">
                <p className="text-muted">
                    Aucun produit ne correspond à votre recherche.
                </p>
            </div>
        );

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
            {sortedProducts.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted">
                        Aucun produit ne correspond à vos critères de filtrage.
                    </p>
                </div>
            ) : (
                <div className={styles.catalogGridContainer}>
                    {sortedProducts.map((p) => (
                        <div key={p.id} className="mb-3 rounded-3 overflow-hidden">
                            <ShopCard product={p} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}