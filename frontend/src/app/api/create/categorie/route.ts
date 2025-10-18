import { NextResponse } from "next/server";

const apiURL = process.env.API_BACKEND_URL + "/api/product/ProductsCategories";

export async function GET() {
    try {
        const res = await fetch(apiURL);
        if (!res.ok) {
            return NextResponse.json({ error: 'Erreur lors du fetch vers le backend' }, { status: res.status });
        }

        const data: string[] = await res.json(); // ✅ Deserialize JSON array into string[]
        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
