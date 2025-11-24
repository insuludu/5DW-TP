"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

export default function CheckoutForm({ isAuthenticated }: CheckoutFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        setError,
        clearErrors,
        trigger,
        watch
    } = useForm<FormData>({
        mode: "onBlur",
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            address: '',
            city: '',
            province: '',
            country: 'Canada',
            postalCode: ''
        }
    });

    const [cartItems, setCartItems] = useState<CartProductDTO[]>([]);
    const [validatingFields, setValidatingFields] = useState<Set<string>>(new Set());
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);

    const validationTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

    useEffect(() => {
        loadCartItems();

        if (isAuthenticated) {
            loadCustomerInfo();
        }

        return () => {
            Object.values(validationTimers.current).forEach(timer => clearTimeout(timer));
        };
    }, [isAuthenticated]);

    async function loadCartItems() {
        try {
            const res = await fetch('/api/shop/cart/products');
            if (!res.ok) throw new Error("Erreur lors du chargement du panier");
            const data = await res.json();
            setCartItems(data);

            if (data.length === 0) {
                router.push('/shop/cart');
            }
        } catch (err) {
            console.error('Erreur panier:', err);
            setGeneralError('Impossible de charger le panier');
        }
    }

    async function loadCustomerInfo() {
        try {
            const res = await fetch('/api/orders/customer-info');
            if (res.ok) {
                const data = await res.json();
                Object.entries(data).forEach(([key, value]) => {
                    setValue(key as keyof FormData, value as string);
                });
            }
        } catch (err) {
            console.error('Erreur chargement info client:', err);
        }
    }

    const checkEmailExists = async (email: string): Promise<boolean> => {
        // Si l'utilisateur est authentifié, ne pas vérifier
        if (isAuthenticated) {
            return false;
        }

        try {
            const res = await fetch('/api/orders/validate-field', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fieldName: 'email',
                    value: email
                })
            });

            const data = await res.json();
            
            // Si l'API retourne isValid=false, c'est que l'email existe
            return !data.isValid;
        } catch (err) {
            console.error('Erreur vérification email:', err);
            return false;
        }
    };

    // Validation asynchrone avec le backend
    const validateFieldAsync = async (fieldName: keyof FormData, value: string) => {
        // Ne pas valider pendant la soumission du formulaire
        if (isSubmittingForm) {
            return;
        }

        // Ne rien faire si le champ est vide (la validation "required" s'en charge)
        if (!value || value.trim() === '') {
            return;
        }

        // Annuler le timer précédent pour ce champ (debouncing)
        if (validationTimers.current[fieldName]) {
            clearTimeout(validationTimers.current[fieldName]);
        }

        // Créer un nouveau timer (attendre 500ms avant de valider)
        validationTimers.current[fieldName] = setTimeout(async () => {
            // Indiquer que ce champ est en cours de validation
            setValidatingFields(prev => new Set(prev).add(fieldName));

            try {
                // Appeler l'API de validation backend
                const res = await fetch('/api/orders/validate-field', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fieldName: fieldName,
                        value: value
                    })
                });

                const data = await res.json();

                // Si le champ n'est pas valide selon le backend
                if (!data.isValid && data.errors?.length > 0) {
                    setError(fieldName, {
                        type: 'server',
                        message: data.errors[0]
                    });
                } else {
                    // Si valide, effacer les erreurs pour ce champ
                    clearErrors(fieldName);
                }
            } catch (err) {
                console.error(`Erreur validation ${fieldName}:`, err);
                // En cas d'erreur réseau, ne pas bloquer l'utilisateur
                // On garde les erreurs existantes ou on efface
            } finally {
                // Retirer le champ de la liste "en cours de validation"
                setValidatingFields(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(fieldName);
                    return newSet;
                });
            }
        }, 500); // Debounce de 500ms
    };

    // Règles de validation frontend (basiques)
    const validationRules = {
        firstName: {
            required: "Le prénom est requis",
            minLength: { value: 2, message: "Au moins 2 caractères" },
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                validateFieldAsync('firstName', e.target.value);
            }
        },
        lastName: {
            required: "Le nom est requis",
            minLength: { value: 2, message: "Au moins 2 caractères" },
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                validateFieldAsync('lastName', e.target.value);
            }
        },
        email: {
            required: "L'email est requis",
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Format email invalide"
            },
            // Validation asynchrone qui vérifie si l'email existe
            validate: {
                emailNotTaken: async (value: string) => {
                    // Ne vérifier que pour les invités
                    if (isAuthenticated) {
                        return true;
                    }

                    // Validation de format d'abord
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(value)) {
                        return true; // Laisser la validation pattern gérer ça
                    }

                    const exists = await checkEmailExists(value);
                    return !exists || "Cet email est déjà associé à un compte. Veuillez vous connecter.";
                }
            },
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                validateFieldAsync('email', e.target.value);
            }
        },
        phoneNumber: {
            required: "Le téléphone est requis",
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                validateFieldAsync('phoneNumber', e.target.value);
            }
        },
        address: {
            required: "L'adresse est requise",
            minLength: { value: 5, message: "Au moins 5 caractères" },
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                validateFieldAsync('address', e.target.value);
            }
        },
        city: {
            required: "La ville est requise",
            minLength: { value: 2, message: "Au moins 2 caractères" },
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                validateFieldAsync('city', e.target.value);
            }
        },
        province: {
            required: "La province est requise",
            onBlur: (e: React.FocusEvent<HTMLSelectElement>) => {
                validateFieldAsync('province', e.target.value);
            }
        },
        postalCode: {
            required: "Le code postal est requis",
            pattern: {
                value: /^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z]\s?[0-9][ABCEGHJ-NPRSTV-Z][0-9]$/i,
                message: "Format invalide (exemple: H1A 2B3)"
            },
            validate: {
                noWZ: (value: string) => {
                    const first = value.trim().toUpperCase()[0];
                    return (first !== 'W' && first !== 'Z') ||
                        "Le code postal ne peut pas commencer par W ou Z";
                },
                validLetters: (value: string) => {
                    const cleaned = value.replace(/\s/g, '').toUpperCase();
                    const validPattern = /^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z][0-9][ABCEGHJ-NPRSTV-Z][0-9]$/;
                    return validPattern.test(cleaned) || "Le code postal contient des lettres invalides";
                }
            },
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                validateFieldAsync('postalCode', e.target.value);
            }
        }
    };

    // Formater le téléphone
    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? '-' + match[3] : ''}`;
        }
        return value;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setValue('phoneNumber', formatted);
    };

    // Formater le code postal
    const formatPostalCode = (value: string) => {
        const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        if (cleaned.length <= 3) return cleaned;
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
    };

    const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPostalCode(e.target.value);
        setValue('postalCode', formatted);
    };

    const [isSubmittingForm, setIsSubmittingForm] = useState(false);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setGeneralError('');
        setIsSubmittingForm(true); // 👈 Empêche la validation async

        if (!isAuthenticated) {
            const emailExists = await checkEmailExists(data.email);
            if (emailExists) {
                setError('email', {
                    type: 'manual',
                    message: "Cet email est déjà associé à un compte. Veuillez vous connecter."
                });
                setGeneralError('Veuillez corriger les erreurs dans le formulaire');
                setLoading(false);
                setIsSubmittingForm(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
        }

        try {
            const orderData = {
                ...data,
                cartItems: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.amount
                }))
            };

            console.log('📤 Données envoyées:', orderData);

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const responseData = await res.json();
            console.log('📥 Réponse du serveur:', responseData);

            if (!res.ok) {
                console.error('❌ Erreurs de validation:', responseData.errors);

                if (responseData.errors) {
                    Object.entries(responseData.errors).forEach(([field, messages]) => {
                        const errorArray = messages as string[];
                        if (errorArray.length > 0) {
                            const fieldMap: { [key: string]: keyof FormData } = {
                                'FirstName': 'firstName',
                                'LastName': 'lastName',
                                'Email': 'email',
                                'PhoneNumber': 'phoneNumber',
                                'Address': 'address',
                                'City': 'city',
                                'Province': 'province',
                                'Country': 'country',
                                'PostalCode': 'postalCode'
                            };

                            const frontendField = fieldMap[field] || field.toLowerCase();
                            setError(frontendField as keyof FormData, {
                                type: 'server',
                                message: errorArray[0]
                            });
                        }
                    });

                    setGeneralError('Veuillez corriger les erreurs dans le formulaire');
                }

                throw new Error(responseData.message || 'Validation échouée');
            }

            console.log('✅ Commande créée avec succès!');

            await fetch('/api/shop/cart/clear', { method: 'POST' });
            router.push(`/order-confirmation/${responseData.orderID}`);

        } catch (err: any) {
            console.error('💥 Erreur:', err);
            if (!generalError) {
                setGeneralError(err.message || 'Une erreur est survenue');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
            setIsSubmittingForm(false); // 👈 Réactive la validation async
        }
    };

    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.discountPrice ?? item.price;
        return sum + (price * item.amount);
    }, 0);

    const isFieldValidating = (field: string) => validatingFields.has(field);

    return (
        <section className={`min-vh-100 ${styles.backgroundPrimary} py-5`}>
            <div className="container">
                <h1 className="display-4 text-light text-center mb-5">Informations de livraison</h1>

                {generalError && (
                    <div className="alert alert-danger text-center mb-4">
                        {generalError}
                    </div>
                )}

                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className={`p-4 ${styles.backgroundThird} rounded-4 shadow`}>
                            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                <div className="row g-3">
                                    {/* Prénom */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Prénom *
                                            {isFieldValidating('firstName') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {!errors.firstName && !isFieldValidating('firstName') && watch('firstName') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                            {...register('firstName', validationRules.firstName)}
                                        />
                                        {errors.firstName && (
                                            <div className="invalid-feedback d-block">
                                                {errors.firstName.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Nom */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Nom *
                                            {isFieldValidating('lastName') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {!errors.lastName && !isFieldValidating('lastName') && watch('lastName') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                            {...register('lastName', validationRules.lastName)}
                                        />
                                        {errors.lastName && (
                                            <div className="invalid-feedback d-block">
                                                {errors.lastName.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="col-12">
                                        <label className="form-label">
                                            Email *
                                            {isFieldValidating('email') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {!errors.email && !isFieldValidating('email') && watch('email') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            placeholder="exemple@courriel.com"
                                            {...register('email', validationRules.email)}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback d-block">
                                                {errors.email.message}
                                                {errors.email.message?.includes('déjà associé') && (
                                                    <div className="mt-2">
                                                        <a href="/account/login" className="text-decoration-none fw-bold">
                                                            → Se connecter maintenant
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Téléphone */}
                                    <div className="col-12">
                                        <label className="form-label">
                                            Téléphone *
                                            {isFieldValidating('phoneNumber') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {!errors.phoneNumber && !isFieldValidating('phoneNumber') && watch('phoneNumber') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="tel"
                                            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                            placeholder="(123) 456-7890"
                                            {...register('phoneNumber', {
                                                ...validationRules.phoneNumber,
                                                onChange: handlePhoneChange
                                            })}
                                        />
                                        {errors.phoneNumber && (
                                            <div className="invalid-feedback d-block">
                                                {errors.phoneNumber.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Adresse */}
                                    <div className="col-12">
                                        <label className="form-label">
                                            Adresse civique *
                                            {isFieldValidating('address') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {!errors.address && !isFieldValidating('address') && watch('address') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                            placeholder="123 Rue Principale, App. 4"
                                            {...register('address', validationRules.address)}
                                        />
                                        {errors.address && (
                                            <div className="invalid-feedback d-block">
                                                {errors.address.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Ville */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Ville *
                                            {isFieldValidating('city') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {!errors.city && !isFieldValidating('city') && watch('city') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                            {...register('city', validationRules.city)}
                                        />
                                        {errors.city && (
                                            <div className="invalid-feedback d-block">
                                                {errors.city.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Province */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Province *
                                            {isFieldValidating('province') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {!errors.province && !isFieldValidating('province') && watch('province') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <select
                                            className={`form-select ${errors.province ? 'is-invalid' : ''}`}
                                            {...register('province', validationRules.province)}
                                        >
                                            <option value="">Sélectionner</option>
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
                                        {errors.province && (
                                            <div className="invalid-feedback d-block">
                                                {errors.province.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Pays */}
                                    <div className="col-md-6">
                                        <label className="form-label">Pays *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register('country')}
                                            disabled
                                        />
                                        <small className="text-muted">
                                            Livraison au Canada seulement
                                        </small>
                                    </div>

                                    {/* Code postal */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Code postal *
                                            {isFieldValidating('postalCode') && (
                                                <span className="ms-2 spinner-border spinner-border-sm"></span>
                                            )}
                                            {!errors.postalCode && !isFieldValidating('postalCode') && watch('postalCode') && (
                                                <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                                            placeholder="A1A 1A1"
                                            maxLength={7}
                                            {...register('postalCode', {
                                                ...validationRules.postalCode,
                                                onChange: handlePostalCodeChange
                                            })}
                                        />
                                        {errors.postalCode && (
                                            <div className="invalid-feedback d-block">
                                                {errors.postalCode.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button
                                            type="submit"
                                            className={`${styles.submitButton} w-100 py-3`}
                                            disabled={loading || isSubmitting}
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

                    {/* Résumé */}
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