import { NextResponse } from "next/server";
import { CartProductDTO } from "@/interfaces";
import { AuthCookieName, CartCookieName } from "@/constants";
import { cookies } from "next/headers";
import { debug } from "console";
import { CartCookieHelper } from "@/lib/cart-cookie-helper";

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
            //offline
            const cart = CartCookieHelper.parseCart(cart_cookie?.value);
            
            if (CartCookieHelper.isEmpty(cart)) {
                const data: CartProductDTO[] = [];
                return NextResponse.json(data, { status: 200 });
            }
            
            const productIds = CartCookieHelper.getProductIds(cart);
            
            const res = await fetch(backendUrlOffline, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productIds),
            });
            
            if (!res.ok) {
                return NextResponse.json({
                    error: 'Erreur lors de la récupération des produits',
                    details: await res.text()
                }, {
                    status: res.status
                });
            }
            
            const products: CartProductDTO[] = await res.json();
            
            const enrichedProducts = products.map(product => ({
                ...product,
                amount: CartCookieHelper.getProductAmount(cart, product.id),
            }));
            
            return NextResponse.json(enrichedProducts, { status: 200 });
        }else{
            
            return NextResponse.json({ status: 200 });
        }
            
    } catch (err) {
        console.error("Next.js api/shop/guest-cart/products:", err);
        return NextResponse.json({ 
            error: "Erreur lors de la récupération du panier" 
        }, { status: 500 });
    }
}