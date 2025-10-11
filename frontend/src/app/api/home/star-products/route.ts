import { StarProductDTO } from "@/interfaces";
import { NextResponse } from "next/server";

const apiUrl = process.env.API_BACKEND_URL + "/api/product/StarProducts?count=3";

export async function GET() {
    try {
        const res = await fetch(apiUrl, {
            headers: {'Content-Type': 'application/json',}
        })

        if (!res.ok)
            return NextResponse.json({
                error : 'Erreur lors du fetch vers le backend',
                details : res.json()
            },
            {
                status : res.status
            });

        const data : StarProductDTO[] = await res.json();

        return NextResponse.json(data, {status : 200})
    }
    catch (err) {
        console.error('Next.js api/home/star-product.ts :', err);
        return NextResponse.json({ error: 'Erreur lors du fetch des star products' }, { status: 500 });
    }
}