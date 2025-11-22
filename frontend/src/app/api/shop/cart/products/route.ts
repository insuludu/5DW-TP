import { NextResponse } from "next/server";
import { CartProductDTO } from "@/interfaces";
import { AuthCookieName, CartCookieName } from "@/constants";
import { cookies } from "next/headers";
import { debug } from "console";

const backendUrlLoggedIn = process.env.API_BACKEND_URL + "/api/product/GetProductById/";
const backendUrlOffline = process.env.API_BACKEND_URL + "/api/product/GetCartProductsByIds/";

export async function GET(req: Request) {

    try {
        const cookieStore = await cookies();
        const connexion_cookie = cookieStore.get(AuthCookieName);
        const cart_cookie = cookieStore.get(CartCookieName);


        if (!connexion_cookie?.value && !cart_cookie?.value) {
            const data: CartProductDTO[] = [];
            return NextResponse.json(data, { status: 200 });
        }
        else if (!connexion_cookie?.value) {
            let cartIds: number[] = [];
            try {
                cartIds = JSON.parse(cart_cookie?.value!);
            } catch {
                cartIds = [];
            }
            const res = await fetch(backendUrlOffline, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cartIds),
            });
            
            if (!res.ok)
                return NextResponse.json({
                    error: 'Erreur lors de la recuperation des produits',
                    details: await res.text()
                },
                    {
                        status: res.status
                    });

            const data: CartProductDTO[] = await res.json();
            return NextResponse.json(data, { status: 200 });
        }
    } catch (err) {
        console.error("Next.js api/shop/Cart/Product:", err);
        return NextResponse.json({ error: "Erreur lors du fetch du product" }, { status: 500 });
    }
}