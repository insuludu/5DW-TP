import { NextResponse } from "next/server";
import { CartProductDTO } from "@/interfaces";
import { AuthCookieName, CartCookieName } from "@/constants";
import { cookies } from "next/headers";
import { CartCookieHelper } from "@/lib/cart-cookie-helper";

// const backendUrlLoggedIn = process.env.API_BACKEND_URL + "/api/product/GetProductById/";
// const backendUrlOffline = process.env.API_BACKEND_URL + "/api/product/GetProductById/";

export async function POST(req: Request) {

    try {
        const formData = await req.formData();
        const id = Number(formData.get("id"));

        const cookieStore = await cookies();
        const connexion_cookie = cookieStore.get(AuthCookieName);
        const cart_cookie = cookieStore.get(CartCookieName);


        if (connexion_cookie == null && cart_cookie == null) {
            const response = NextResponse.json({ message: "Cookie set!", status: 200 });

            return response;
        }
        else if (connexion_cookie == null) {
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
        }

        return NextResponse.json({
            error: 'Erreur lors de la modification du cookie'
        });
    } catch (err) {
        console.error("Next.js api/shop/Cart/Product:", err);
        return NextResponse.json({ error: "Erreur lors du fetch du produit" }, { status: 500 });
    }
}