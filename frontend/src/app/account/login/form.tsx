'use client'
import { ILoginForm } from "@/interfaces";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "@/app/styles/page.module.css"

export default function LoginForm() {
    const router = useRouter();
    const [Errors, setErrors] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<ILoginForm>({
        mode: "onChange",
    });

    const onSubmit = async (formData: ILoginForm) => {
        const url = '/api/account/login/';
        setErrors([]);
        const backendResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (backendResponse.ok) {
            router.push("/home");
        } else {
            const errorData = await backendResponse.json();
            if (errorData.Errors) {
                let errorMessages: string[] = errorData.Errors;
                setErrors(errorMessages);
            }
        }
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
                        <h1>Se connecter</h1>
                    </div>
                    <div className="row w-100">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group mb-2">
                                <label htmlFor="Email">Email</label>
                                <input
                                    id="Email"
                                    className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                                    type="text"
                                    placeholder="user@exemple.com"
                                    {...register("Email", {
                                        required: "Le email est requis."
                                    })}
                                />
                                {errors.Email && (
                                    <div className="invalid-feedback">{errors.Email.message}</div>
                                )}
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="Password">Mot de passe (optionnel)</label>
                                <input
                                    id="Password"
                                    className={`form-control ${errors.Password ? "is-invalid" : ""}`}
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("Password", {
                                        required: "Le mot de passe est requis."
                                    })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !isValid}
                                style={{
                                    backgroundColor: !isValid ? "#cf7993ff" : "#B9375D",
                                    color: "white",
                                    cursor: !isValid ? "not-allowed" : "pointer",
                                    padding: "8px 16px",
                                    marginTop: "50px",
                                    width: "100%",
                                }}
                            >
                                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
                            </button>
                        </form>
                        <a className={`${styles.link} mt-3 text-center`} href="/account/signup">Vous n'avez pas de compte ? Créer en un ici.</a>
                    </div>
                </div>
            </div>
        </section>
    )
}