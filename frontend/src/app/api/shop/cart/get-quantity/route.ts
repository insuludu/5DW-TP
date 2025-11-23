import { NextResponse } from "next/server";
import { AuthCookieName, CartCookieName } from "@/constants";
import { cookies } from "next/headers";
import { CartCookieHelper } from "@/lib/cart-cookie-helper";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const id = Number(formData.get("id"));

        const cookieStore = await cookies();
        const connexion_cookie = cookieStore.get(AuthCookieName);
        const cart_cookie = cookieStore.get(CartCookieName);

        if (!connexion_cookie && !cart_cookie) {
            return NextResponse.json({
                amount: 0
            }, { status: 200 });
        } else if (!connexion_cookie) {

            if (isNaN(id) || id <= 0) {
                return NextResponse.json({
                    amount: JSON.stringify(0)
                }, { status: 200 });
            }

            const cart = CartCookieHelper.parseCart(cart_cookie?.value);
            const amount = CartCookieHelper.getProductAmount(cart, id);

            if (isNaN(amount) || amount < 0) {
                return NextResponse.json({
                    amount: JSON.stringify(0)
                }, { status: 200 });
            }

            return NextResponse.json({
                amount: JSON.stringify(amount)
            }, { status: 200 });
        } else {

        }

    } catch (err) {
        console.error("Next.js api/shop/guest-cart/update-quantity:", err);
        return NextResponse.json({
            error: "Erreur lors de la mise à jour de la quantité"
        }, { status: 500 });
    }
}