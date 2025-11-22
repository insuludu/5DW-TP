import { NextResponse } from "next/server";
import { CartCookieName } from "@/constants";
import { cookies } from "next/headers";
import { CartCookieHelper } from "@/lib/cart-cookie-helper";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const id = Number(formData.get("id"));

        if (isNaN(id) || id <= 0) {
            return NextResponse.json({ 
                error: "ID de produit invalide" 
            }, { status: 400 });
        }

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
        console.error("Next.js api/shop/guest-cart/remove-product:", err);
        return NextResponse.json({ 
            error: "Erreur lors de la suppression du produit" 
        }, { status: 500 });
    }
}