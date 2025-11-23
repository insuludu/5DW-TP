import { NextResponse } from "next/server";
import { CartProductDTO } from "@/interfaces";
import { CartCookieName } from "@/constants";
import { cookies } from "next/headers";
import { CartCookieHelper } from "@/lib/cart-cookie-helper";
import { AuthHelper } from "@/lib/auth-helper";

const backendUrlLoggedIn = process.env.API_BACKEND_URL + "/api/cart/products";
const backendUrlOffline = process.env.API_BACKEND_URL + "/api/product/GetCartProductsByIds/";

export async function GET(req: Request) {
    try {
        const isAuthenticated = await AuthHelper.isAuthenticated();

        if (isAuthenticated) {
            // Utilisateur connecté : récupérer le panier depuis le backend
            const cookieStore = await cookies();
            const authCookie = cookieStore.get("authToken");
            
            const res = await fetch(backendUrlLoggedIn, {
                method: "GET",
                headers: {
                    'Cookie': `authToken=${authCookie?.value}`,
                },
            });
            
            if (!res.ok) {
                return NextResponse.json({
                    error: 'Erreur lors de la récupération du panier',
                }, { status: res.status });
            }
            
            const products: CartProductDTO[] = await res.json();
            return NextResponse.json(products, { status: 200 });
        }

        // Utilisateur invité : récupérer depuis le cookie
        const cookieStore = await cookies();
        const cart_cookie = cookieStore.get(CartCookieName);

        if (!cart_cookie?.value) {
            const data: CartProductDTO[] = [];
            return NextResponse.json(data, { status: 200 });
        }

        const cart = CartCookieHelper.parseCart(cart_cookie.value);
        
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
            }, { status: res.status });
        }
        
        const products: CartProductDTO[] = await res.json();
        
        const enrichedProducts = products.map(product => ({
            ...product,
            amount: CartCookieHelper.getProductAmount(cart, product.id),
        }));
        
        return NextResponse.json(enrichedProducts, { status: 200 });
            
    } catch (err) {
        console.error("Next.js api/shop/cart/products:", err);
        return NextResponse.json({ 
            error: "Erreur lors de la récupération du panier" 
        }, { status: 500 });
    }
}