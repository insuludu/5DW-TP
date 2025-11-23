import { NextResponse } from "next/server";
import { CartCookieName } from "@/constants";
import { cookies } from "next/headers";
import { CartCookieHelper } from "@/lib/cart-cookie-helper";
import { AuthHelper } from "@/lib/auth-helper";

const backendUrl = process.env.API_BACKEND_URL + "/api/cart/remove";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const id = Number(formData.get("id"));

        const isAuthenticated = await AuthHelper.isAuthenticated();

        if (isAuthenticated) {
            // Utilisateur connecté : retirer via le backend
            const cookieStore = await cookies();
            const authCookie = cookieStore.get("authToken");
            
            const backendResponse = await fetch(backendUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Cookie': `authToken=${authCookie?.value}`,
                },
                body: JSON.stringify({ productId: id }),
            });

            if (!backendResponse.ok) {
                return NextResponse.json({ 
                    error: "Erreur lors du retrait du produit" 
                }, { status: backendResponse.status });
            }

            return NextResponse.json({ 
                message: "Produit retiré du panier" 
            }, { status: 200 });
        }

        // Utilisateur invité : gérer via cookie
        const cookieStore = await cookies();
        const cart_cookie = cookieStore.get(CartCookieName);

        if (!cart_cookie?.value) {
            return NextResponse.json({
                message: "Panier déjà vide",
                cart: []
            }, { status: 200 });
        }

        const cart = CartCookieHelper.parseCart(cart_cookie.value);
        const updatedCart = CartCookieHelper.removeProduct(cart, id);

        const response = NextResponse.json({
            message: "Produit retiré du panier",
            cart: updatedCart,
            totalItems: CartCookieHelper.getTotalItems(updatedCart)
        }, { status: 200 });

        response.cookies.set({
            name: CartCookieName,
            value: CartCookieHelper.serialize(updatedCart),
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
        });

        return response;

    } catch (err) {
        console.error("Next.js api/shop/cart/remove-product:", err);
        return NextResponse.json({ 
            error: "Erreur lors du retrait du produit" 
        }, { status: 500 });
    }
}