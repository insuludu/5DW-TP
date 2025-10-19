import { NextResponse } from "next/server";
import { ShopProductDTO } from "@/interfaces";

const apiURL = process.env.API_BACKEND_URL + "/api/product/SearchProducts";

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
        // Extraire les paramètres de l'URL
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("query") || "";
        const page = searchParams.get("page") || "1";
        const pageSize = searchParams.get("pageSize") || "1";

        if (!query) {
            return NextResponse.json(
                { error: "Le paramètre 'query' est requis" },
                { status: 400 }
            );
        }

        // Construire l'URL avec les paramètres
        const fullURL = `${apiURL}?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`;
        
        console.log(`🔍 Middleware - Recherche: ${fullURL}`);

        const res = await fetch(fullURL, {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
            next: { revalidate: 0 }
        });

        if (res.status === 404) {
            // Retourner une réponse paginée vide
            return NextResponse.json({
                products: [],
                currentPage: 1,
                pageSize: 3,
                totalProducts: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false
            }, { status: 200 });
        }

        if (!res.ok) {
            const errorDetails = await res.json();
            return NextResponse.json(
                {
                    error: "Erreur lors de la recherche",
                    details: errorDetails,
                },
                {
                    status: res.status,
                }
            );
        }

        const data: PaginatedResponse = await res.json();
        console.log(`✅ Middleware - Trouvé ${data.products.length} produits, page ${data.currentPage}`);

        return NextResponse.json(data, { 
            status: 200,
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0",
            }
        });
    } catch (err) {
        console.error("Next.js api/shop/search-products.ts :", err);
        return NextResponse.json(
            { error: "Erreur lors de la recherche des produits" },
            { status: 500 }
        );
    }
}