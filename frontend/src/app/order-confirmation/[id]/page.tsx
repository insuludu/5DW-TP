"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import styles from "@/app/styles/page.module.css";

interface OrderConfirmation {
    orderNumber: string;
    createdAt: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        fullAddress: string;
    };
    items: Array<{
        productID: number;
        name: string;
        price: number;
        discountPrice?: number;
        finalPrice: number;
        quantity: number;
        total: number;
    }>;
    subTotal: number;
}

export default function OrderConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderConfirmation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadOrderConfirmation();
    }, [params.id]);

    async function loadOrderConfirmation() {
    try {
        console.log('Chargement de la commande, ID:', params.id); // 👈 AJOUTEZ
        console.log('URL appelée:', `/api/orders/${params.id}/confirmation`); // 👈 AJOUTEZ
        
        const res = await fetch(`/api/orders/${params.id}/confirmation`);

        console.log('Statut réponse:', res.status); // 👈 AJOUTEZ

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Erreur réponse:', errorText); // 👈 AJOUTEZ
            throw new Error('Commande introuvable');
        }

        const data = await res.json();
        console.log('Données commande:', data); // 👈 AJOUTEZ
        setOrder(data);
    } catch (err: any) {
        console.error('Erreur chargement:', err); // 👈 AJOUTEZ
        setError(err.message || 'Erreur lors du chargement de la commande');
    } finally {
        setLoading(false);
    }
}

    if (loading) {
        return (
            <div>
                <Header />
                <div className={`min-vh-100 ${styles.backgroundPrimary} d-flex align-items-center justify-content-center`}>
                    <p className="text-light">Chargement...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div>
                <Header />
                <div className={`min-vh-100 ${styles.backgroundPrimary} d-flex align-items-center justify-content-center`}>
                    <div className="text-center">
                        <p className="text-danger fs-4 mb-4">{error || 'Commande introuvable'}</p>
                        <button 
                            onClick={() => router.push('/')}
                            className={styles.submitButton}
                        >
                            Retour à l'accueil
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <section className={`min-vh-100 ${styles.backgroundPrimary} py-5`}>
                <div className="container">
                    {/* En-tête de confirmation */}
                    <div className="text-center mb-5">
                        <div className="mb-4">
                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h1 className="display-4 text-light mb-3">Commande confirmée !</h1>
                        <p className="text-light fs-5">
                            Merci pour votre commande. Un courriel de confirmation a été envoyé à <strong>{order.customer.email}</strong>
                        </p>
                    </div>

                    <div className="row g-4">
                        {/* Détails de la commande */}
                        <div className="col-lg-8">
                            <div className={`p-4 ${styles.backgroundThird} rounded-4 shadow mb-4`}>
                                <h3 className="mb-4">Détails de la commande</h3>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <p className="text-secondary mb-1">Numéro de commande</p>
                                        <p className="fs-5 fw-bold mb-0">{order.orderNumber}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-secondary mb-1">Date de commande</p>
                                        <p className="fs-5 fw-bold mb-0">
                                            {new Date(order.createdAt).toLocaleDateString('fr-CA', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Informations du client */}
                            <div className={`p-4 ${styles.backgroundThird} rounded-4 shadow mb-4`}>
                                <h3 className="mb-4">Informations de livraison</h3>
                                <p className="mb-1"><strong>{order.customer.firstName} {order.customer.lastName}</strong></p>
                                <p className="mb-1">{order.customer.email}</p>
                                <p className="mb-1">{order.customer.phoneNumber}</p>
                                <p className="mb-0 text-secondary">{order.customer.fullAddress}</p>
                            </div>

                            {/* Articles commandés */}
                            <div className={`p-4 ${styles.backgroundThird} rounded-4 shadow`}>
                                <h3 className="mb-4">Articles commandés</h3>
                                <div className="table-responsive">
                                    <table className="table table-borderless">
                                        <thead className="border-bottom">
                                            <tr>
                                                <th>Produit</th>
                                                <th className="text-center">Quantité</th>
                                                <th className="text-end">Prix unitaire</th>
                                                <th className="text-end">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map(item => (
                                                <tr key={item.productID} className="border-bottom">
                                                    <td className="py-3">
                                                        <p className="mb-0 fw-bold">{item.name}</p>
                                                    </td>
                                                    <td className="text-center py-3">{item.quantity}</td>
                                                    <td className="text-end py-3">
                                                        {item.discountPrice ? (
                                                            <>
                                                                <span className="text-decoration-line-through small text-secondary d-block">
                                                                    {item.price.toFixed(2)}$
                                                                </span>
                                                                <span className="text-danger fw-bold">
                                                                    {item.finalPrice.toFixed(2)}$
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="fw-bold">{item.price.toFixed(2)}$</span>
                                                        )}
                                                    </td>
                                                    <td className="text-end py-3 fw-bold">
                                                        {item.total.toFixed(2)}$
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Résumé */}
                        <div className="col-lg-4">
                            <div className={`p-4 ${styles.backgroundThird} rounded-4 shadow sticky-top`} style={{ top: '20px' }}>
                                <h3 className="mb-4">Résumé</h3>
                                
                                <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                    <span>Sous-total</span>
                                    <span className="fw-bold">{order.subTotal.toFixed(2)}$</span>
                                </div>

                                <div className="d-flex justify-content-between mb-3 pb-3 border-bottom text-secondary">
                                    <span>Taxes</span>
                                    <span>À calculer</span>
                                </div>

                                <div className="d-flex justify-content-between fs-4 fw-bold">
                                    <span>Total avant taxes</span>
                                    <span>{order.subTotal.toFixed(2)}$</span>
                                </div>

                                <div className="mt-4 pt-4 border-top">
                                    <button 
                                        onClick={() => router.push('/')}
                                        className={`${styles.submitButton} w-100 mb-3`}
                                    >
                                        Retour à l'accueil
                                    </button>
                                    <button 
                                        onClick={() => window.print()}
                                        className="btn btn-outline-secondary w-100"
                                    >
                                        <i className="bi bi-printer me-2"></i>
                                        Imprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}