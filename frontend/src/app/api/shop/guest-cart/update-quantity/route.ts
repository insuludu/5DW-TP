import { NextResponse } from "next/server";
import { CartCookieName } from "@/constants";
import { cookies } from "next/headers";
import { CartCookieHelper } from "@/lib/cart-cookie-helper";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const id = Number(formData.get("id"));
        const amount = Number(formData.get("amount"));

        if (isNaN(id) || id <= 0) {
            return NextResponse.json({ 
                error: "ID de produit invalide" 
            }, { status: 400 });
        }

        if (isNaN(amount) || amount < 0) {
            return NextResponse.json({ 
                error: "Quantité invalide" 
            }, { status: 400 });
        }

        const cookieStore = await cookies();
        const cart_cookie = cookieStore.get(CartCookieName);

        const cart = CartCookieHelper.parseCart(cart_cookie?.value);

        const updatedCart = CartCookieHelper.updateQuantity(cart, id, amount);

        const response = NextResponse.json({ 
            message: amount === 0 ? "Produit retiré du panier" : "Quantité mise à jour",
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
        console.error("Next.js api/shop/guest-cart/update-quantity:", err);
        return NextResponse.json({ 
            error: "Erreur lors de la mise à jour de la quantité" 
        }, { status: 500 });
    }
}