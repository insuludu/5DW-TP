'use client';

import { useState, useEffect } from 'react';
import styles from "@/app/styles/page.module.css";
import { AuthCookieName } from '@/constants';

export default function AddToCartButton({ productId, maxQuantity }: { productId: number, maxQuantity: number }) {
    const [isGuest, setIsGuest] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [isInCart, setIsInCart] = useState(false);
    const [amount, setAmount] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    // Detect connected user
    useEffect(() => {
        const hasAuthCookie = document.cookie
            .split('; ')
            .some(cookie => cookie.startsWith(`${AuthCookieName}=`));
        setIsGuest(!hasAuthCookie);
    }, []);

    // Load product quantity from cart
    useEffect(() => {
        async function load() {
            const formData = new FormData();
            formData.append('id', productId.toString());
            const res = await fetch(`/api/shop/cart/get-quantity`, { method: 'POST', body: formData });
            if (!res.ok) return;

            const data = await res.json();

            const qty = Number(data.amount) || 0;
            setAmount(qty);
            setIsInCart(qty > 0);
        }
        load();
    }, []);

    // Change quantity logic
    async function changeValue(id: number, newAmount: number) {
        if (isUpdating) return;
        setIsUpdating(true);

        const removeEndpoint = '/api/shop/cart/remove-product';
        const updateEndpoint = '/api/shop/cart/update-quantity';

        const formData = new FormData();
        formData.append('id', id.toString());

        if (newAmount === 0) {
            await fetch(removeEndpoint, { method: 'POST', body: formData });
            setAmount(0);
            setIsInCart(false);
        } else {
            formData.append('amount', newAmount.toString());
            await fetch(updateEndpoint, { method: 'POST', body: formData });
            setAmount(newAmount);
            setIsInCart(true);
        }

        setIsUpdating(false);
    }

    // Add button
    const handleClick = async () => {
        setIsLoading(true);

        const endpoint = isGuest
            ? '/api/shop/guest-cart/add-product'
            : '/api/shop/cart/add-product';

        const formData = new FormData();
        formData.append('id', productId.toString());
        formData.append('amount', '1');

        const res = await fetch(endpoint, {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setIsInCart(true);
                setAmount(1);
            }, 2000);
        }

        setIsLoading(false);
    };

    return (
        <>
            {!isInCart ? (
                <button
                    onClick={handleClick}
                    className={`btn btn-lg w-100 ${showSuccess ? 'btn-success' : 'btn-danger'}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Ajout en cours...
                        </>
                    ) : showSuccess ? (
                        <>✓ Ajouté au panier !</>
                    ) : (
                        <>Ajouter au panier</>
                    )}
                </button>
            ) : (
                <div className="d-flex align-items-start mt-2">
                    <a
                        href="/shop/cart/"
                        className="btn btn-lg btn-primary flex-grow-0 me-2"
                        style={{ width: '75%' }}
                    >
                        Voir le panier
                    </a>

                    <div className="d-flex flex-column align-items-center" style={{ width: '25%' }}>
                        <div className="d-flex align-items-center w-100 justify-content-center">
                            <button
                                onClick={() => changeValue(productId, amount - 1)}
                                className={`${styles.submitButton} btn btn-sm p-1`}
                                style={{ width: 35, height: 35, padding: 0 }}
                            >
                                {amount === 1 ? <i className="bi bi-trash" /> : <i className="bi bi-dash" />}
                            </button>

                            <span className="mx-2 fw-bold">{amount}</span>

                            <button
                                onClick={() => changeValue(productId, amount + 1)}
                                className={`${styles.submitButton} btn btn-sm p-1`}
                                style={{ width: 35, height: 35, padding: 0 }}
                                disabled={amount >= maxQuantity}
                            >
                                <i className="bi bi-plus" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
