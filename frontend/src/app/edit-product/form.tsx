'use client';

import CreatableSelect from "react-select/creatable";
import { EditProductDTO, ImageDTO, ImageFormDTO } from "@/interfaces";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import styles from "@/app/styles/page.module.css"
import { useState, useEffect } from "react";
import { ProductEnumToString } from "@/utility";
import { Aladin } from "next/font/google";

const nextUrl = process.env.NEXT_PUBLIC_API_MIDDLEWARE_URL + "/api/create/";

async function GetProductById(id: string): Promise<EditProductDTO> {
    const res = await fetch(`${nextUrl}product/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur lors du chargement du produit");

    const object = await res.json();
    return object;
}

async function urlToFile(url: string, fileName: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    // Try to keep the right type (image/png, image/jpeg, etc.)
    const file = new File([blob], fileName, { type: blob.type || "image/png" });
    return file;
}

export default function SimpleForm({ id }: { id: string }) {
    const [previews, setPreviews] = useState<Array<{ id: number | null; src: string; file: File | null; fileName: string }>>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [imageErrors, setImageErrors] = useState<string[]>([]);


    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        setImageErrors([]);
        const files = e.target.files ? Array.from(e.target.files) : [];

        const newPreviews = files.map(file => ({
            id: null,
            src: URL.createObjectURL(file),
            file: file,
            fileName: file.name // Store original name
        }));

        setPreviews(prev => [...prev, ...newPreviews]);
    }

    const updateFileName = (index: number, newName: string) => {
        setPreviews(prev => prev.map((preview, i) =>
            i === index ? { ...preview, fileName: newName } : preview
        ));
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === index) return;

        const newPreviews = [...previews];
        const draggedItem = newPreviews[draggedIndex];

        newPreviews.splice(draggedIndex, 1);
        newPreviews.splice(index, 0, draggedItem);

        setPreviews(newPreviews);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const removeImage = (index: number) => {
        setImageErrors([]);

        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const [status, setStatus] = useState<string[]>([]);
    const [categorie, setCategorie] = useState<string[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        fetch(nextUrl + "statues")
            .then(res => {
                if (!res.ok) throw new Error("Erreur de communication avec le middleware");
                return res.json();
            })
            .then((data: string[]) => setStatus(data))
            .catch(err => console.error(err));
        setIsClient(true);
        fetch(nextUrl + "categorie")
            .then(res => {
                if (!res.ok) throw new Error("Erreur de communication avec le middleware");
                return res.json();
            })
            .then((data: string[]) => setCategorie(data))
            .catch(err => console.error(err));
    }, []);

    const [hasDiscount, setHasDiscount] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting, isValid },
        reset,
        setError,
        clearErrors,
        setValue
    } = useForm<EditProductDTO>({
        mode: 'onChange',
        criteriaMode: 'all',
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            discountPrice: null,
            unitsInStock: 0,
            categories: [],
            status: -1,
        }
    });

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const product = await GetProductById(id);

                // Set hasDiscount if there's a discount price
                if (product.discountPrice !== null && product.discountPrice !== undefined) {
                    setHasDiscount(true);
                }

                // Populate the form with fetched data
                setValue("name", product.name);
                setValue("description", product.description);
                setValue("price", product.price);
                setValue("discountPrice", product.discountPrice || null);
                setValue("unitsInStock", product.unitsInStock);
                setValue("categories", product.categories || []);
                setValue("status", product.status);

                if (product.imagesData != null) {

                    const previews = await Promise.all(
                        product.imagesData!.map(async (img, index) => {
                            return {
                                id: img.image!.id,
                                src: img.image!.url,
                                file: null,
                                fileName: img.image!.alt,
                            };
                        })
                    );
                    setPreviews(previews);
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
            }
        };

        fetchProduct();
    }, [id, setValue]);

    const onSubmit: SubmitHandler<EditProductDTO> = async (data) => {
        try {
            clearErrors("root");

            if (!hasDiscount) {
                data.discountPrice = null;
            }

            const formData = new FormData();

            // Append normal fields
            formData.append("ID", id);
            formData.append("Name", data.name);
            formData.append("Description", data.description);
            formData.append("Price", data.price.toLocaleString('fr-FR', { useGrouping: false }));
            formData.append("DiscountPrice", data.discountPrice != null ? data.discountPrice.toLocaleString('fr-FR', { useGrouping: false }) : "");
            formData.append("UnitsInStock", data.unitsInStock.toString());
            data.categories.forEach(c => formData.append("Categories", c));
            formData.append("Status", data.status.toString());

            // Append images
            previews.forEach((preview, i) => {
                if (preview.file != null) {
                    formData.append(`ImagesData[${i}].File`, preview.file);
                    formData.append(`ImagesData[${i}].Image`, "");
                } else {
                    formData.append(`ImagesData[${i}].File`, "");
                    
                    formData.append(`ImagesData[${i}].Image.Id`, preview.id?.toString() || "");
                    formData.append(`ImagesData[${i}].Image.Url`, preview.src || "");
                    formData.append(`ImagesData[${i}].Image.Alt`, preview.fileName || "");
                    formData.append(`ImagesData[${i}].Image.Order`, i.toString());
                }
            });

            const response = await fetch(nextUrl + `edit`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();

                console.error("Backend error:", errorData);

                if (errorData.details?.errors) {
                    Object.keys(errorData.details.errors).forEach((field) => {
                        const fieldErrors = errorData.details.errors[field];
                        setError(field as any, {
                            type: "server",
                            message: Array.isArray(fieldErrors) ? fieldErrors.join(", ") : fieldErrors
                        });
                    });
                    const imgErrors = errorData.details.errors.ImagesData;
                    setImageErrors(Array.isArray(imgErrors) ? imgErrors : [imgErrors]);
                }

                setError("root", {
                    message: errorData.message || "Une erreur s'est produite lors de l'envoi du formulaire."
                });

                return;
            }

            const result = await response.json();
            console.log("Form submitted:", result);

            reset();
            setPreviews([]); // Clear images on successful submit

            // Optional: Show success message
            alert("Produit créé avec succès!");

        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            setError("root", {
                message: "Une erreur réseau s'est produite. Veuillez réessayer.",
            });
        }
    };

    return (
        <section className={`${styles.contactContainer} d-flex justify-content-center`}>
            <div className={`${styles.contactContent} d-flex justify-content-center w-75`}>
                <div className={styles.formSection}>
                    <div className={styles.formHeader}>
                        <h1>Formulaire d'ajout d'un nouvelle objet</h1>
                        <p>Le * indique les champs nécessaires</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className={`row p-3`}>
                        {/* nom */}
                        <div className={` row mb-4`}>
                            <label htmlFor="Name" className={`d-flex col-md-2 col-lg-2 align-items-center`}>Nom *</label>
                            <input
                                id="Name"
                                type="text"
                                placeholder="Entrez le nom du produit"
                                className="d-flex col-12 col-md-10 col-lg-10 rounded-2 border-1"
                                {...register("name", {
                                    required: "Un nom est requis",
                                    minLength: { value: 2, message: "Le nom doit contenir au moins 2 caractères" },
                                })}
                            />
                            {errors.name && <div style={{ color: "red" }}>{errors.name.message}</div>}
                            <br /><br />
                        </div>

                        {/* description */}
                        <div className="row mb-4">
                            <label htmlFor="Description" className="d-flex align-items-center col-12 mb-2">Description *</label>

                            <textarea
                                className="form-control w-100 col-12"
                                id="Description"
                                {...register("description", {
                                    required: "Une description est requise",
                                    minLength: {
                                        value: 5,
                                        message: "La description doit contenir au moins 5 caractères",
                                    },
                                    maxLength: {
                                        value: 1000,
                                        message: "La description ne doit pas dépasser 1000 caractères",
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
                        <div className="row mb-4">
                            <label htmlFor="Price" className="d-flex col-12 col-md-2 col-lg-2 align-items-center">
                                Prix *
                            </label>

                            <div className="col-12 col-md-10 col-lg-10">
                                <div className="input-group">
                                    <input
                                        id="Price"
                                        type="number"
                                        placeholder="Entrez le prix du produit"
                                        className="form-control"
                                        min={0}
                                        step="0.01"
                                        {...register("price", {
                                            required: "Un prix est requis",
                                            valueAsNumber: true,
                                            validate: async (value) => {
                                                await new Promise((r) => setTimeout(r, 100));

                                                if (value === null || value === undefined)
                                                    return "Le prix est requis.";
                                                if (isNaN(value))
                                                    return "La valeur doit être un nombre.";
                                                if (value < 0)
                                                    return "Le prix ne peut pas être négatif.";

                                                // Vérifie qu’il y a au plus 2 décimales
                                                const decimalPart = value.toString().split(".")[1];
                                                if (decimalPart && decimalPart.length > 2)
                                                    return "Le prix ne peut pas avoir plus de 2 décimales.";

                                                return true;
                                            },
                                        })}
                                    />
                                    <span className="input-group-text">$</span>
                                </div>

                                {errors.price && (
                                    <div style={{ color: "red" }}>{errors.price.message}</div>
                                )}
                            </div>
                        </div>


                        {/* Prix rabais */}
                        <div className="row mb-4 align-items-center">
                            <label className="col-12 col-md-2 col-lg-2 mb-2 mb-md-0 d-flex align-items-center">
                                Rabais
                            </label>

                            {/* Checkbox */}
                            <div className="col-12 col-md-2 d-flex align-items-center mb-2 mb-md-0">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="hasDiscount"
                                        checked={hasDiscount}
                                        onChange={(e) => setHasDiscount(e.target.checked)}
                                    />
                                    <label className="form-check-label ms-1" htmlFor="hasDiscount">
                                        Activer
                                    </label>
                                </div>
                            </div>

                            {/* Discount input */}
                            <div className="col-12 col-md-8">
                                <div className="input-group">
                                    <input
                                        id="DiscountPrice"
                                        type="number"
                                        placeholder="Entrez le prix du produit en rabais"
                                        className="form-control"
                                        min={0}
                                        step="0.01"
                                        {...register("discountPrice", {
                                            valueAsNumber: true,
                                            required: false,
                                            validate: async (value, formValues) => {
                                                // Allow empty value if the discount is not enabled
                                                if (!hasDiscount) return true;
                                                await new Promise((r) => setTimeout(r, 100));

                                                if (value === null || value === undefined)
                                                    return "Le prix en rabais est requis si le rabais est activé.";
                                                if (isNaN(value)) return "La valeur doit être un nombre.";
                                                if (value < 0) return "Le prix en rabais ne peut pas être négatif.";

                                                // Check that there are at most 2 decimal digits
                                                const decimalPart = value.toString().split(".")[1];
                                                if (decimalPart && decimalPart.length > 2)
                                                    return "Le prix en rabais ne peut pas avoir plus de 2 décimales.";

                                                const regularPrice = formValues.price;
                                                if (regularPrice !== undefined && value >= regularPrice)
                                                    return "Le prix en rabais doit être inférieur au prix régulier.";
                                                return true;
                                            },
                                        })}
                                        disabled={!hasDiscount}
                                    />
                                    <span className="input-group-text">$</span>
                                </div>

                                {errors.discountPrice && (
                                    <div style={{ color: "red" }}>{errors.discountPrice.message}</div>
                                )}
                            </div>
                        </div>


                        {/* stock */}
                        <div className={` row mb-4`}>
                            <label htmlFor="UnitsInStock" className={`d-flex col-12 col-md-2 col-lg-2 align-items-center`}>unité en stock</label>
                            <div className="col-12 col-md-10 col-lg-10">
                                <div className="input-group">
                                    <input
                                        id="UnitsInStock"
                                        type="number"
                                        placeholder="Entrez le nombre d'unités en stock"
                                        className="form-control"
                                        min={0}
                                        step="1"
                                        {...register("unitsInStock", {
                                            required: "Le nombre d'unités en stock est nécessaire.",
                                            valueAsNumber: true,
                                            validate: async (value) => {
                                                // Simulate async check (e.g. could be a backend call)
                                                await new Promise((r) => setTimeout(r, 100));

                                                if (isNaN(value)) return "La valeur doit être un nombre.";
                                                if (value < 0) return "Le nombre d'unités ne peut pas être négatif.";
                                                if (!Number.isInteger(value)) return "Le nombre d'unités doit être un entier.";
                                                return true;
                                            },
                                        })}
                                    />
                                </div>

                                {errors.unitsInStock && (
                                    <div style={{ color: "red" }}>{errors.unitsInStock.message}</div>
                                )}
                            </div>

                            <br /><br />
                        </div>

                        {/* Categories et Status */}
                        <div className="row mb-4 align-items-start">
                            <label className="col-12 col-md-2 col-lg-2 mb-2 mb-md-0 d-flex align-items-center">
                                Options
                            </label>

                            <div className="col-12 col-md-10 col-lg-10">
                                <div className="row g-3">
                                    {/* Category dropdown */}
                                    <div className="col-12 col-md-6">
                                        {isClient && (
                                            <Controller
                                                name="categories"
                                                control={control}
                                                rules={{ required: "Sélectionnez au moins une catégorie" }}
                                                render={({ field }) => (
                                                    <CreatableSelect
                                                        {...field}
                                                        isMulti
                                                        placeholder="Sélectionnez les catégories..."
                                                        options={categorie.map((s) => ({
                                                            value: s,
                                                            label: s,
                                                        }))}
                                                        value={
                                                            field.value
                                                                ? field.value.map((val: string) => ({
                                                                    value: val,
                                                                    label: val,
                                                                }))
                                                                : []
                                                        }
                                                        onChange={(selectedOptions) => {
                                                            field.onChange(selectedOptions.map((opt: any) => opt.value));
                                                        }}
                                                        onCreateOption={(inputValue) => {
                                                            field.onChange([...(field.value || []), inputValue]);
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}

                                        {errors.categories && (
                                            <div style={{ color: "red", fontSize: "0.9em" }}>
                                                {errors.categories.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status dropdown */}
                                    <div className="col-12 col-md-6">
                                        <select
                                            className="form-select"
                                            {...register("status", {
                                                required: "Sélectionnez un statut",
                                                valueAsNumber: true,
                                                validate: (v) => v >= 0 || "Veuillez sélectionner un statut",
                                            })}
                                        >
                                            <option key={-1} value={-1}>-- Sélectionnez un statut --</option>
                                            {status.map((s, i) => (
                                                <option key={i} value={i}>{ProductEnumToString(i)}</option>
                                            ))}
                                        </select>

                                        {errors.status && (
                                            <div style={{ color: "red", fontSize: "0.9em" }}>
                                                {errors.status.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Images Section */}
                        <div className="mb-3">
                            <label htmlFor="images" className="form-label">Images du produit</label>
                            <input
                                id="images"
                                type="file"
                                accept="image/*"
                                multiple
                                className="form-control"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="d-flex flex-wrap gap-2 mt-3">
                            {previews.map((preview, i) => (
                                <div key={i} className="d-flex flex-column" style={{ width: '140px' }}>
                                    {/* Image container */}
                                    <div
                                        draggable
                                        onDragStart={() => handleDragStart(i)}
                                        onDragOver={(e) => handleDragOver(e, i)}
                                        onDragEnd={handleDragEnd}
                                        className="position-relative mb-2"
                                        style={{
                                            cursor: 'move',
                                            opacity: draggedIndex === i ? 0.5 : 1,
                                            transition: 'opacity 0.2s'
                                        }}
                                    >
                                        <img
                                            src={preview.src}
                                            alt={`Image ${i + 1}`}
                                            width={120}
                                            height={120}
                                            style={{
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                border: '2px solid #dee2e6'
                                            }}
                                        />

                                        {/* Order badge */}
                                        <span
                                            className="position-absolute top-0 start-0 badge bg-primary m-1"
                                            style={{ fontSize: '0.75rem' }}
                                        >
                                            {i + 1}
                                        </span>

                                        {/* Remove button */}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="position-absolute top-0 end-0 btn btn-danger btn-sm m-1"
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                padding: '0',
                                                fontSize: '18px',
                                                lineHeight: '1',
                                                borderRadius: '50%'
                                            }}
                                            title="Supprimer l'image"
                                        >
                                            x
                                        </button>
                                    </div>

                                    {/* Editable file name */}
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={preview.fileName}
                                        onChange={(e) => updateFileName(i, e.target.value)}
                                        placeholder="Nom du fichier"
                                        style={{ fontSize: '0.75rem' }}
                                        title="Modifier le nom du fichier"
                                    />
                                </div>
                            ))}
                        </div>

                        {imageErrors.length > 0 && (
                            <div style={{ color: "red", fontSize: "0.9em" }}>
                                {imageErrors.map((error, idx) => (
                                    <div key={idx}>{error}</div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || !isValid}
                            style={{
                                backgroundColor: !isValid ? '#cf7993ff' : '#B9375D',
                                color: 'white',
                                cursor: !isValid ? 'not-allowed' : 'pointer',
                                padding: '8px 16px',
                                marginTop: '20px'
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