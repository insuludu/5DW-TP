"use client";

import { useEffect, useState } from "react";
import CartCard from "./cart-card";
import { CartProductDTO } from "@/interfaces";
import Link from "next/link";
import styles from "@/app/styles/page.module.css";

export default function ListCart() {
    const [cartProducts, setCartProducts] = useState<CartProductDTO[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        async function getProduct() {
            const endpoint = '/api/shop/cart/products';
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error("Failed to fetch cart products");
            const data = await res.json();
            setCartProducts(data);
        }
        getProduct();
    }, []);

    async function handlechangeAmount(id: number, amount: number) {
        if (isUpdating) return;
        setIsUpdating(true);

        const removeEndpoint = '/api/shop/cart/remove-product';
        const updateEndpoint = '/api/shop/cart/update-quantity';

        if (amount === 0) {
            setCartProducts(prev => prev.filter(p => p.id !== id));
            try {
                const formData = new FormData();
                formData.append('id', id.toString());
                await fetch(removeEndpoint, { method: 'POST', body: formData });
            } catch (error) {
                console.error('Network error:', error);
            }
        } else {
            setCartProducts(prev => prev.map(p => (p.id === id ? { ...p, amount } : p)));
            try {
                const formData = new FormData();
                formData.append('id', id.toString());
                formData.append('amount', amount.toString());
                await fetch(updateEndpoint, { method: 'POST', body: formData });
            } catch (error) {
                console.error('Network error:', error);
            }
        }

        setIsUpdating(false);
    }

    return (
        <section className={`min-vh-100 ${styles.backgroundPrimary} py-5`}>
            <div className="container">
                <h1 className="display-4 text-light text-center mb-5">Panier</h1>

                {cartProducts.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="fs-5 mb-4 text-light">Votre panier est vide.</p>
                        <Link href="./">
                            <button className={`${styles.submitButton} w-50`}>Retour au magasin</button>
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {cartProducts.map(product => (
                            <div key={product.id} className="col-12">
                                <CartCard
                                    product={product}
                                    changeValue={handlechangeAmount}
                                />
                            </div>
                        ))}
                    </div>
                )}
                // Ajoutez après la liste des produits, avant la fermeture de la div principale

                {cartProducts.length > 0 && (
                    <div className="row mt-4">
                        <div className="col-12 col-lg-6 offset-lg-6">
                            <div className={`p-4 ${styles.backgroundThird} rounded-4 shadow`}>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="fs-5">Total avant taxes</span>
                                    <span className="fs-4 fw-bold">
                                        {cartProducts.reduce((sum, item) => {
                                            const price = item.discountPrice ?? item.price;
                                            return sum + (price * item.amount);
                                        }, 0).toFixed(2)}$
                                    </span>
                                </div>
                                <Link href="/checkout">
                                    <button className={`${styles.submitButton} w-100 py-3`}>
                                        Passer la commande
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
