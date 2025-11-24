import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthCookieName } from "@/constants";

const backendUrl = process.env.API_BACKEND_URL;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const orderNumber = body.id;

        if (!orderNumber) {
            return NextResponse.json(
                { message: "Numéro commande manquant" },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();
        const token = cookieStore.get(AuthCookieName);

        if (!token) {
            return NextResponse.json(
                { message: "Non authentifié" },
                { status: 401 }
            );
        }

        const res = await fetch(`${backendUrl}/api/Orders/remove`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token.value}`
            },
            body: JSON.stringify(orderNumber)
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (err) {
        console.error("Erreur annulation :", err);
        return NextResponse.json(
            { message: "Erreur lors de l'annulation" },
            { status: 500 }
        );
    }
}
