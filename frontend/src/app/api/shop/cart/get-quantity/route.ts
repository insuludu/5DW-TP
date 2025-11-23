import { NextResponse } from "next/server";
import { AuthCookieName, CartCookieName } from "@/constants";
import { cookies } from "next/headers";
import { CartCookieHelper } from "@/lib/cart-cookie-helper";
import { AuthHelper } from "@/lib/auth-helper";

const backendUrl = process.env.API_BACKEND_URL + "/api/cart/quantity";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const id = Number(formData.get("id"));

        if (isNaN(id) || id <= 0) {
            return NextResponse.json({
                amount: 0
            }, { status: 200 });
        }

        const isAuthenticated = await AuthHelper.isAuthenticated();

        if (isAuthenticated) {
            // Utilisateur connecté : récupérer la quantité via le backend
            const cookieStore = await cookies();
            const authCookie = cookieStore.get(AuthCookieName);
            
            const backendResponse = await fetch(`${backendUrl}/${id}`, {
                method: "GET",
                headers: {
                    'Cookie': `${AuthCookieName}=${authCookie?.value}`,
                },
            });

            if (!backendResponse.ok) {
                return NextResponse.json({ 
                    error: "Erreur lors de la récupération de la quantité" 
                }, { status: backendResponse.status });
            }

            const data = await backendResponse.json();
            return NextResponse.json({
                amount: data.quantity || 0
            }, { status: 200 });
        }

        // Utilisateur invité : récupérer depuis le cookie
        const cookieStore = await cookies();
        const cart_cookie = cookieStore.get(CartCookieName);

        if (!cart_cookie?.value) {
            return NextResponse.json({
                amount: 0
            }, { status: 200 });
        }

        const cart = CartCookieHelper.parseCart(cart_cookie.value);
        const amount = CartCookieHelper.getProductAmount(cart, id);

        if (isNaN(amount) || amount < 0) {
            return NextResponse.json({
                amount: 0
            }, { status: 200 });
        }

        return NextResponse.json({
            amount: amount
        }, { status: 200 });

    } catch (err) {
        console.error("Next.js api/shop/cart/get-quantity:", err);
        return NextResponse.json({
            error: "Erreur lors de la récupération de la quantité"
        }, { status: 500 });
    }
}