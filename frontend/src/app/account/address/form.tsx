"use client";

import styles from "@/app/styles/page.module.css";
import { IAddress } from "@/interfaces"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddressForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [Errors, setErrors] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<IAddress>({
        mode: "onChange",
    });

    const handleRedirectAfterSuccess = () => {
        // Vérifier sessionStorage en premier (depuis checkout)
        const sessionRedirect = sessionStorage.getItem('redirectAfterLogin');
        if (sessionRedirect) {
            sessionStorage.removeItem('redirectAfterLogin');
            router.push(sessionRedirect);
            return;
        }
        
        // Vérifier les paramètres d'URL
        const redirectParam = searchParams.get('redirect');
        if (redirectParam) {
            router.push(redirectParam);
            return;
        }
        
        // Redirection par défaut
        router.push("/home");
    };

    const onSubmit = async (formData: IAddress) => {
        const url = '/api/account/signup/add-address/';
        setErrors([]);
        const backendResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (backendResponse.ok) {
            const data = await backendResponse.json();
            console.log("Address Added Successfully", data);
            handleRedirectAfterSuccess();
        } else {
            const errorData = await backendResponse.json();
            if (errorData.Errors) {
                let errorMessages: string[] = errorData.Errors;
                setErrors(errorMessages);
            }

            console.error("Address Failed (Server Error):", errorData);
        }
    };

    const handleSkip = () => {
        handleRedirectAfterSuccess();
    };

    return (
        <section className={`${styles.contactContainer} d-flex justify-content-center`}>
            <div className={`${styles.contactContent} flex-column d-flex w-75`}>

                <div id="errors" className={`alert alert-danger ${Errors.length === 0 ? "d-none" : ""}`} role="alert">
                    {Errors.map((e, i) => (
                        <p className="m-0" key={i}>{e}</p>
                    ))}
                </div>
                <div className={styles.formSection}>
                    <div className={styles.formHeader}>
                        <h1>Adresse du compte</h1>
                        <p style={{ fontSize: "1rem", color: "#555", marginTop: "5px" }}>
                            Indiquez votre adresse afin que nous puissions livrer vos achats.
                        </p>
                    </div>
                    <div className="row w-100">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group mb-2">
                                <label htmlFor="streetNumber">Numéro civique</label>
                                <input
                                    id="streetNumber"
                                    className={`form-control ${errors.StreetNumber ? "is-invalid" : ""}`}
                                    type="number"
                                    placeholder="123"
                                    {...register("StreetNumber", {
                                        required: "Le numéro civique est requis.",
                                        min: { value: 1, message: "Numéro invalide." },
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: "Le numéro civique doit contenir uniquement des chiffres."
                                        }
                                    })}
                                />
                                {errors.StreetNumber && (
                                    <div className="invalid-feedback">{errors.StreetNumber.message}</div>
                                )}
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="appartementNumber">Appartement (optionnel)</label>
                                <input
                                    id="appartementNumber"
                                    className={`form-control ${errors.AppartementNumber ? "is-invalid" : ""}`}
                                    type="text"
                                    placeholder="Ex: 4B"
                                    {...register("AppartementNumber")}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="streetName">Nom de rue</label>
                                <input
                                    id="streetName"
                                    className={`form-control ${errors.StreetName ? "is-invalid" : ""}`}
                                    type="text"
                                    placeholder="Rue Principale"
                                    {...register("StreetName", {
                                        required: "Le nom de rue est requis.",
                                        minLength: {
                                            value: 2,
                                            message: "Le nom doit contenir au moins 2 caractères.",
                                        },
                                        pattern: {
                                            value: /^[A-Za-zÀ-ÿ0-9 .'-]+$/,
                                            message: "Nom de rue invalide.",
                                        },
                                    })}
                                />
                                {errors.StreetName && (
                                    <div className="invalid-feedback">{errors.StreetName.message}</div>
                                )}
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="city">Ville</label>
                                <input
                                    id="city"
                                    className={`form-control ${errors.City ? "is-invalid" : ""}`}
                                    type="text"
                                    placeholder="Ville"
                                    {...register("City", {
                                        required: "La ville est requise.",
                                        pattern: {
                                            value: /^[A-Za-zÀ-ÿ .'-]+$/,
                                            message: "Nom de ville invalide.",
                                        },
                                    })}
                                />
                                {errors.City && (
                                    <div className="invalid-feedback">{errors.City.message}</div>
                                )}
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="stateProvince">Province / État</label>
                                <input
                                    id="stateProvince"
                                    className={`form-control ${errors.StateProvince ? "is-invalid" : ""}`}
                                    type="text"
                                    placeholder="QC, ON, etc."
                                    {...register("StateProvince", {
                                        required: "La province est requise.",
                                        pattern: {
                                            value: /^[A-Za-zÀ-ÿ .'-]+$/,
                                            message: "Format invalide.",
                                        },
                                    })}
                                />
                                {errors.StateProvince && (
                                    <div className="invalid-feedback">{errors.StateProvince.message}</div>
                                )}
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="country">Pays</label>
                                <input
                                    id="country"
                                    className={`form-control ${errors.Country ? "is-invalid" : ""}`}
                                    type="text"
                                    placeholder="Canada"
                                    {...register("Country", {
                                        required: "Le pays est requis.",
                                        pattern: {
                                            value: /^[A-Za-zÀ-ÿ .'-]+$/,
                                            message: "Nom de pays invalide.",
                                        },

                                    })}
                                />
                                {errors.Country && (
                                    <div className="invalid-feedback">{errors.Country.message}</div>
                                )}
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="postal">Code Postal</label>
                                <input
                                    id="postal"
                                    className={`form-control ${errors.PostalCode ? "is-invalid" : ""}`}
                                    type="text"
                                    placeholder="H1A 2B3"
                                    {...register("PostalCode", {
                                        required: "Le code postal est requis.",
                                        pattern: {
                                            value: /^[A-Za-z][0-9][A-Za-z][ -]?[0-9][A-Za-z][0-9]$/,
                                            message: "Format du code postal invalide.",
                                        },
                                    })}
                                />
                                {errors.PostalCode && (
                                    <div className="invalid-feedback">{errors.PostalCode.message}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !isValid}
                                style={{
                                    backgroundColor: !isValid ? "#cf7993ff" : "#B9375D",
                                    color: "white",
                                    cursor: !isValid ? "not-allowed" : "pointer",
                                    padding: "8px 16px",
                                    marginTop: "20px",
                                    width: "100%",
                                }}
                            >
                                {isSubmitting ? "Enregistrement..." : "Sauvegarder l'adresse"}
                            </button>

                            <button
                                type="button"
                                onClick={handleSkip}
                                style={{
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    padding: "8px 16px",
                                    marginTop: "10px",
                                    width: "100%",
                                    cursor: "pointer",
                                }}
                            >
                                Passer pour le moment
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}