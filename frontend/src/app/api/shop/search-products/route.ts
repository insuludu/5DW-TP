import { NextResponse } from "next/server";
import { ShopProductDTO } from "@/interfaces";

const backendUrl = process.env.API_BACKEND_URL + "/api/Product/SearchProducts";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query || query.trim() === "") {
        return NextResponse.json(
            { error: "Le paramètre 'query' est manquant." },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(`${backendUrl}?query=${encodeURIComponent(query)}`, {
            headers: { "Content-Type": "application/json" },
        });
        
        if (!res.ok)
            return NextResponse.json({
                error: 'Erreur lors du fetch vers le backend',
                details: await res.text()
            },
                {
                    status: res.status
                });

        const data: ShopProductDTO[] = await res.json();

        return NextResponse.json(data, { status: 200 });
    } 
    catch (err) {
        console.error("Next.js api/shop/search-products:", err);
        return NextResponse.json({ error: "Erreur lors du fetch des search products" },{ status: 500 });
    }
}