"use client"

import styles from "@/app/styles/page.module.css"
import { IRegisterForm, IRegisterFormResponse } from "@/interfaces"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";


export default function SignupForm()
{
    const router = useRouter();
    const [Errors, setErrors] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState : { errors, isSubmitting, isValid },
        getValues,
        setValue,
    } = useForm<IRegisterForm>({
        mode: 'onChange'
    });

    // Fonction pour formater automatiquement le numéro de téléphone
    const formatPhoneNumber = (value: string) => {
        // Enlever tous les caractères non-numériques
        const numbers = value.replace(/\D/g, '');
        
        // Limiter à 10 chiffres
        const limited = numbers.slice(0, 10);
        
        // Ajouter les tirets automatiquement
        if (limited.length <= 3) {
            return limited;
        } else if (limited.length <= 6) {
            return `${limited.slice(0, 3)}-${limited.slice(3)}`;
        } else {
            return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setValue('PhoneNumber', formatted, { shouldValidate: true });
    };

    const onSubmit = async (formData: IRegisterForm) => {
        const url = '/api/account/signup/create/'; 
        setErrors([]);
        const backendResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), 
        });

        if (backendResponse.ok) {
            router.push(`/account/address`);
        } else {
            const errorData = await backendResponse.json();
            if (errorData.Errors)
            {
                let errorMessages : string[] = errorData.Errors;
                setErrors(errorMessages);
            }
            console.error('Registration Failed (Server Error):', errorData);
        }
    };

    return(
        <section className={`${styles.contactContainer} d-flex justify-content-center`}>
            <div className={`${styles.contactContent} flex-column d-flex w-75`}>
                <div id="errors" className={`alert alert-danger ${Errors.length == 0 ? "d-none" : ""}`} role="alert">
                    {Errors.map((e, i) => (
                        <p className="m-0" key={i}>{e}</p>
                    ))}
                </div>
                <div className={styles.formSection}>
                    <div className={styles.formHeader}>
                        <h1>Création d'un compte</h1>
                    </div>
                    <div className="row w-100">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group mb-2">
                                <label htmlFor="firstName">Prenom</label>
                                <input 
                                    id="firstName"
                                    className={`form-control ${errors.FirstName ? 'is-invalid' : ''}`}
                                    type="text"
                                    placeholder="Votre Prenom ..."
                                    {...register('FirstName', {
                                        required: 'Le prenom est requis.',
                                        minLength: {
                                            value: 2,
                                            message: 'Le prenom doit au moins 2 caractères'
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z\u00C0-\u017F]+(?:[ '-][a-zA-Z\u00C0-\u017F]+)*$/,
                                            message: "Le format est invalide"
                                        }
                                    })
                                }
                                />
                                { errors.FirstName &&
                                    <div className="invalid-feedback">
                                        {errors.FirstName.message}
                                    </div>
                                }
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="lastName">Nom</label>
                                <input 
                                    id="lastName"
                                    className={`form-control ${errors.LastName ? 'is-invalid' : ''}`}
                                    type="text"
                                    placeholder="Votre Nom ..."
                                    {...register('LastName', {
                                        required: 'Le nom est requis.',
                                        minLength: {
                                            value: 2,
                                            message: 'Le nom doit au moins 2 caractères'
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z\u00C0-\u017F]+(?:[ '-][a-zA-Z\u00C0-\u017F]+)*$/,
                                            message: "Le format est invalide"
                                        }
                                    })
                                }
                                />
                                { errors.LastName &&
                                    <div className="invalid-feedback">
                                        {errors.LastName.message}
                                    </div>
                                }
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="email">Email</label>
                                <input 
                                    id="email"
                                    className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                                    type="email"
                                    placeholder="user@exemple.com"
                                    {...register('Email', {
                                        required: 'Le email est requis.',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                                            message: "Le email n'est pas valide."
                                        }
                                    })
                                }
                                />
                                { errors.Email &&
                                    <div className="invalid-feedback">
                                        {errors.Email.message}
                                    </div>
                                }
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="password">Mot de passe</label>
                                <input 
                                    id="password"
                                    className={`form-control ${errors.Password ? 'is-invalid' : ''}`}
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('Password', {
                                        required: 'Le mot de passe est requis.',
                                        minLength: {
                                            value: 8,
                                            message: 'Votre mot de passe doit contenir au moins 8 caractères'
                                        },
                                        validate: {
                                            hasUpperCase: (value) => 
                                                /[A-Z]/.test(value) || 'Le mot de passe doit contenir au moins une majuscule.',
                                            hasLowerCase: (value) => 
                                                /[a-z]/.test(value) || 'Le mot de passe doit contenir au moins une minuscule.',
                                            hasNumber: (value) => 
                                                /[0-9]/.test(value) || 'Le mot de passe doit contenir au moins un chiffre.',
                                            hasSpecialChar: (value) => 
                                                /[^a-zA-Z0-9\s]/.test(value) || 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*).',
                                        }
                                    })
                                }
                                />
                                { errors.Password &&
                                    <div className="invalid-feedback">
                                        {errors.Password.message}
                                    </div>
                                }
                                <small className="form-text text-muted">
                                    Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.
                                </small>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="passwordConfirm">Confirmer votre mot de passe</label>
                                <input 
                                    id="passwordConfirm"
                                    className={`form-control ${errors.PasswordConfirm ? 'is-invalid' : ''}`}
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('PasswordConfirm', {
                                        required: 'Veuillez confirmer votre mot de passe.',
                                        validate: (value) => 
                                            value === getValues('Password') || 'Les mots de passe ne correspondent pas.'
                                    })
                                }
                                />
                                { errors.PasswordConfirm &&
                                    <div className="invalid-feedback">
                                        {errors.PasswordConfirm.message}
                                    </div>
                                }
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="phoneNumber">Numéro de téléphone</label>
                                <input 
                                    id="phoneNumber"
                                    className={`form-control ${errors.PhoneNumber ? 'is-invalid' : ''}`}
                                    type="text"
                                    placeholder="000-000-0000"
                                    {...register('PhoneNumber', {
                                        required: 'Veuillez entrer votre numéro de téléphone.',
                                        pattern: {
                                            value: /^\d{3}-\d{3}-\d{4}$/,
                                            message: 'Votre numéro de téléphone doit avoir le format valide suivant: 000-000-0000',
                                        },
                                        onChange: handlePhoneChange
                                    })
                                }
                                />
                                { errors.PhoneNumber &&
                                    <div className="invalid-feedback">
                                        {errors.PhoneNumber.message}
                                    </div>
                                }
                                <small className="form-text text-muted">
                                    Entrez simplement les 10 chiffres, les tirets seront ajoutés automatiquement.
                                </small>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !isValid}
                                style={{
                                    backgroundColor: !isValid ? '#cf7993ff' : '#B9375D',
                                    color: 'white',
                                    cursor: !isValid ? 'not-allowed' : 'pointer',
                                    padding: '8px 16px',
                                    marginTop: '20px',
                                    width: '100%'
                                }}
                                >
                                {isSubmitting ? "Création en cours..." : "Continuer"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}