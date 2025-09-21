'use client'

import styles from "../styles/page.module.css"
import { SubmitHandler, useForm } from "react-hook-form"

export default function ContactForm() {

    type FormFields = {
        email: string;
        nom: string;
        prenom: string;
        sujet: string;
        message: string;
    };

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        reset,
        formState: { errors, isSubmitting, isValid, dirtyFields },
    } = useForm<FormFields>({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            clearErrors("root");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            console.log('Formulaire soumis avec succès:', data);
            reset();

        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            setError("root", {
                message: "Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer.",
            });
        }
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            return "Veuillez entrer une adresse courriel valide";
        }
        return true;
    };

    return (
        <section className={styles.contactContainer}>
            <div className={styles.contactContent}>
                <div className={styles.infoSection}>
                    <div className={styles.infoBlock}>
                        <h2>Nos Coordonnées</h2>
                        <p>Shangxin Supermarket, Chine, CN <br />重庆市 南岸区 揽湖路 1 1 号附37号 邮政编码: 400069</p>
                        <p>bottesetjambes@gmail.com</p>
                        <p>450-123-4567</p>
                        <p className={styles.humorText}>
                            Essayez pas d'appeler on répond pas
                        </p>
                    </div>

                    <div className={styles.infoBlock}>
                        <h2>Nos heures d'ouverture</h2>
                        <p>Seulement en ligne pour le moment</p>
                        <p className={styles.humorText}>
                            Le vendredi, samedi, dimanche, lundi et le mardi on est fermé.
                            Commandez le vendredi, vous serez dans les premiers pour les commandes du jeudi!
                        </p>
                    </div>
                </div>
                <div className={styles.formSection}>
                    <div className={styles.formHeader}>
                        <h1>Formulaire pour nous rejoindre</h1>
                        <p>Le * indique les champs nécessaires</p>
                    </div>

                    <form className={styles.contactFrom} onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <label htmlFor="prenom">Prénom *</label>
                            <input
                                id="prenom"
                                {...register("prenom", {
                                    required: "Un prénom est requis",
                                    minLength: {
                                        value: 2,
                                        message: "Le prénom doit contenir au moins 2 caractères"
                                    },
                                    pattern: {
                                        value: /^[a-zA-ZÀ-ÿ\s'-]+$/,
                                        message: "Le prénom ne peut contenir que des lettres"
                                    }
                                })}
                                type="text"
                                placeholder="Votre prénom"
                                className={errors.prenom ? 'error-field' : ''}
                            />
                            {errors.prenom && <div className={styles.errorMessage}>{errors.prenom.message}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="nom">Nom *</label>
                            <input
                                id="nom"
                                {...register("nom", {
                                    required: "Un nom est requis",
                                    minLength: {
                                        value: 2,
                                        message: "Le nom doit contenir au moins 2 caractères"
                                    },
                                    pattern: {
                                        value: /^[a-zA-ZÀ-ÿ\s'-]+$/,
                                        message: "Le nom ne peut contenir que des lettres"
                                    }
                                })}
                                type="text"
                                placeholder="Votre nom"
                                className={errors.nom ? 'error-field' : ''}
                            />
                            {errors.nom && <div className={styles.errorMessage}>{errors.nom.message}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Courriel *</label>
                            <input
                                id="email"
                                {...register("email", {
                                    required: "Un courriel est requis",
                                    validate: validateEmail
                                })}
                                type="email"
                                placeholder="votre@courriel.com"
                                className={errors.email ? 'error-field' : ''}
                            />
                            {errors.email && <div className={styles.errorMessage}>{errors.email.message}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="sujet">Sujet *</label>
                            <input
                                id="sujet"
                                {...register("sujet", {
                                    required: "Un sujet est requis",
                                    minLength: {
                                        value: 5,
                                        message: "Le sujet doit contenir au moins 5 caractères"
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "Le sujet ne peut pas dépasser 100 caractères"
                                    }
                                })}
                                type="text"
                                placeholder="Votre sujet"
                                className={errors.sujet ? 'error-field' : ''}
                            />
                            {errors.sujet && <div className={styles.errorMessage}>{errors.sujet.message}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">Message *</label>
                            <textarea
                                id="message"
                                {...register("message", {
                                    required: "Un message est requis",
                                    minLength: {
                                        value: 10,
                                        message: "Le message doit contenir au moins 10 caractères"
                                    },
                                    maxLength: {
                                        value: 1000,
                                        message: "Le message ne peut pas dépasser 1000 caractères"
                                    }
                                })}
                                placeholder="Votre message"
                                rows={4}
                                className={errors.message ? 'error-field' : ''}
                            />
                            {errors.message && <div className={styles.errorMessage}>{errors.message.message}</div>}
                        </div>

                        <button
                            disabled={isSubmitting || !isValid}
                            type="submit"
                            className={`${styles.submitButton} ${(!isValid || isSubmitting) ? styles.disabled : ''} ${isSubmitting ? styles.loading : ''}`}
                        >
                            {isSubmitting ? "En attente de Poste Canada..." : "Soumettre"}
                        </button>

                        {errors.root && <div className={styles.errorMessage}>{errors.root.message}</div>}
                    </form>
                </div>
            </div>
        </section >
    );
};