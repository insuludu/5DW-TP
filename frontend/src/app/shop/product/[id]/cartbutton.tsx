'use client';

import { useState, useEffect } from 'react';
import { AuthCookieName } from '@/constants';

export default function AddToCartButton({ productId }: { productId: number }) {
    const [isGuest, setIsGuest] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Détecter si l'utilisateur est connecté
    useEffect(() => {
        const checkAuthStatus = () => {
            const hasAuthCookie = document.cookie
                .split('; ')
                .some(cookie => cookie.startsWith(`${AuthCookieName}=`));
            
            setIsGuest(!hasAuthCookie);
        };
        
        checkAuthStatus();
    }, []);

    const handleClick = async () => {
        setIsLoading(true);
        setShowSuccess(false);

        // Choisir l'endpoint selon le statut
        const endpoint = isGuest 
            ? '/api/shop/guest-cart/add-product'
            : '/api/shop/cart/add-product';

        const formData = new FormData();
        formData.append('id', productId.toString());
        formData.append('amount', '1'); // Ajouter 1 unité par défaut

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Produit ajouté au panier:', data);
                
                // Feedback
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            } else {
                console.error('Erreur lors de l\'ajout au panier:', data.error);
                alert('Erreur lors de l\'ajout au panier');
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
            alert('Erreur réseau');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            onClick={handleClick} 
            className={`btn btn-lg w-100 ${showSuccess ? 'btn-success' : 'btn-danger'}`}
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Ajout en cours...
                </>
            ) : showSuccess ? (
                <>
                    ✓ Ajouté au panier !
                </>
            ) : (
                'Ajouter au panier'
            )}
        </button>
    );
}