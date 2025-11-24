"use client";

import { useEffect, useState } from "react";
import styles from "@/app/styles/page.module.css";

// Interfaces (same as before)
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

export default function OrderSingle({ orderNumber }: { orderNumber: string }) {
    const [order, setOrder] = useState<OrderFullDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getOrder() {
            if (!orderNumber) return;

            try {
                const formData = new FormData();
                formData.append("ordernumber", orderNumber);

                const res = await fetch("/api/orders/get-order", {
                    method: "POST",
                    body: formData
                })

                if (res.status === 401) {
                    window.location.href = "/account/auth";
                    return;
                }

                if (!res.ok) throw new Error("Failed to fetch order");

                const data = await res.json();
                setOrder(data);
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setIsLoading(false);
            }
        }

        getOrder();
    }, [orderNumber]);

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

    if (!order) {
        return (
            <section className={`min-vh-100 ${styles.backgroundPrimary} py-5`}>
                <div className="container text-center">
                    <p className="fs-5 text-light">Commande introuvable.</p>
                </div>
            </section>
        );
    }

    return (
        <section className={`min-vh-100 ${styles.backgroundPrimary} py-5`}>
            <div className="container">
                <OrderCardOne order={order} setOrder={setOrder} />
            </div>
        </section>
    );
}

// -------------------------
// SINGLE ORDER CARD
// -------------------------

function OrderCardOne({ order, setOrder }: { order: OrderFullDTO; setOrder: (order: OrderFullDTO) => void }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);

    const getOrderStatusBadge = (status: number) => {
        const statusMap: Record<number, { label: string; color: string }> = {
            0: { label: "Confirmée", color: "bg-success" },     // Confirmed
            1: { label: "Annulée", color: "bg-danger" },       // Canceled
            2: { label: "En préparation", color: "bg-info" },  // Preperation
            3: { label: "En expédition", color: "bg-primary" },// Shipping
            4: { label: "Livrée", color: "bg-success" },       // Shipped
            5: { label: "Retour", color: "bg-warning" }        // Returned
        };

        return statusMap[status] || { label: "Inconnu", color: "bg-secondary" };
    };

    const getProductStatusLabel = (status: number) => {
        const map: Record<number, string> = {
            0: "Disponible",
            1: "Rupture de stock",
            2: "En réapprovisionnement",
            3: "Discontinué"
        };

        return map[status] || "Statut inconnu";
    };

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

            // Update the order status to "Annulée" (4)
            setOrder({
                ...order,
                orderStatus: 1
            });

            alert("Commande annulée avec succès!");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'annulation de la commande");
        } finally {
            setIsCancelling(false);
        }
    };

    const statusInfo = getOrderStatusBadge(order.orderStatus);

    return (
        <div className={`${styles.backgroundThird} rounded-4 shadow overflow-hidden`}>
            {/* HEADER */}
            <div className="p-4 border-bottom">
                <div className="row align-items-center">
                    <div className="col">
                        <h4 className="fw-bold mb-1">
                            Commande #{order.orderNumber}
                        </h4>
                        <span className={`badge ${statusInfo.color} px-3 py-2`}>
                            {statusInfo.label}
                        </span>
                    </div>
                    <div className="col text-end">
                        <p className="fs-4 fw-bold mb-0">
                            Total: {order.total.toFixed(2)}$
                        </p>
                        <p className="text-secondary mb-2" style={{ fontSize: "0.85rem" }}>
                            Avant taxes: {order.totalBeforeTaxes.toFixed(2)}$
                        </p>

                        {/* Cancel Order Button - Only show if not already cancelled */}
                        {(order.orderStatus === 0 || order.orderStatus === 2) && (
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

            {/* TOGGLE DETAILS */}
            <div className="p-3 border-bottom">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`${styles.submitButton} w-100 d-flex justify-content-between align-items-center`}
                >
                    <span>{isExpanded ? "Masquer les détails" : "Voir les détails"}</span>
                    <i className={`bi bi-chevron-${isExpanded ? "up" : "down"}`}></i>
                </button>
            </div>

            {/* PRODUCTS */}
            {isExpanded && (
                <div className="p-4">
                    <h5 className="fw-bold mb-3">Produits commandés</h5>

                    {order.productDTO.map((p, i) => {
                        const price = p.discountPrice ?? p.price;

                        return (
                            <div key={i} className="d-flex flex-column flex-md-row p-3 mb-3 bg-white rounded-3">
                                <div className="d-flex flex-row w-100">

                                    {/* Image */}
                                    {p.imagesData && (
                                        <a href={`/shop/product/${p.id}`} className="flex-shrink-0">
                                            <img
                                                src={p.imagesData.url}
                                                alt={p.imagesData.alt}
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "contain"
                                                }}
                                            />
                                        </a>
                                    )}

                                    {/* Info */}
                                    <div className="flex-grow-1 ms-3">
                                        <a href={`/shop/product/${p.id}`} className="text-decoration-none text-dark">
                                            <h6 className="fw-bold mb-1">{p.name}</h6>
                                        </a>
                                        <p className="text-secondary mb-1">{getProductStatusLabel(p.status)}</p>
                                        <p className="mb-0">Quantité: <b>{p.amount}</b></p>

                                        {p.discountPrice && (
                                            <p className="mb-0">
                                                <span className="text-decoration-line-through me-2">
                                                    {p.price.toFixed(2)}$
                                                </span>
                                                <span className="text-danger fw-bold">
                                                    {p.discountPrice.toFixed(2)}$
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Total item price */}
                                <div className="d-flex align-items-center ms-md-3 mt-2 mt-md-0 flex-shrink-0">
                                    <p className="fs-6 fw-bold mb-0 text-nowrap">
                                        {(price * p.amount).toFixed(2)}$
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