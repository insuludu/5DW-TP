import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthCookieName } from "@/constants";

const backendUrl = process.env.API_BACKEND_URL;

export async function POST(req: Request) {
    try {
        console.log('=== API Route: POST /api/orders/getReceipt ===');
        
        // Parse le FormData
        const formData = await req.formData();
        const ordernumber = formData.get("ordernumber");

        if (!ordernumber || typeof ordernumber !== "string") {
            return NextResponse.json(
                { message: "Missing or invalid 'ordernumber'" },
                { status: 400 }
            );
        }

        console.log("📝 Fetching receipt for order:", ordernumber);

        // Récupérer le token d'authentification
        const cookieStore = await cookies();
        const authToken = cookieStore.get(AuthCookieName);
        
        if (!authToken) {
            return NextResponse.json(
                { message: "Non authentifié" },
                { status: 401 }
            );
        }

        console.log("🔑 Auth token présent:", !!authToken);

        // Créer un nouveau FormData pour l'envoyer au backend
        const backendFormData = new FormData();
        backendFormData.append("ordernumber", ordernumber);

        const headers: HeadersInit = {
            "Authorization": `Bearer ${authToken.value}`,
        };

        const url = `${backendUrl}/api/Orders/getReceipt`;
        console.log("🌐 URL appelée:", url);

        // Appeler le backend
        const res = await fetch(url, {
            method: "POST",
            headers: headers,
            body: backendFormData
        });

        console.log("📡 Statut réponse backend:", res.status);

        // Vérifier le type de contenu
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            console.error('❌ Backend returned non-JSON:', text.substring(0, 500));
            return NextResponse.json(
                { message: "Erreur serveur: réponse invalide" },
                { status: 500 }
            );
        }

        const data = await res.json();
        console.log("✅ Données reçues du backend:", data);

        if (!res.ok) {
            console.error("❌ Erreur du backend:", data);
            return NextResponse.json(data, { status: res.status });
        }

        console.log("✅ Reçu récupéré avec succès");
        return NextResponse.json(data, { status: 200 });

    } catch (err) {
        console.error("❌ Erreur API getReceipt:", err);
        console.error("Type:", typeof err);
        console.error("Message:", err instanceof Error ? err.message : String(err));
        
        return NextResponse.json(
            { 
                message: "Erreur lors de la récupération du reçu: " + 
                        (err instanceof Error ? err.message : String(err)) 
            },
            { status: 500 }
        );
    }
}