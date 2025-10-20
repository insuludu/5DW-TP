import { NextResponse } from "next/server";
import { CategoryDTO } from "@/interfaces";

const apiURL = process.env.API_BACKEND_URL + "/api/category/StarCategories?count=5";

export async function GET() {
    try {
        console.log(apiURL);
        const res = await fetch(apiURL);
        if (!res.ok) {
            return NextResponse.json({ error: 'Erreur lors du fetch vers le backend' }, { status: res.status });
        }

        const data: CategoryDTO[] = await res.json(); // ✅ Deserialize JSON array into string[]
        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
