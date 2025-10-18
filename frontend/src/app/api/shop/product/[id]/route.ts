import { NextResponse } from "next/server";
import { ShopProductDTO } from "@/interfaces";

const backendUrl = process.env.API_BACKEND_URL + "/api/product/GetProductById/";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const res = await fetch(backendUrl + id, {
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok)
            return NextResponse.json({
                error: 'Erreur lors du fetch du produit',
                details: await res.text()
            },
                {
                    status: res.status
                });

        const data: ShopProductDTO = await res.json();

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error("Next.js api/shop/product/[id]:", err);
        return NextResponse.json({ error: "Erreur lors du fetch du product" }, { status: 500 });
    }
}