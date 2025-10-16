'use client';

import { CreateProductDTO } from "@/interfaces";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "@/app/styles/page.module.css"

const nextUrl = process.env.NEXT_PUBLIC_API_MIDDLEWARE_URL;

export default function SimpleForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset,
        setError,
        clearErrors
    } = useForm<CreateProductDTO>({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const onSubmit: SubmitHandler<CreateProductDTO> = async (data) => {
        try {
            clearErrors("root");
            
            const response = await fetch(nextUrl + `/api/admin/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error('Incapable de communiquer avec le middleware');
            }

            const result = await response.json();
            console.log("Form submitted:", result);
            
            reset();
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            setError("root", {
                message: "Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer.",
            });
        }
    };

    return (
        <section className={`${styles.contactContainer} d-flex justify-content-center`}>
            <div className={`d-flex justify-content-center w-75`}>
                <div className={styles.formSection}>
                    <div className={styles.formHeader}>
                        <h1>Formulaire d'ajout d'un nouvelle objet</h1>
                        <p>Le * indique les champs nécessaires</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className={`row p-3`}>
                        {/* nom */}
                        <div className={` row mb-4`}>
                            <label htmlFor="nom" className={`d-flex col-md-2 col-lg-2 align-items-center`}>Nom *</label>
                            <input className={`d-flex col-12 col-md-10 col-lg-10`}
                                id="nom"
                                {...register("nom", {
                                    required: "Un nom est requis",
                                    minLength: { value: 2, message: "le doit doit contenir au moins 2 caractères" },
                                })}
                                type="text"
                                placeholder="Enter le nom du produit"
                            />
                            {errors.nom && <div style={{ color: "red" }}>{errors.nom.message}</div>}

                            <br /><br />
                        </div>

                        {/* description */}
                        <div className="row mb-4">
                            <label htmlFor="description" className="d-flex align-items-center col-12 mb-2">Description *</label>

                            <textarea
                                className="form-control w-100 col-12"
                                id="description"
                                {...register("description", {
                                    required: "Une description est requise",
                                    minLength: {
                                        value: 5,
                                        message: "La description doit contenir au moins 5 caractères",
                                    },
                                    maxLength: {
                                        value: 500,
                                        message: "La description ne doit pas dépasser 500 caractères",
                                    },
                                })}
                                placeholder="Entrez une description"
                                rows={5}
                            />

                            <div className="col-12 mt-2">
                                {errors.description && (
                                    <p style={{ color: "red", fontSize: "0.9em" }}>
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                        </div>


                        {/* prix */}
                        <div className={` row mb-4`}>
                            <label htmlFor="prix" className={`d-flex col-12 col-md-2 col-lg-2 align-items-center`}>Prix *</label>
                            <div className="col-12 col-md-10 col-lg-10">
                                <div className="input-group">
                                    <input
                                        id="prix"
                                        type="number"
                                        placeholder="Enter le prix du produit"
                                        className="form-control"
                                        min={0}
                                        step="0.01"
                                        {...register("prix", {
                                            required: "Un prix est requis",
                                        })}
                                    />
                                    <span className="input-group-text">$</span>
                                </div>
                                {errors.prix && <div style={{ color: "red" }}>{errors.prix.message}</div>}
                            </div>
                            <br /><br />
                        </div>


                        <button
                            type="submit"
                            disabled={isSubmitting || !isValid}
                            style={{
                                backgroundColor: !isValid ? '#ccc' : '#007bff',
                                color: 'white',
                                cursor: !isValid ? 'not-allowed' : 'pointer',
                                padding: '8px 16px',
                            }}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>

                        {errors.root && <div style={{ color: "red" }}>{errors.root.message}</div>}
                    </form>
                </div>
            </div>
        </section >
    );
}
