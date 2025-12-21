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

interface PaymentReceiptDTO {
    paidAtUtc?: string;
    billingName?: string;
    billingAddress?: string;
    billingPhone?: string;
    cardLast4?: string;
    paymentStatus?: string;
}

export default function OrderList({ IsAdmin }: { IsAdmin: boolean }) {
    const [orders, setOrders] = useState<OrderFullDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getOrders() {
            try {
                var res;

                if (!IsAdmin)
                    res = await fetch("/api/orders/get-orders");
                else
                    res = await fetch("/api/orders/get-orders-admin");

                if (res.status === 401) {
                    window.location.href = "/error";
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

                {IsAdmin && (
                    <h1 className="display-4 text-light text-center mb-5">Liste des Commandes</h1>
                )}
                {!IsAdmin && (
                    <h1 className="display-4 text-light text-center mb-5">Mes Commandes</h1>
                )}


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

    const [receipt, setReceipt] = useState<PaymentReceiptDTO | null>(null);
    const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptError, setReceiptError] = useState<string | null>(null);

    const statusMap: Record<number, { label: string; color: string }> = {
        0: { label: "Confirmée", color: "bg-success" },
        1: { label: "Annulée", color: "bg-danger" },
        2: { label: "En préparation", color: "bg-info" },
        3: { label: "En expédition", color: "bg-primary" },
        4: { label: "Livrée", color: "bg-success" },
        5: { label: "Retour", color: "bg-warning" }
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

    const loadReceipt = async () => {
        if (receipt) {
            setShowReceipt(!showReceipt);
            return;
        }

        setIsLoadingReceipt(true);
        setReceiptError(null);

        try {
            const formData = new FormData();
            formData.append("ordernumber", order.orderNumber);

            // 🔍 DEBUG: Afficher ce qui est envoyé
            console.log("========================================");
            console.log("🔍 [DEBUG] Données envoyées:");
            console.log("   orderNumber:", order.orderNumber);
            console.log("   Type:", typeof order.orderNumber);
            console.log("   Longueur:", order.orderNumber?.length);
            console.log("========================================");

            const res = await fetch("/api/orders/getReceipt", {
                method: "POST",
                body: formData
            });

            console.log("📡 [DEBUG] Statut réponse:", res.status);
            console.log("📡 [DEBUG] URL appelée:", res.url);

            if (res.ok) {
                const data = await res.json();
                console.log(" [DEBUG] Données reçues:", data);
                setReceipt(data);
                setShowReceipt(true);
            } else {
                // 🔍 DEBUG: Lire la réponse d'erreur complète
                const errorText = await res.text();
                console.error(" [DEBUG] Erreur complète:", errorText);

                let errorMessage = "Erreur lors du chargement du reçu";

                if (res.status === 401) {
                    errorMessage = "Vous devez être connecté pour voir le reçu";
                } else if (res.status === 404) {
                    errorMessage = "Reçu non trouvé pour cette commande";
                    // 🔍 Afficher plus d'infos pour déboguer
                    console.error("❌ Commande recherchée:", order.orderNumber);
                    console.error("❌ Vérifiez que cette commande existe et vous appartient");
                } else if (res.status === 400) {
                    errorMessage = "Numéro de commande invalide";
                }

                setReceiptError(errorMessage);
            }
        } catch (error) {
            console.error("❌ [DEBUG] Erreur réseau:", error);
            setReceiptError("Erreur de connexion au serveur");
        } finally {
            setIsLoadingReceipt(false);
        }
    };

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

                        {(orderStatus === 0 || orderStatus === 2) && (
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

            {/* BOUTONS DÉTAILS ET REÇU */}
            <div className="p-3 border-bottom">
                <div className="d-flex gap-2 flex-column flex-md-row">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`${styles.submitButton} flex-grow-1 d-flex justify-content-between align-items-center`}
                    >
                        {isExpanded ? "Masquer les détails" : "Voir les détails"}
                        <i className={`bi bi-chevron-${isExpanded ? "up" : "down"}`} />
                    </button>

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

            {/* ERREUR REÇU */}
            {receiptError && (
                <div className="p-3 bg-danger bg-opacity-10 border-bottom">
                    <div className="alert alert-danger mb-0 d-flex align-items-center">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {receiptError}
                    </div>
                </div>
            )}

            {/* AFFICHAGE DU REÇU */}
            {showReceipt && receipt && (
                <div className="p-4 bg-light border-bottom">
                    <h6 className="fw-bold mb-3 d-flex align-items-center">
                        <i className="bi bi-receipt me-2"></i>
                        Informations de paiement
                    </h6>

                    {receipt.paymentStatus === "Succeeded" ? (
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="d-flex flex-column">
                                    <span className="text-secondary small">Date et heure du paiement</span>
                                    <span className="fw-semibold">{formatPaymentDate(receipt.paidAtUtc)}</span>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex flex-column">
                                    <span className="text-secondary small">Nom sur la carte</span>
                                    <span className="fw-semibold">{receipt.billingName || "N/A"}</span>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex flex-column">
                                    <span className="text-secondary small">Adresse de facturation</span>
                                    <span className="fw-semibold">{receipt.billingAddress || "N/A"}</span>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex flex-column">
                                    <span className="text-secondary small">Téléphone de facturation</span>
                                    <span className="fw-semibold">{receipt.billingPhone || "N/A"}</span>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex flex-column">
                                    <span className="text-secondary small">Carte utilisée</span>
                                    <span className="fw-semibold">
                                        {receipt.cardLast4 ? `•••• ${receipt.cardLast4}` : "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex flex-column">
                                    <span className="text-secondary small">Statut du paiement</span>
                                    <span className="badge bg-success d-inline-block align-self-start mt-1">
                                        Payé
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-warning mb-0">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Le paiement n'a pas encore été complété pour cette commande.
                        </div>
                    )}
                </div>
            )}

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