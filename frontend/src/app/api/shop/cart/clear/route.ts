import { NextResponse } from "next/server";
import { AuthCookieName, CartCookieName } from "@/constants";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const connexion_cookie = cookieStore.get(AuthCookieName);

        // Si utilisateur connecté, gérer côté backend
        if (connexion_cookie != null) {
            return NextResponse.json({ 
                message: "Panier géré côté serveur pour utilisateur connecté"
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