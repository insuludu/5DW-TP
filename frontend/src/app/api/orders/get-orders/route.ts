import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthCookieName } from "@/constants";

const backendUrl = process.env.API_BACKEND_URL;

export async function GET(req: Request) {
    try {
        console.log('=== API Route: GET /api/orders ===');
        
        const cookieStore = await cookies();
        const authToken = cookieStore.get(AuthCookieName);
        console.log('Auth token présent:', !!authToken);

        if (!authToken) {
            return NextResponse.json(
                { message: "Non authentifié" },
                { status: 401 }
            );
        }

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken.value}`,
        };

        const url = `${backendUrl}/api/Orders/getOrders`;
        console.log('URL appelée:', url);

        const res = await fetch(url, {
            method: "GET",
            headers: headers,
        });

        console.log('Statut réponse backend:', res.status);
        console.log('Content-Type:', res.headers.get('content-type'));

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            console.error('Backend returned non-JSON:', text.substring(0, 500));
            return NextResponse.json(
                { message: "Erreur serveur: réponse invalide" },
                { status: 500 }
            );
        }

        const data = await res.json();
        console.log('Données reçues du backend:', data);

        if (!res.ok) {
            console.error('Erreur du backend:', data);
            return NextResponse.json(data, { status: res.status });
        }

        console.log('✅ Commandes récupérées avec succès');
        return NextResponse.json(data, { status: 200 });

    } catch (err) {
        console.error("❌ Erreur API orders:", err);
        console.error('Type:', typeof err);
        console.error('Message:', err instanceof Error ? err.message : String(err));
        
        return NextResponse.json(
            { message: "Erreur lors de la récupération des commandes: " + (err instanceof Error ? err.message : String(err)) },
            { status: 500 }
        );
    }
}