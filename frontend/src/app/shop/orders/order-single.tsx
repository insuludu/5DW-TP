"use client";

import { useEffect, useState } from "react";
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

// Interface pour le reçu de paiement (EF30)
interface PaymentReceiptDTO {
    paidAtUtc?: string;
    billingName?: string;
    billingAddress?: string;
    billingPhone?: string;
    cardLast4?: string;
    paymentStatus?: string;
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

    // État pour le reçu de paiement (EF30)
    const [receipt, setReceipt] = useState<PaymentReceiptDTO | null>(null);
    const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);

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

            // Update the order status to "Annulée" (1)
            setOrder({
                ...order,
                orderStatus: 1
            });

        } catch (err) {
            console.error(err);
        } finally {
            setIsCancelling(false);
        }
    };

    // Fonction pour charger le reçu de paiement (EF30)
    const loadReceipt = async () => {
        if (receipt) {
            setShowReceipt(!showReceipt);
            return;
        }

        setIsLoadingReceipt(true);
        try {
            const formData = new FormData();
            formData.append("ordernumber", order.orderNumber);

            const res = await fetch("/api/orders/get-receipt", {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setReceipt(data);
                setShowReceipt(true);
            } else {
                console.error("Erreur lors du chargement du reçu");
            }
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setIsLoadingReceipt(false);
        }
    };

    // Formater la date de paiement
    const formatPaymentDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString('fr-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                        <span className={`badge ${statusInfo.color} px-3 py-2 inline-block text-white rounded`}>
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

            {/* TOGGLE DETAILS & RECEIPT */}
            <div className="p-3 border-bottom">
                <div className="d-flex gap-2 flex-column flex-md-row">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`${styles.submitButton} flex-grow-1 d-flex justify-content-between align-items-center`}
                    >
                        <span>{isExpanded ? "Masquer les détails" : "Voir les détails"}</span>
                        <i className={`bi bi-chevron-${isExpanded ? "up" : "down"}`}></i>
                    </button>

                    {/* Bouton pour afficher le reçu (EF30) */}
                    <button
                        onClick={loadReceipt}
                        disabled={isLoadingReceipt}
                        className={`${styles.submitButton} flex-grow-1 d-flex justify-content-between align-items-center`}
                    >
                        {isLoadingReceipt ? "Chargement..." : (showReceipt ? "Masquer le reçu" : "Voir le reçu")}
                        <i className={`bi bi-receipt`} />
                    </button>
                </div>
            </div>

            {/* Affichage du reçu de paiement (EF30) */}
            {showReceipt && receipt && (
                <div className="p-4 bg-light border-bottom">
                    <h5 className="fw-bold mb-4 d-flex align-items-center">
                        <i className="bi bi-receipt-cutoff me-2"></i>
                        Reçu de paiement
                    </h5>

                    {receipt.paymentStatus === "Succeeded" ? (
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-calendar-event text-primary me-2 fs-5"></i>
                                            <span className="text-secondary small">Date et heure du paiement</span>
                                        </div>
                                        <p className="fw-semibold mb-0">{formatPaymentDate(receipt.paidAtUtc)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-person text-primary me-2 fs-5"></i>
                                            <span className="text-secondary small">Nom sur la carte</span>
                                        </div>
                                        <p className="fw-semibold mb-0">{receipt.billingName || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-geo-alt text-primary me-2 fs-5"></i>
                                            <span className="text-secondary small">Adresse de facturation</span>
                                        </div>
                                        <p className="fw-semibold mb-0">{receipt.billingAddress || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-telephone text-primary me-2 fs-5"></i>
                                            <span className="text-secondary small">Téléphone de facturation</span>
                                        </div>
                                        <p className="fw-semibold mb-0">{receipt.billingPhone || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-credit-card text-primary me-2 fs-5"></i>
                                            <span className="text-secondary small">Carte utilisée</span>
                                        </div>
                                        <p className="fw-semibold mb-0">
                                            {receipt.cardLast4 ? `•••• •••• •••• ${receipt.cardLast4}` : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-check-circle text-success me-2 fs-5"></i>
                                            <span className="text-secondary small">Statut du paiement</span>
                                        </div>
                                        <span className="badge bg-success fs-6">
                                            <i className="bi bi-check-lg me-1"></i>
                                            Payé avec succès
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-warning d-flex align-items-center" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                            <div>
                                <strong>Paiement en attente</strong>
                                <p className="mb-0">Le paiement n'a pas encore été complété pour cette commande.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

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