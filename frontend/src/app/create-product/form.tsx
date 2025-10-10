'use client';

import styles from "../styles/page.module.css"
import { useForm, SubmitHandler } from "react-hook-form";

type FormFields = {
    nom: string;
    description: string;
    prix: Float64Array;
};

export default function SimpleForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset,
        setError,
        clearErrors
    } = useForm<FormFields>({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            clearErrors("root");
            await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate async delay

            console.log("Form submitted:", data);
            alert(`Nom: ${data.nom}\nDescription: ${data.description}`);

            reset();
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            setError("root", {
                message: "Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer.",
            });
        }
    };

    return (
        <section className={styles.contactContainer}>
            <div className={`d-flex justify-content-center`}>
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
                        <div className={`row mb-4`}>
                            <label htmlFor="description" className={` d-flex align-items-center align-content-center col-12`}>Description *</label>
                            <br /><br />
                            <textarea className={`d-flex col-12`}
                                id="description"
                                {...register("description", {
                                    required: "Une description est requise",
                                    minLength: { value: 5, message: "La description doit contenir au moins 5 caractères" },
                                    maxLength: { value: 500, message: "la description ne doit pas dépasser 500 caractères" }
                                })}
                                placeholder="Entrez une description"
                                rows={5}
                            />
                            {errors.description && (
                                <div style={{ color: "red" }}>{errors.description.message}</div>
                            )}

                            <br /><br />
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
