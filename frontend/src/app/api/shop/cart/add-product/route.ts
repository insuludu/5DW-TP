import { NextResponse } from "next/server";
import { CartCookieName } from "@/constants";
import { cookies } from "next/headers";
import { AuthHelper } from "@/lib/auth-helper";

const backendUrl = process.env.API_BACKEND_URL + "/api/cart/add";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const id = Number(formData.get("id"));
        
        // Vérifier si l'utilisateur est connecté
        const isAuthenticated = await AuthHelper.isAuthenticated();
        
        if (isAuthenticated) {
            // Utilisateur connecté : gérer via le backend
            const cookieStore = await cookies();
            const authCookie = cookieStore.get("authToken");
            
            const backendResponse = await fetch(backendUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Cookie': `authToken=${authCookie?.value}`,
                },
                body: JSON.stringify(id),
            });

            if (!backendResponse.ok) {
                return NextResponse.json({ 
                    error: "Erreur lors de l'ajout au panier"
                }, { status: backendResponse.status });
            }

            return NextResponse.json({ 
                message: "Produit ajouté au panier" 
            }, { status: 200 });
        }else{

            console.log("sda");
            
            // Utilisateur invité : gérer via cookie
            const cookieStore = await cookies();
            const cart_cookie = cookieStore.get(CartCookieName);
            
            if (cart_cookie == null) {
                const response = NextResponse.json({ 
                    message: "Cookie créé!" 
                }, { status: 200 });
                
                response.cookies.set({
                    name: CartCookieName,
                    value: JSON.stringify([id]),
                    httpOnly: true,
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7,
                    sameSite: "lax",
                });
                
                return response;
            }
            
            const cart = JSON.parse(cart_cookie.value);
            
            if (!cart.includes(id)) {
                cart.push(id);
            }
            
            const response = NextResponse.json({ 
                message: "Panier mis à jour!", 
                cart 
            });
            
            response.cookies.set({
                name: CartCookieName,
                value: JSON.stringify(cart),
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "lax",
            });
            
            return response;
        }
            
        } catch (err) {
            console.error("Next.js api/shop/cart/add-product:", err);
            return NextResponse.json({ 
                error: "Erreur lors de l'ajout du produit" 
            }, { status: 500 });
        }
    }