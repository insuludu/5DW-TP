import { NextResponse } from "next/server";
import { ShopProductDTO } from "@/interfaces"

const apiURL = process.env.API_BACKEND_URL + "/api/product/CatalogProducts"

interface PaginatedResponse {
    products: ShopProductDTO[];
    currentPage: number;
    pageSize: number;
    totalProducts: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export async function GET(request: Request) {
    try {
        // Extraire TOUS les paramètres de l'URL
        const { searchParams } = new URL(request.url);
        
        // Paramètres de pagination
        const page = searchParams.get("page") || "1";
        const pageSize = searchParams.get("pageSize") || "3";
        
        // Paramètres de tri et filtres
        const sort = searchParams.get("sort");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const status = searchParams.get("status");
        const discount = searchParams.get("discount");
        const categories = searchParams.get("categories");

        // Construire l'URL avec TOUS les paramètres
        const backendParams = new URLSearchParams();
        backendParams.append("page", page);
        backendParams.append("pageSize", pageSize);
        
        if (sort) backendParams.append("sort", sort);
        if (minPrice) backendParams.append("minPrice", minPrice);
        if (maxPrice) backendParams.append("maxPrice", maxPrice);
        if (status) backendParams.append("status", status);
        if (discount) backendParams.append("discount", discount);
        if (categories) backendParams.append("categories", categories);
        
        const fullURL = `${apiURL}?${backendParams.toString()}`;
        
        console.log(`🔍 Middleware - Requête vers backend: ${fullURL}`);

        const res = await fetch(fullURL, {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            const errorDetails = await res.json();
            console.error("❌ Erreur backend:", errorDetails);
            return NextResponse.json(
                {
                    error: "Erreur lors du fetch vers le backend",
                    details: errorDetails,
                },
                {
                    status: res.status,
                }
            );
        }

        const data: PaginatedResponse = await res.json();
        console.log(`✅ Middleware - Reçu ${data.products.length} produits, page ${data.currentPage}`);

        return NextResponse.json(data, { 
            status: 200,
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0",
            }
        });
    } catch (err) {
        console.error("❌ Next.js api/shop/catalog-products.ts :", err);
        return NextResponse.json(
            { error: "Erreur lors du fetch des catalog products" },
            { status: 500 }
        );
    }
}