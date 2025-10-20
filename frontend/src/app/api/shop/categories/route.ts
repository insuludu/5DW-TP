import { NextResponse } from "next/server";
import { CategoryDTO } from "@/interfaces";

const backendUrl = process.env.API_BACKEND_URL + "/api/category/all";

export async function GET() {
    try {
        const res = await fetch(backendUrl, {
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok)
            return NextResponse.json({
                error: 'Erreur lors du fetch des catégories',
                details: await res.text()
            },
                {
                    status: res.status
                });

        const data: CategoryDTO[] = await res.json();

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error("Next.js api/shop/categories:", err);
        return NextResponse.json({ error: "Erreur lors du fetch des catégories" }, { status: 500 });
    }
}