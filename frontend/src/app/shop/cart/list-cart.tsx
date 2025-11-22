"use client";

import { useEffect, useState } from "react";
import CartCard from "./cart-card";
import { CartProductDTO } from "@/interfaces";
import { AuthCookieName } from "@/constants";

export default function ListCart() {
    const [cartProducts, setCartProducts] = useState<CartProductDTO[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isGuest, setIsGuest] = useState(true);

    // Détecter si l'utilisateur est connecté
    useEffect(() => {
        const checkAuthStatus = () => {
            // Vérifier si le cookie d'authentification existe
            const hasAuthCookie = document.cookie
                .split('; ')
                .some(cookie => cookie.startsWith(`${AuthCookieName}=`));
            
            setIsGuest(!hasAuthCookie);
        };
        
        checkAuthStatus();
    }, []);

    useEffect(() => {
        async function getProduct() {
            // Choisir l'endpoint selon le statut
            const endpoint = isGuest 
                ? '/api/shop/guest-cart/products'
                : '/api/shop/cart/products';

            const res = await fetch(endpoint);
            if (!res.ok) throw new Error("Failed to fetch cart products");
            const data = await res.json();
            setCartProducts(data);
        }
        getProduct();
    }, [isGuest]);

    function handleSelectedChange(id: number, selected: boolean) {
        setCartProducts(prev =>
            prev.map(p => (p.id === id ? { ...p, selected } : p))
        );
    }

    async function handlechangeAmount(id: number, amount: number) {
        if (isUpdating) return;

        setIsUpdating(true);

        // Choisir l'endpoint selon le statut
        const removeEndpoint = isGuest
            ? '/api/shop/guest-cart/remove-product'
            : '/api/shop/cart/remove-product';

        const updateEndpoint = isGuest
            ? '/api/shop/guest-cart/update-quantity'
            : '/api/shop/cart/update-quantity';

        if (amount === 0) {
            // Retirer le produit
            setCartProducts(prev =>
                prev.filter(p => p.id !== id)
            );
            
            try {
                const formData = new FormData();
                formData.append('id', id.toString());

                const response = await fetch(removeEndpoint, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error('Error removing from cart:', data.error);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        } else {
            // Mettre à jour la quantité
            setCartProducts(prev =>
                prev.map(p => (p.id === id ? { ...p, amount } : p))
            );

            // Pour les invités, appeler l'API de mise à jour
            if (isGuest) {
                try {
                    const formData = new FormData();
                    formData.append('id', id.toString());
                    formData.append('amount', amount.toString());

                    const response = await fetch(updateEndpoint, {
                        method: 'POST',
                        body: formData,
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        console.error('Error updating quantity:', data.error);
                    }
                } catch (error) {
                    console.error('Network error:', error);
                }
            }
        }

        setIsUpdating(false);
    }

    return (
        <div className="m-5">
            <h1>Panier</h1>

            <div style={{ height: "40px" }} className="d-flex align-items-center mb-2 px-3">
                <div style={{ width: "200px" }}></div>

                <div className="flex-grow-1 ms-3">
                    <div className="row align-items-center">
                        <div className="col-9"></div>

                        <div className="col-2 d-flex">
                            <strong>Prix</strong>
                        </div>
                        <div className="col-1 d-flex justify-content-center ">
                            <strong>Sélectionné</strong>
                        </div>
                    </div>
                </div>
            </div>

            {cartProducts.map(product => (
                <CartCard key={product.id} product={product} onSelectedChange={handleSelectedChange} changeValue={handlechangeAmount} />
            ))}
        </div>
    );
}