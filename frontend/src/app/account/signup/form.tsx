"use client"

import styles from "@/app/styles/page.module.css"
import { IRegisterForm } from "@/interfaces"
import React from "react"
import { useForm } from "react-hook-form"

export default function SignupForm()
{
    const {
        register,
        handleSubmit,
        formState : { errors, isSubmitting, isValid },
        getValues,
    } = useForm<IRegisterForm>({
        mode: 'onChange'
    });

    const onSubmit = (formData: IRegisterForm) => {
        console.log(formData);
    }

    return(
        <section className={`${styles.contactContainer} d-flex justify-content-center`}>
            <div className={`${styles.contactContent} flex-column d-flex w-75`}>
                <div id="errors" className="alert alert-danger d-none" role="alert">
                    
                </div>
                <div className={styles.formSection}>
                    <div className={styles.formHeader}>
                        <h1>Création d'un compte</h1>
                        <p>Le * indique les champs nécessaires</p>
                    </div>
                    <div className="row w-100">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="firstName">* Prenom</label>
                                <input 
                                    id="firstName"
                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                    type="text"
                                    placeholder="Votre Prenom ..."
                                    {...register('firstName', {
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
                                { errors.firstName &&
                                    <div className="invalid-feedback">
                                        {errors.firstName.message}
                                    </div>
                                }
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">* Nom</label>
                                <input 
                                    id="lastName"
                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                    type="text"
                                    placeholder="Votre Nom ..."
                                    {...register('lastName', {
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
                                { errors.lastName &&
                                    <div className="invalid-feedback">
                                        {errors.lastName.message}
                                    </div>
                                }
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">* Email</label>
                                <input 
                                    id="lastName"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    type="email"
                                    placeholder="user@exemple.com"
                                    {...register('email', {
                                        required: 'Le email est requis.',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                                            message: "Le email n'est pas valide."
                                        }
                                    })
                                }
                                />
                                { errors.email &&
                                    <div className="invalid-feedback">
                                        {errors.email.message}
                                    </div>
                                }
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">* Mot de passe</label>
                                <input 
                                    id="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password', {
                                        required: 'Le mot de passe est requis.',
                                        pattern: {
                                            value: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9\s]).{8,}$/,
                                            message: 'Votre mot de passe doit contenir au moins 8 caractères, dont une majuscule/minuscule, un chiffre et un caractère spécial (!@#$%^&*).',
                                        },
                                        minLength: {
                                            value: 8,
                                            message: 'Votre mot de passe doit contenir au moins 8 caractères'
                                        },
                                    })
                                }
                                />
                                { errors.password &&
                                    <div className="invalid-feedback">
                                        {errors.password.message}
                                    </div>
                                }
                            </div>

                            <div className="form-group">
                                <label htmlFor="passwordConfirm">* Confirmer votre mot de passe</label>
                                <input 
                                    id="passwordConfirm"
                                    className={`form-control ${errors.passwordConfirm ? 'is-invalid' : ''}`}
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('passwordConfirm', {
                                        required: 'Veuillez confirmer votre mot de passe.',
                                        validate: (value) => 
                                            value === getValues('password') || 'Les mots de passe ne correspondent pas.'
                                    })
                                }
                                />
                                { errors.passwordConfirm &&
                                    <div className="invalid-feedback">
                                        {errors.passwordConfirm.message}
                                    </div>
                                }
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