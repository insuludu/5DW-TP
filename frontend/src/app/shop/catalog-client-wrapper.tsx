"use client";

import { ShopProductDTO } from "@/interfaces";
import ShopCard from "./shop-card";
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
    searchQuery?: string;
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

export default function CatalogClientWrapper({ 
    initialProducts, 
    hasMore, 
    searchQuery,
    filters 
}: CatalogClientWrapperProps) {
    const [additionalProducts, setAdditionalProducts] = useState<ShopProductDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(hasMore);
    const [loading, setLoading] = useState(false);

    const fetchMoreProducts = async () => {
        if (loading || !hasNextPage) return;

        setLoading(true);
        try {
            const nextPage = currentPage + 1;
            
            // Construire l'URL avec TOUS les paramètres
            const params = new URLSearchParams();
            params.append("page", nextPage.toString());
            params.append("pageSize", "12");
            
            if (searchQuery) {
                params.append("query", searchQuery);
            }
            if (filters.sort) params.append("sort", filters.sort);
            if (filters.minPrice) params.append("minPrice", filters.minPrice);
            if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
            if (filters.status) params.append("status", filters.status);
            if (filters.discount) params.append("discount", filters.discount);
            if (filters.categories) params.append("categories", filters.categories);
            
            const endpoint = searchQuery 
                ? `/api/shop/search-products?${params.toString()}`
                : `/api/shop/catalog-products?${params.toString()}`;
            
            const response = await fetch(`${nextUrl}${endpoint}`, { cache: "no-store" });

            if (!response.ok) {
                throw new Error("Erreur lors du chargement");
            }

            const data: PaginatedResponse = await response.json();
            
            setAdditionalProducts((prev) => [...prev, ...data.products]);
            setHasNextPage(data.hasNextPage);
            setCurrentPage(nextPage);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {additionalProducts.map((product) => (
                <div key={product.id} className="mb-3 rounded-3 overflow-hidden">
                    <ShopCard product={product} />
                </div>
            ))}

            {hasNextPage && (
                <>
                    <div style={{ gridColumn: '1 / -1', height: '0' }}></div>
                    
                    <div 
                        style={{ 
                            gridColumn: '1 / -1',
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '2rem 0',
                            width: '100%'
                        }}
                    >
                        <button
                            onClick={fetchMoreProducts}
                            disabled={loading}
                            className="btn btn-lg px-5"
                            style={{
                                backgroundColor: "var(--backgroundPrimary)",
                                color: "var(--textLight)",
                                border: "none",
                                minWidth: "250px"
                            }}
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
                </>
            )}
        </>
    );
}