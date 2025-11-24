"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/styles/page.module.css";

// Interfaces locales (à ajouter à @/interfaces plus tard)
interface OrderProductDTO {
    id: number;
    name: string;
    status: string;
    price: number;
    quantity: number;
    imagesData?: {
        alt: string;
        url: string;
    };
}

interface ShippingAddressDTO {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
}

interface OrderDTO {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
    products: OrderProductDTO[];
    shippingAddress?: ShippingAddressDTO;
}

export default function OrderList() {
    const [orders, setOrders] = useState<OrderDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getOrders() {
            try {
                const endpoint = '/api/orders';
                const res = await fetch(endpoint);
                
                if (res.status === 401) {
                    // Non authentifié, rediriger vers la page de connexion
                    window.location.href = '/account/auth';
                    return;
                }
                
                if (!res.ok) {
                    throw new Error("Failed to fetch orders");
                }
                
                const data = await res.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false);
            }
        }
        getOrders();
    }, []);

    if (isLoading) {
        return (
            <section className={`min-vh-100 ${styles.backgroundPrimary} py-5`}>
                <div className="container">
                    <div className="text-center py-5">
                        <p className="fs-5 text-light">Chargement...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`min-vh-100 ${styles.backgroundPrimary} py-5`}>
            <div className="container">
                <h1 className="display-4 text-light text-center mb-5">Mes Commandes</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="fs-5 mb-4 text-light">Vous n'avez aucune commande.</p>
                        <Link href="/shop">
                            <button className={`${styles.submitButton} w-50`}>
                                Découvrir nos produits
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {orders.map(order => (
                            <div key={order.id} className="col-12">
                                <OrderCardComponent order={order} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// Composant OrderCard intégré
function OrderCardComponent({ order }: { order: OrderDTO }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getOrderStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            pending: "bg-warning",
            processing: "bg-info",
            shipped: "bg-primary",
            delivered: "bg-success",
            cancelled: "bg-danger"
        };
        return statusColors[status.toLowerCase()] || "bg-secondary";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={`${styles.backgroundThird} rounded-4 shadow overflow-hidden`}>
            {/* En-tête de la commande */}
            <div className="p-4 border-bottom">
                <div className="row align-items-center">
                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <h5 className="fw-bold mb-1">Commande #{order.id}</h5>
                        <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
                            Passée le {formatDate(order.orderDate)}
                        </p>
                    </div>
                    <div className="col-12 col-md-6 text-md-end">
                        <span className={`badge ${getOrderStatusBadge(order.status)} px-3 py-2 mb-2`}>
                            {order.status}
                        </span>
                        <p className="fs-5 fw-bold mb-0">
                            Total: {order.totalAmount.toFixed(2)}$
                        </p>
                    </div>
                </div>
            </div>

            {/* Bouton pour afficher/masquer les détails */}
            <div className="p-3 border-bottom">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`${styles.submitButton} w-100 d-flex justify-content-between align-items-center`}
                    style={{ padding: "0.75rem 1rem" }}
                >
                    <span>
                        {isExpanded ? "Masquer les détails" : "Voir les détails"}
                    </span>
                    <i className={`bi bi-chevron-${isExpanded ? "up" : "down"}`}></i>
                </button>
            </div>

            {/* Détails de la commande (produits) */}
            {isExpanded && (
                <div className="p-4">
                    <h6 className="fw-bold mb-3">Produits commandés</h6>
                    {order.products.map((product, index) => (
                        <div
                            key={index}
                            className="d-flex flex-column flex-md-row p-3 mb-3 bg-white rounded-3"
                        >
                            <div className="d-flex flex-row w-100">
                                {/* Infos produit */}
                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <a
                                            href={`/shop/product/${product.id}`}
                                            className="text-decoration-none text-dark"
                                        >
                                            <h6 className="fw-bold mb-1" style={{ fontSize: "0.95rem" }}>
                                                {product.name}
                                            </h6>
                                        </a>
                                        <p className="text-secondary mb-1" style={{ fontSize: "0.85rem" }}>
                                            {product.status}
                                        </p>
                                        <p className="mb-0" style={{ fontSize: "0.85rem" }}>
                                            Quantité: <span className="fw-bold">{product.quantity}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Prix */}
                            <div className="d-flex align-items-center ms-md-3 mt-2 mt-md-0 flex-shrink-0">
                                <p className="fs-6 fw-bold mb-0 text-nowrap">
                                    {product.price.toFixed(2)}$
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Adresse de livraison */}
                    {order.shippingAddress && (
                        <div className="mt-4 p-3 bg-white rounded-3">
                            <h6 className="fw-bold mb-2">Adresse de livraison</h6>
                            <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                                {order.shippingAddress.street}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.province}<br />
                                {order.shippingAddress.postalCode}<br />
                                {order.shippingAddress.country}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}