import { NextResponse } from "next/server";
import { ShopProductDTO } from "@/interfaces"

const apiURL = process.env.API_BACKEND_URL + "/api/product/CatalogProducts/"

export async function GET() {
    try {
        const res = await fetch(apiURL,
            {headers : {'Content-Type': 'application/json',}}
        )

        if (!res.ok)
            return NextResponse.json({
                error : 'Erreur lors du fetch vers le backend',
                details : res.json()
            },
            {
                status : res.status
            });

        const data : ShopProductDTO[] = await res.json();

        return NextResponse.json(data, {status : 200})
    }
    catch (err) {
        console.error('Next.js api/home/catalog-product.ts :', err);
        return NextResponse.json({ error: 'Erreur lors du fetch des catalog products' }, { status: 500 });
    }
}