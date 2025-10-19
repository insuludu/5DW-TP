import { NextResponse } from "next/server";
import { ShopProductDTO } from "@/interfaces"

const apiURL = process.env.API_BACKEND_URL + "/api/product/CatalogProducts/"

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
        // Extraire les paramètres de pagination de l'URL
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || "1";
        const pageSize = searchParams.get("pageSize") || "3";

        // Construire l'URL avec les paramètres de pagination
        const fullURL = `${apiURL}?page=${page}&pageSize=${pageSize}`;
        
        console.log(` Middleware - Requête vers backend: ${fullURL}`);

        const res = await fetch(fullURL, {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            const errorDetails = await res.json();
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
        console.log(` Middleware - Reçu ${data.products.length} produits, page ${data.currentPage}`);

        return NextResponse.json(data, { 
            status: 200,
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0",
            }
        });
    } catch (err) {
        console.error("Next.js api/shop/catalog-products.ts :", err);
        return NextResponse.json(
            { error: "Erreur lors du fetch des catalog products" },
            { status: 500 }
        );
    }
}