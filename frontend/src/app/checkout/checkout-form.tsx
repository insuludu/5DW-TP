"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/page.module.css";
import { CartProductDTO } from "@/interfaces";

interface CheckoutFormProps {
    isAuthenticated: boolean;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
}

interface FieldErrors {
    [key: string]: string[];
}

export default function CheckoutForm({ isAuthenticated }: CheckoutFormProps) {
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        province: '',
        country: 'Canada',
        postalCode: ''
    });

    const [cartItems, setCartItems] = useState<CartProductDTO[]>([]);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const [validatingFields, setValidatingFields] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Debounce timer refs
    const validationTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

    useEffect(() => {
        loadCartItems();

        if (isAuthenticated) {
            loadCustomerInfo();
        }

        // Cleanup timers on unmount
        return () => {
            Object.values(validationTimers.current).forEach(timer => clearTimeout(timer));
        };
    }, [isAuthenticated]);

    async function loadCartItems() {
    try {
        console.log('Chargement du panier...');
        const res = await fetch('/api/shop/cart/products');
        
        if (!res.ok) {
            console.error('Erreur HTTP:', res.status);
            throw new Error("Erreur lors du chargement du panier");
        }
        
        const data = await res.json();
        console.log('Panier chargé:', data);
        setCartItems(data);
        
        if (data.length === 0) {
            console.log('Panier vide, redirection...');
            router.push('/shop/cart');
        }
    } catch (err) {
        console.error('Erreur lors du chargement du panier:', err);
        setError('Impossible de charger le panier. Veuillez vérifier que vous avez des articles dans votre panier.');
        // Ne pas rediriger en cas d'erreur pour permettre de voir le message
    }
}

    async function loadCustomerInfo() {
        try {
            const res = await fetch('/api/orders/customer-info');

            if (res.ok) {
                const data = await res.json();
                setFormData(data);
            }
        } catch (err) {
            console.error('Erreur lors du chargement des informations client:', err);
        }
    }

   async function validateField(fieldName: string, value: string) {
    if (!value || value.trim() === '') {
        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: [`Ce champ est requis`]
        }));
        return;
    }

    setValidatingFields(prev => new Set(prev).add(fieldName));

    try {
        const res = await fetch('/api/orders/validate-field', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fieldName: fieldName,
                value: value
            })
        });

        const data = await res.json();

        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: data.isValid ? [] : data.errors
        }));
    } catch (err) {
        console.error(`Erreur de validation pour ${fieldName}:`, err);
        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: []
        }));
    } finally {
        setValidatingFields(prev => {
            const newSet = new Set(prev);
            newSet.delete(fieldName);
            return newSet;
        });
    }
}

    // Debounced validation
    function scheduleValidation(fieldName: string, value: string) {
        // Clear existing timer for this field
        if (validationTimers.current[fieldName]) {
            clearTimeout(validationTimers.current[fieldName]);
        }

        // Schedule new validation
        validationTimers.current[fieldName] = setTimeout(() => {
            validateField(fieldName, value);
        }, 500); // 500ms debounce
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Only validate if field has been touched
        if (touchedFields.has(name)) {
            scheduleValidation(name, value);
        }
    }

    function handleBlur(fieldName: string) {
        setTouchedFields(prev => new Set(prev).add(fieldName));

        // Validate immediately on blur
        if (validationTimers.current[fieldName]) {
            clearTimeout(validationTimers.current[fieldName]);
        }
        validateField(fieldName, formData[fieldName as keyof FormData]);
    }

    // Formater le numéro de téléphone pendant la saisie
    function formatPhoneNumber(value: string) {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            const formatted = !match[2]
                ? match[1]
                : `(${match[1]}) ${match[2]}${match[3] ? '-' + match[3] : ''}`;
            return formatted;
        }
        return value;
    }

    function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatPhoneNumber(e.target.value);
        setFormData(prev => ({
            ...prev,
            phoneNumber: formatted
        }));

        if (touchedFields.has('phoneNumber')) {
            scheduleValidation('phoneNumber', formatted);
        }
    }

    // Formater le code postal pendant la saisie
    function formatPostalCode(value: string) {
        const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        if (cleaned.length <= 3) {
            return cleaned;
        }
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
    }

    function handlePostalCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatPostalCode(e.target.value);
        setFormData(prev => ({
            ...prev,
            postalCode: formatted
        }));

        if (touchedFields.has('postalCode')) {
            scheduleValidation('postalCode', formatted);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Marquer tous les champs comme touchés
    const allFields = Object.keys(formData);
    setTouchedFields(new Set(allFields));

    // Valider tous les champs et attendre les résultats
    const validationPromises = allFields.map(field => 
        validateField(field, formData[field as keyof FormData])
    );
    await Promise.all(validationPromises);

    // Attendre un peu pour que les états se mettent à jour
    await new Promise(resolve => setTimeout(resolve, 100));

    // Vérifier s'il y a des erreurs après validation
    const currentErrors = Object.entries(fieldErrors).filter(([_, errors]) => errors && errors.length > 0);
    
    if (currentErrors.length > 0) {
        setError('Veuillez corriger les erreurs dans le formulaire');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // Vérifier que tous les champs requis sont remplis
    const emptyFields = allFields.filter(field => {
        const value = formData[field as keyof FormData];
        return !value || value.trim() === '';
    });

    if (emptyFields.length > 0) {
        setError('Veuillez remplir tous les champs obligatoires');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    setLoading(true);
    setError('');

    try {
        const orderData = {
            ...formData,
            cartItems: cartItems.map(item => ({
                productId: item.id,
                quantity: item.amount
            }))
        };

        console.log('=== DÉBUT CRÉATION COMMANDE ===');
        console.log('Données envoyées:', orderData);

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        console.log('Statut HTTP reçu:', res.status);
        console.log('Content-Type:', res.headers.get('content-type'));

        const data = await res.json();
        console.log('Réponse complète du serveur:', data);

        if (!res.ok) {
            console.error('Erreur serveur:', data);
            
            // Afficher les erreurs de validation du serveur
            if (data.errors) {
                setFieldErrors(data.errors);
            }
            
            throw new Error(data.message || `Erreur HTTP ${res.status}`);
        }

        console.log('✅ Commande créée avec succès!');
        console.log('Order ID:', data.orderID);
        console.log('Order Number:', data.orderNumber);

        // Vider le panier
        console.log('Vidage du panier...');
        await fetch('/api/shop/cart/clear', {
            method: 'POST'
        });
        console.log('✅ Panier vidé');

        const redirectUrl = `/order-confirmation/${data.orderID}`;
        console.log('Redirection vers:', redirectUrl);
        console.log('=== FIN CRÉATION COMMANDE ===');

        router.push(redirectUrl);

    } catch (err: any) {
        console.error('❌ ERREUR lors de la création:', err);
        console.error('Type erreur:', typeof err);
        console.error('Message:', err.message);
        console.error('Stack:', err.stack);
        
        setError(err.message || 'Une erreur est survenue lors de la création de la commande');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
        setLoading(false);
    }
}
    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.discountPrice ?? item.price;
        return sum + (price * item.amount);
    }, 0);

    // Helper pour afficher les erreurs d'un champ
    const getFieldError = (fieldName: string) => {
        if (!touchedFields.has(fieldName)) return null;
        const errors = fieldErrors[fieldName];
        return errors && errors.length > 0 ? errors[0] : null;
    };

    // Helper pour déterminer si un champ est en cours de validation
    const isValidating = (fieldName: string) => validatingFields.has(fieldName);

    // Helper pour déterminer si un champ est valide
    const isFieldValid = (fieldName: string) => {
        if (!touchedFields.has(fieldName)) return false;
        const value = formData[fieldName as keyof FormData];
        return value && value.trim() !== '' &&
            (!fieldErrors[fieldName] || fieldErrors[fieldName].length === 0);
    };

    return (
        <section className={`min-vh-100 ${styles.backgroundPrimary} py-5`}>
            <div className="container">
                <h1 className="display-4 text-light text-center mb-5">Informations de livraison</h1>

                {error && (
                    <div className="alert alert-danger text-center mb-4">
                        {error}
                    </div>
                )}

                <div className="row g-4">
                    {/* Formulaire */}
                    <div className="col-lg-7">
                        <div className={`p-4 ${styles.backgroundThird} rounded-4 shadow`}>
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row g-3">
                                    {/* Prénom */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Prénom *
                                            {isValidating('firstName') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {isFieldValid('firstName') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('firstName')}
                                            className={`form-control ${getFieldError('firstName') ? 'is-invalid' :
                                                    isFieldValid('firstName') ? 'is-valid' : ''
                                                }`}
                                            required
                                        />
                                        {getFieldError('firstName') && (
                                            <div className="invalid-feedback d-block">
                                                {getFieldError('firstName')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Nom */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Nom *
                                            {isValidating('lastName') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {isFieldValid('lastName') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('lastName')}
                                            className={`form-control ${getFieldError('lastName') ? 'is-invalid' :
                                                    isFieldValid('lastName') ? 'is-valid' : ''
                                                }`}
                                            required
                                        />
                                        {getFieldError('lastName') && (
                                            <div className="invalid-feedback d-block">
                                                {getFieldError('lastName')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="col-12">
                                        <label className="form-label">
                                            Adresse courriel *
                                            {isValidating('email') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {isFieldValid('email') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('email')}
                                            className={`form-control ${getFieldError('email') ? 'is-invalid' :
                                                    isFieldValid('email') ? 'is-valid' : ''
                                                }`}
                                            placeholder="exemple@courriel.com"
                                            required
                                        />
                                        {getFieldError('email') && (
                                            <div className="invalid-feedback d-block">
                                                {getFieldError('email')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Téléphone */}
                                    <div className="col-12">
                                        <label className="form-label">
                                            Numéro de téléphone *
                                            {isValidating('phoneNumber') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {isFieldValid('phoneNumber') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handlePhoneChange}
                                            onBlur={() => handleBlur('phoneNumber')}
                                            className={`form-control ${getFieldError('phoneNumber') ? 'is-invalid' :
                                                    isFieldValid('phoneNumber') ? 'is-valid' : ''
                                                }`}
                                            placeholder="(123) 456-7890"
                                            required
                                        />
                                        {getFieldError('phoneNumber') && (
                                            <div className="invalid-feedback d-block">
                                                {getFieldError('phoneNumber')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Adresse */}
                                    <div className="col-12">
                                        <label className="form-label">
                                            Adresse civique *
                                            {isValidating('address') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {isFieldValid('address') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('address')}
                                            className={`form-control ${getFieldError('address') ? 'is-invalid' :
                                                    isFieldValid('address') ? 'is-valid' : ''
                                                }`}
                                            placeholder="123 Rue Principale, App. 4"
                                            required
                                        />
                                        {getFieldError('address') && (
                                            <div className="invalid-feedback d-block">
                                                {getFieldError('address')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Ville */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Ville *
                                            {isValidating('city') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {isFieldValid('city') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('city')}
                                            className={`form-control ${getFieldError('city') ? 'is-invalid' :
                                                    isFieldValid('city') ? 'is-valid' : ''
                                                }`}
                                            required
                                        />
                                        {getFieldError('city') && (
                                            <div className="invalid-feedback d-block">
                                                {getFieldError('city')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Province */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Province *
                                            {isValidating('province') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {isFieldValid('province') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <select
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('province')}
                                            className={`form-select ${getFieldError('province') ? 'is-invalid' :
                                                    isFieldValid('province') ? 'is-valid' : ''
                                                }`}
                                            required
                                        >
                                            <option value="">Sélectionner une province</option>
                                            <option value="AB">Alberta</option>
                                            <option value="BC">Colombie-Britannique</option>
                                            <option value="MB">Manitoba</option>
                                            <option value="NB">Nouveau-Brunswick</option>
                                            <option value="NL">Terre-Neuve-et-Labrador</option>
                                            <option value="NS">Nouvelle-Écosse</option>
                                            <option value="NT">Territoires du Nord-Ouest</option>
                                            <option value="NU">Nunavut</option>
                                            <option value="ON">Ontario</option>
                                            <option value="PE">Île-du-Prince-Édouard</option>
                                            <option value="QC">Québec</option>
                                            <option value="SK">Saskatchewan</option>
                                            <option value="YT">Yukon</option>
                                        </select>
                                        {getFieldError('province') && (
                                            <div className="invalid-feedback d-block">
                                                {getFieldError('province')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Pays */}
                                    <div className="col-md-6">
                                        <label className="form-label">Pays *</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            className="form-control"
                                            disabled
                                            required
                                        />
                                        <small className="text-muted">
                                            Livraison disponible au Canada seulement
                                        </small>
                                    </div>

                                    {/* Code postal */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Code postal *
                                            {isValidating('postalCode') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {isFieldValid('postalCode') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handlePostalCodeChange}
                                            onBlur={() => handleBlur('postalCode')}
                                            className={`form-control ${getFieldError('postalCode') ? 'is-invalid' :
                                                    isFieldValid('postalCode') ? 'is-valid' : ''
                                                }`}
                                            placeholder="A1A 1A1"
                                            maxLength={7}
                                            required
                                        />
                                        {getFieldError('postalCode') && (
                                            <div className="invalid-feedback d-block">
                                                {getFieldError('postalCode')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button
                                            type="submit"
                                            className={`${styles.submitButton} w-100 py-3`}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Traitement...
                                                </>
                                            ) : (
                                                'Confirmer la commande'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Résumé de la commande */}
                    <div className="col-lg-5">
                        <div className={`p-4 ${styles.backgroundThird} rounded-4 shadow sticky-top`} style={{ top: '20px' }}>
                            <h3 className="mb-4">Résumé de la commande</h3>

                            <div className="mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {cartItems.map(item => (
                                    <div key={item.id} className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                        <div>
                                            <p className="mb-0 fw-bold">{item.name}</p>
                                            <p className="mb-0 text-secondary small">Qté: {item.amount}</p>
                                        </div>
                                        <div className="text-end">
                                            {item.discountPrice ? (
                                                <>
                                                    <p className="mb-0 text-decoration-line-through small">
                                                        {item.price.toFixed(2)}$
                                                    </p>
                                                    <p className="mb-0 fw-bold text-danger">
                                                        {(item.discountPrice * item.amount).toFixed(2)}$
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="mb-0 fw-bold">
                                                    {(item.price * item.amount).toFixed(2)}$
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-top pt-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Sous-total</span>
                                    <span className="fw-bold">{subtotal.toFixed(2)}$</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2 text-secondary">
                                    <span className="small">Taxes (à calculer)</span>
                                    <span className="small">-</span>
                                </div>
                                <div className="d-flex justify-content-between fs-4 fw-bold mt-3 pt-3 border-top">
                                    <span>Total avant taxes</span>
                                    <span>{subtotal.toFixed(2)}$</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}