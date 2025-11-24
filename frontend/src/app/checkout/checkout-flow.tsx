"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm from "./checkout-form";
import styles from "@/app/styles/page.module.css";

export default function CheckoutFlow() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);

    useEffect(() => {
        checkAuthentication();
    }, []);

    async function checkAuthentication() {
    try {
        console.log('Vérification authentification...');
        const res = await fetch('/api/orders/check-auth', {
            method: 'POST',
        });
        
        if (!res.ok) {
            console.error('Erreur check-auth:', res.status);
            throw new Error('Erreur lors de la vérification');
        }
        
        const data = await res.json();
        console.log('Auth status:', data);
        setIsAuthenticated(data.isAuthenticated);

        if (!data.isAuthenticated) {
            setShowAuthPrompt(true);
        }
    } catch (error) {
        console.error('Erreur lors de la vérification d\'authentification:', error);
        // Assumer non authentifié en cas d'erreur
        setIsAuthenticated(false);
        setShowAuthPrompt(true);
    }
}

    if (isAuthenticated === null) {
        return (
            <div className={`min-vh-100 ${styles.backgroundPrimary} d-flex align-items-center justify-content-center`}>
                <p className="text-light">Chargement...</p>
            </div>
        );
    }

    // EF21 - Prompt pour invités
    if (showAuthPrompt && !isAuthenticated) {
        return (
            <div className={`min-vh-100 ${styles.backgroundPrimary} d-flex align-items-center justify-content-center`}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className={`p-5 ${styles.backgroundThird} rounded-4 shadow text-center`}>
                                <h2 className="mb-4">Comment souhaitez-vous continuer?</h2>
                                <p className="mb-4 text-secondary">
                                    Connectez-vous pour bénéficier de vos informations sauvegardées, 
                                    ou continuez en tant qu'invité.
                                </p>
                                
                                <div className="d-grid gap-3">
                                    <button 
                                        onClick={() => {
                                            sessionStorage.setItem('redirectAfterLogin', '/checkout');
                                            router.push('/account/login');
                                        }}
                                        className={`${styles.submitButton} py-3`}
                                    >
                                        Se connecter
                                    </button>
                                    
                                    <button 
                                        onClick={() => {
                                            sessionStorage.setItem('redirectAfterLogin', '/checkout');
                                            router.push('/account/signup');
                                        }}
                                        className={`${styles.submitButton} py-3`}
                                    >
                                        Créer un compte
                                    </button>
                                    
                                    <button 
                                        onClick={() => setShowAuthPrompt(false)}
                                        className="btn btn-outline-secondary py-3"
                                    >
                                        Continuer en tant qu'invité
                                    </button>
                                    
                                    <button 
                                        onClick={() => router.push('/shop/cart')}
                                        className="btn btn-link text-secondary"
                                    >
                                        Retour au panier
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // EF22 - Afficher le formulaire de commande
    return <CheckoutForm isAuthenticated={isAuthenticated} />;
}