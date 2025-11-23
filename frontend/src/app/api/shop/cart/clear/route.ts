import { NextResponse } from "next/server";
import { CartCookieName } from "@/constants";
import { cookies } from "next/headers";
import { AuthHelper } from "@/lib/auth-helper";

const backendUrl = process.env.API_BACKEND_URL + "/api/cart/clear";

export async function POST(req: Request) {
    try {
        const isAuthenticated = await AuthHelper.isAuthenticated();

        if (isAuthenticated) {
            // Utilisateur connecté : vider le panier via le backend
            const cookieStore = await cookies();
            const authCookie = cookieStore.get("authToken");
            
            const backendResponse = await fetch(backendUrl, {
                method: "POST",
                headers: {
                    'Cookie': `authToken=${authCookie?.value}`,
                },
            });

            if (!backendResponse.ok) {
                return NextResponse.json({ 
                    error: "Erreur lors du vidage du panier" 
                }, { status: backendResponse.status });
            }

            return NextResponse.json({ 
                message: "Panier vidé avec succès" 
            }, { status: 200 });
        }

        // Pour invités, supprimer le cookie du panier
        const response = NextResponse.json({ 
            message: "Panier vidé avec succès"
        }, { status: 200 });

        response.cookies.delete(CartCookieName);

        return response;

    } catch (err) {
        console.error("Next.js api/shop/cart/clear:", err);
        return NextResponse.json({ 
            error: "Erreur lors du vidage du panier" 
        }, { status: 500 });
    }
}