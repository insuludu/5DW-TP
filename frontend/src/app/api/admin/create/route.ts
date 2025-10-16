import { NextResponse } from "next/server";
import { CreateProductDTO } from "@/interfaces";

const apiURL = process.env.API_BACKEND_URL + "/api/product/CreateProduct/"

export async function POST(req: Request) {
    
    try {
        const product: CreateProductDTO = await req.json();
        
        const response = await fetch(apiURL, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json', // important for JSON payload
            },
            method: 'POST',
            body: JSON.stringify(product),
        });

        if (!response.ok)
            return NextResponse.json({
                error: 'Erreur lors du fetch vers le backend',
                details: response.json()
            },
                {
                    status: response.status
                });

        return NextResponse.json(response.json, { status: 200 })
    }
    catch (err) {
        console.error('Next.js api/product/CreateProduct.ts :', err);
        return NextResponse.json({ error: 'Erreur lors du fetch des catalog products' }, { status: 500 });
    }
}   