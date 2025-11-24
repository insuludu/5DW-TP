"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/styles/page.module.css";

// Interfaces correspondant au backend
interface ImageDTO {
    alt: string;
    url: string;
}

interface CartProductDTO {
    id: number;
    name: string;
    price: number;
    discountPrice?: number;
    status: number;
    imagesData?: ImageDTO;
    amount: number;
    maxQuantity: number;
}

interface OrderFullDTO {
    orderNumber: string;
    orderStatus: number;
    productDTO: CartProductDTO[];
    totalBeforeTaxes: number;
    total: number;
}

export default function OrderList() {
    const [orders, setOrders] = useState<OrderFullDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getOrders() {
            try {
                const endpoint = '/api/orders/get-orders';
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
                        {orders.map((order, index) => (
                            <div key={index} className="col-12">
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
function OrderCardComponent({ order }: { order: OrderFullDTO }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getOrderStatusBadge = (status: number) => {
        const statusMap: Record<number, { label: string; color: string }> = {
            0: { label: "En attente", color: "bg-warning" },
            1: { label: "En traitement", color: "bg-info" },
            2: { label: "Expédiée", color: "bg-primary" },
            3: { label: "Livrée", color: "bg-success" },
            4: { label: "Annulée", color: "bg-danger" }
        };
        return statusMap[status] || { label: "Inconnu", color: "bg-secondary" };
    };

    const getProductStatusLabel = (status: number) => {
        const statusMap: Record<number, string> = {
            0: "Disponible",
            1: "Rupture de stock",
            2: "En réapprovisionnement",
            3: "Discontinué"
        };
        return statusMap[status] || "Statut inconnu";
    };

    const statusInfo = getOrderStatusBadge(order.orderStatus);

    return (
        <div className={`${styles.backgroundThird} rounded-4 shadow overflow-hidden`}>
            {/* En-tête de la commande */}
            <div className="p-4 border-bottom">
                <div className="row align-items-center">
                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <h5 className="fw-bold mb-1">Commande #{order.orderNumber}</h5>
                    </div>
                    <div className="col-12 col-md-6 text-md-end">
                        <span className={`badge ${statusInfo.color} px-3 py-2 mb-2`}>
                            {statusInfo.label}
                        </span>
                        <p className="fs-5 fw-bold mb-0">
                            Total: {order.total.toFixed(2)}$
                        </p>
                        <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>
                            (Avant taxes: {order.totalBeforeTaxes.toFixed(2)}$)
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
                    {order.productDTO.map((product, index) => {
                        const finalPrice = product.discountPrice ?? product.price;

                        return (
                            <div
                                key={index}
                                className="d-flex flex-column flex-md-row p-3 mb-3 bg-white rounded-3"
                            >
                                <div className="d-flex flex-row w-100">
                                    {/* Image du produit */}
                                    {product.imagesData && (
                                        <a
                                            href={`/shop/product/${product.id}`}
                                            className="text-decoration-none text-dark flex-shrink-0"
                                        >
                                            <div
                                                className="position-relative"
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    minWidth: "80px"
                                                }}
                                            >
                                                <img
                                                    src={product.imagesData.url}
                                                    alt={product.imagesData.alt}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "contain"
                                                    }}
                                                />
                                            </div>
                                        </a>
                                    )}

                                    {/* Infos produit */}
                                    <div className="flex-grow-1 ms-3 d-flex flex-column justify-content-between">
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
                                                {getProductStatusLabel(product.status)}
                                            </p>
                                            <p className="mb-0" style={{ fontSize: "0.85rem" }}>
                                                Quantité: <span className="fw-bold">{product.amount}</span>
                                            </p>
                                            {product.discountPrice && (
                                                <p className="mb-0" style={{ fontSize: "0.85rem" }}>
                                                    <span className="text-decoration-line-through me-2">
                                                        {product.price.toFixed(2)}$
                                                    </span>
                                                    <span className="text-danger fw-bold">
                                                        {product.discountPrice.toFixed(2)}$
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Prix total pour ce produit */}
                                <div className="d-flex align-items-center ms-md-3 mt-2 mt-md-0 flex-shrink-0">
                                    <p className="fs-6 fw-bold mb-0 text-nowrap">
                                        {(finalPrice * product.amount).toFixed(2)}$
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}