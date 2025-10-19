"use client";

import { ShopProductDTO } from "@/interfaces";
import ShopCard from "./shop-card";
import styles from "@/app/styles/page.module.css";
import { useState } from "react";

const nextUrl = process.env.NEXT_PUBLIC_API_MIDDLEWARE_URL;

interface PaginatedResponse {
    products: ShopProductDTO[];
    currentPage: number;
    pageSize: number;
    totalProducts: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface CatalogClientWrapperProps {
    initialProducts: ShopProductDTO[];
    hasMore: boolean;
    filters: {
        sort?: string;
        minPrice?: string;
        maxPrice?: string;
        status?: string;
        discount?: string;
        categories?: string;
        collections?: string;
    };
}

function getFinalPrice(product: ShopProductDTO): number {
    return product.discountedPrice ?? product.price;
}

function filterProducts(
    products: ShopProductDTO[],
    filters: CatalogClientWrapperProps["filters"]
): ShopProductDTO[] {
    let filtered = [...products];

    if (filters.minPrice) {
        const min = parseFloat(filters.minPrice);
        filtered = filtered.filter((p) => getFinalPrice(p) >= min);
    }

    if (filters.maxPrice) {
        const max = parseFloat(filters.maxPrice);
        filtered = filtered.filter((p) => getFinalPrice(p) <= max);
    }

    if (filters.discount) {
        if (filters.discount === "discount") {
            filtered = filtered.filter((p) => p.discountedPrice != null);
        } else if (filters.discount === "no-discount") {
            filtered = filtered.filter((p) => p.discountedPrice == null);
        }
    }

    if (filters.categories) {
        const categoryIds = filters.categories.split(",").map((id) => parseInt(id));
        filtered = filtered.filter((p) =>
            p.categories.some((cat) => categoryIds.includes(cat.id))
        );
    }

    if (filters.status) {
        switch (filters.status) {
            case "available":
                filtered = filtered.filter((p) => Number(p.status) > 0);
                break;
            case "unavailable":
                filtered = filtered.filter((p) => Number(p.status) === 0);
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

export default function CatalogClientWrapper({ initialProducts, hasMore, filters }: CatalogClientWrapperProps) {
    const [additionalProducts, setAdditionalProducts] = useState<ShopProductDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(hasMore);
    const [loading, setLoading] = useState(false);

    const fetchMoreProducts = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const nextPage = currentPage + 1;
            console.log(` Chargement de la page ${nextPage}`);
            
            const response = await fetch(
                `${nextUrl}/api/shop/catalog-products?page=${nextPage}&pageSize=3`,
                { cache: "no-store" }
            );

            if (!response.ok) {
                throw new Error("Erreur lors du chargement");
            }

            const data: PaginatedResponse = await response.json();
            console.log(` Reçu ${data.products.length} produits de la page ${nextPage}`, data.products);
            
            setAdditionalProducts((prev) => [...prev, ...data.products]);
            setHasNextPage(data.hasNextPage);
            setCurrentPage(nextPage);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    // Appliquer les filtres et tri seulement aux produits additionnels
    const filteredAdditionalProducts = filterProducts(additionalProducts, filters);
    const sortedAdditionalProducts = sortProducts(filteredAdditionalProducts, filters.sort);

    return (
        <>
            {/* Produits additionnels s'intègrent directement dans la grille parente */}
            {sortedAdditionalProducts.map((p) => (
                <div key={p.id} className="mb-3 rounded-3 overflow-hidden">
                    <ShopCard product={p} />
                </div>
            ))}

            {/* Bouton "Charger plus" */}
            {hasNextPage && (
                <div className="text-center py-4">
                    <button
                        onClick={fetchMoreProducts}
                        disabled={loading}
                        className="btn btn-primary btn-lg px-5"
                        style={{ minWidth: "200px" }}
                    >
                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Chargement...
                            </>
                        ) : (
                            "Afficher plus de produits"
                        )}
                    </button>
                </div>
            )}

            {/* Message de fin */}
            {!hasNextPage && additionalProducts.length > 0 && (
                <div className="text-center py-4">
                    <p className="text-muted">
                        Vous avez vu tous les produits disponibles
                    </p>
                </div>
            )}
        </>
    );
}