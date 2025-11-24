import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthCookieName } from "@/constants";
import { json } from "stream/consumers";

const backendUrl = process.env.API_BACKEND_URL;

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const id = formData.get("id");

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        const url = `${backendUrl}/api/Orders/remove`;
        console.log('URL appelée:', url);

        const res = await fetch(url, {
            method: "GET",
            headers: headers,
            body: JSON.stringify(id)
        });

        const data = await res.json();
        console.log('Données reçues du backend:', data);

        if (!res.ok) {
            console.error('Erreur du backend:', data);
            return NextResponse.json(data, { status: res.status });
        }

        console.log('Commandes supprimé avec succès');
        return NextResponse.json(data, { status: 200 });

    } catch (err) {
        console.error("Erreur API orders:", err);
        console.error('Type:', typeof err);
        console.error('Message:', err instanceof Error ? err.message : String(err));
        
        return NextResponse.json(
            { message: "Erreur lors de la récupération des commandes: " + (err instanceof Error ? err.message : String(err)) },
            { status: 500 }
        );
    }
}