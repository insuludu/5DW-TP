import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthCookieName } from "@/constants";

const backendUrl = process.env.API_BACKEND_URL;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        const cookieStore = await cookies();
        const authToken = cookieStore.get(AuthCookieName);

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken.value}`;
        }

        const res = await fetch(`${backendUrl}/api/orders`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            console.error('Backend returned non-JSON:', text);
            return NextResponse.json(
                { message: "Erreur serveur: réponse invalide" },
                { status: 500 }
            );
        }

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (err) {
        console.error("Next.js api/orders POST error:", err);
        return NextResponse.json(
            { message: "Erreur lors de la création de la commande" },
            { status: 500 }
        );
    }
}