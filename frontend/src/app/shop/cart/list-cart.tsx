"use client";

import { useEffect, useState } from "react";
import CartCard from "./cart-card";
import { CartProductDTO } from "@/interfaces";

export default function ListCart() {
    const [cartProducts, setCartProducts] = useState<CartProductDTO[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        async function getProduct() {
            const res = await fetch('/api/shop/cart/products');
            if (!res.ok) throw new Error("Failed to fetch cart products");
            const data = await res.json();
            setCartProducts(data);
        }
        getProduct();
    }, []);

    function handleSelectedChange(id: number, selected: boolean) {
        setCartProducts(prev =>
            prev.map(p => (p.id === id ? { ...p, selected } : p))
        );
    }

    async function handlechangeAmount(id: number, amount: number) {
        if (isUpdating) return;

        setIsUpdating(true);

        if (amount == 0) {
            setCartProducts(prev =>
                prev.filter(p => p.id !== id)
            );
            try {
                const formData = new FormData();
                formData.append('id', id.toString());

                const response = await fetch('/api/shop/cart/remove-product', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                } else {
                    console.error('Error removing to cart:', data.error);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        } else {
            setCartProducts(prev =>
                prev.map(p => (p.id === id ? { ...p, amount } : p))
            );
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
