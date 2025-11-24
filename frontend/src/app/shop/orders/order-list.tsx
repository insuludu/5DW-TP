"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/styles/page.module.css";

// Interfaces
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
                const res = await fetch("/api/orders/get-orders");

                if (res.status === 401) {
                    window.location.href = "/account/auth";
                    return;
                }

                if (!res.ok) {
                    throw new Error("Failed to fetch orders");
                }

                setOrders(await res.json());
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        }
        getOrders();
    }, []);

    if (isLoading) {
        return (
            <section className={`min-vh-100 ${styles.backgroundPrimary} py-5`}>
                <div className="container text-center py-5">
                    <p className="fs-5 text-light">Chargement...</p>
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

function OrderCardComponent({ order }: { order: OrderFullDTO }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [orderStatus, setOrderStatus] = useState(order.orderStatus);
    const [isCancelling, setIsCancelling] = useState(false);

    const statusMap: Record<number, { label: string; color: string }> = {
        0: { label: "Confirmée", color: "bg-success" },     // Confirmed
        1: { label: "Annulée", color: "bg-danger" },       // Canceled
        2: { label: "En préparation", color: "bg-info" },  // Preperation
        3: { label: "En expédition", color: "bg-primary" },// Shipping
        4: { label: "Livrée", color: "bg-success" },       // Shipped
        5: { label: "Retour", color: "bg-warning" }        // Returned
    };

    const productStatusMap: Record<number, string> = {
        0: "Disponible",
        1: "Rupture de stock",
        2: "En réapprovisionnement",
        3: "Discontinué"
    };

    const getOrderStatusBadge = (status: number) =>
        statusMap[status] || { label: "Inconnu", color: "bg-secondary" };

    const getProductStatusLabel = (status: number) =>
        productStatusMap[status] || "Statut inconnu";

    const cancelOrder = async () => {
        if (!confirm("Voulez-vous vraiment annuler cette commande ?")) return;

        setIsCancelling(true);

        try {
            const res = await fetch("/api/orders/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: order.orderNumber })
            });

            if (!res.ok) throw new Error("Annulation échouée");

            setOrderStatus(1);
        } catch (err) {
            console.error(err);
        } finally {
            setIsCancelling(false);
        }
    };

    const statusInfo = getOrderStatusBadge(orderStatus);

    return (
        <div className={`${styles.backgroundThird} rounded-4 shadow overflow-hidden`}>
            {/* HEADER */}
            <div className="p-4 border-bottom">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h5 className="fw-bold">Commande #{order.orderNumber}</h5>
                    </div>

                    <div className="col-md-6 text-md-end">
                        <span className={`badge ${statusInfo.color} px-3 py-2 mb-2`}>
                            {statusInfo.label}
                        </span>

                        <p className="fs-5 fw-bold mb-0">{order.total.toFixed(2)}$</p>
                        <p className="text-secondary mb-2" style={{ fontSize: "0.85rem" }}>
                            (Avant taxes: {order.totalBeforeTaxes.toFixed(2)}$)
                        </p>

                        {(orderStatus === 0 || orderStatus === 1) && (
                            <button
                                className="btn btn-danger btn-sm"
                                disabled={isCancelling}
                                onClick={cancelOrder}
                            >
                                {isCancelling ? "Annulation..." : "Annuler la commande"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* BOUTON DÉTAILS */}
            <div className="p-3 border-bottom">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`${styles.submitButton} w-100 d-flex justify-content-between align-items-center`}
                >
                    {isExpanded ? "Masquer les détails" : "Voir les détails"}
                    <i className={`bi bi-chevron-${isExpanded ? "up" : "down"}`} />
                </button>
            </div>

            {/* PRODUITS */}
            {isExpanded && (
                <div className="p-4">
                    <h6 className="fw-bold mb-3">Produits commandés</h6>

                    {order.productDTO.map((product, index) => {
                        const finalPrice = product.discountPrice ?? product.price;

                        return (
                            <div key={index}
                                className="d-flex flex-column flex-md-row p-3 mb-3 bg-white rounded-3">
                                {product.imagesData && (
                                    <a href={`/shop/product/${product.id}`} className="text-dark">
                                        <img
                                            src={product.imagesData.url}
                                            alt={product.imagesData.alt}
                                            width="80"
                                            height="80"
                                            style={{ objectFit: "contain" }}
                                        />
                                    </a>
                                )}

                                <div className="flex-grow-1 ms-3">
                                    <a href={`/shop/product/${product.id}`} className="text-dark">
                                        <h6 className="fw-bold mb-1">{product.name}</h6>
                                    </a>
                                    <p className="text-secondary mb-1">
                                        {getProductStatusLabel(product.status)}
                                    </p>
                                    <p className="mb-0">Quantité: {product.amount}</p>
                                </div>

                                <p className="fw-bold mb-0 d-flex align-items-center">
                                    {(finalPrice * product.amount).toFixed(2)}$
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
