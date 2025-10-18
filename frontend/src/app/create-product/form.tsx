'use client';

import CreatableSelect from "react-select/creatable";
import { CreateProductDTO } from "@/interfaces";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import styles from "@/app/styles/page.module.css"
import { useState, useEffect } from "react";

const nextUrl = process.env.NEXT_PUBLIC_API_MIDDLEWARE_URL + "/api/create/";


export default function SimpleForm() {
    const [previews, setPreviews] = useState<Array<{ src: string; file: File; fileName: string }>>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files ? Array.from(e.target.files) : [];

        const newPreviews = files.map(file => ({
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
        clearErrors
    } = useForm<CreateProductDTO>({
        mode: 'onChange',
        criteriaMode: 'all',
        defaultValues: {
            Categories: []  // empty array for multi-select
        }
    });

    const onSubmit: SubmitHandler<CreateProductDTO> = async (data) => {
        try {
            clearErrors("root");

            if (!hasDiscount) {
                data.DiscountPrice = null;
            }

            const formData = new FormData();

            // Append normal fields
            formData.append("Name", data.Name);
            formData.append("Description", data.Description);
            formData.append("Price", data.Price.toString());
            formData.append("DiscountPrice", data.DiscountPrice != null ? data.DiscountPrice.toString() : "");
            formData.append("UnitsInStock", data.UnitsInStock.toString());
            data.Categories.forEach(c => formData.append("Categories", c));
            formData.append("Status", data.Status.toString());

            // Append images
            previews.forEach((preview) => {
                const renamedFile = new File([preview.file], preview.fileName, {
                    type: preview.file.type,
                    lastModified: preview.file.lastModified,
                });
                formData.append("ImagesData", renamedFile);
            });

            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }
            const response = await fetch(nextUrl + `create`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const result = await response.json();
            console.log("Form submitted:", result);

            reset();
            setPreviews([]); // Clear images on successful submit
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
                            <label htmlFor="Name" className={`d-flex col-md-2 col-lg-2 align-items-center`}>Nom *</label>
                            <input className={`d-flex col-12 col-md-10 col-lg-10`}
                                id="Name"
                                {...register("Name", {
                                    required: "Un nom est requis",
                                    minLength: { value: 2, message: "le doit doit contenir au moins 2 caractères" },
                                })}
                                type="text"
                                placeholder="Enter le nom du produit"
                            />
                            {errors.Name && <div style={{ color: "red" }}>{errors.Name.message}</div>}

                            <br /><br />
                        </div>

                        {/* description */}
                        <div className="row mb-4">
                            <label htmlFor="Description" className="d-flex align-items-center col-12 mb-2">Description *</label>

                            <textarea
                                className="form-control w-100 col-12"
                                id="Description"
                                {...register("Description", {
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
                                {errors.Description && (
                                    <p style={{ color: "red", fontSize: "0.9em" }}>
                                        {errors.Description.message}
                                    </p>
                                )}
                            </div>
                        </div>


                        {/* prix */}
                        <div className={` row mb-4`}>
                            <label htmlFor="Price" className={`d-flex col-12 col-md-2 col-lg-2 align-items-center`}>Prix *</label>
                            <div className="col-12 col-md-10 col-lg-10">
                                <div className="input-group">
                                    <input
                                        id="Price"
                                        type="number"
                                        placeholder="Enter le Price du produit"
                                        className="form-control"
                                        min={0}
                                        step="0.01"
                                        {...register("Price", {
                                            required: "Un Price est requis",
                                            valueAsNumber: true,
                                        })}
                                    />
                                    <span className="input-group-text">$</span>
                                </div>
                                {errors.Price && <div style={{ color: "red" }}>{errors.Price.message}</div>}
                            </div>
                            <br /><br />
                        </div>

                        {/* prix rabais */}
                        <div className="row mb-4 align-items-center">
                            <label className="d-flex col-12 col-md-2 col-lg-2 align-items-center">
                                Rabais
                            </label>

                            <div className="col-12 col-md-10 col-lg-10 d-flex align-items-center">
                                {/* Checkbox */}
                                <div className="form-check mb-0 px-2" style={{ flexShrink: 0 }}>
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

                                {/* rabais input */}
                                <div className="input-group flex-grow-1">
                                    <input
                                        id="DiscountPrice"
                                        type="number"
                                        placeholder="Entrez le prix du produit en rabais"
                                        className="form-control"
                                        min={0}
                                        step="0.01"
                                        {...register("DiscountPrice", { valueAsNumber: true, required: false })}
                                        disabled={!hasDiscount}
                                    />
                                    <span className="input-group-text">$</span>
                                </div>
                            </div>

                            {/* error message */}
                            {errors.DiscountPrice && (
                                <div style={{ color: "red" }}>{errors.DiscountPrice.message}</div>
                            )}
                        </div>

                        {/* stock */}
                        <div className={` row mb-4`}>
                            <label htmlFor="UnitsInStock" className={`d-flex col-12 col-md-2 col-lg-2 align-items-center`}>unité en stock</label>
                            <div className="col-12 col-md-10 col-lg-10">
                                <div className="input-group">
                                    <input
                                        id="UnitsInStock"
                                        type="number"
                                        placeholder="Enter le nombre d'unité en stock pour le produit"
                                        className="form-control"
                                        min={0}
                                        defaultValue={0}
                                        {...register("UnitsInStock", {
                                            required: "le nombre d'unité en stock est nécéssaire",
                                            valueAsNumber: true,
                                        })}
                                    />
                                    <span className="input-group-text">$</span>
                                </div>
                                {errors.UnitsInStock && <div style={{ color: "red" }}>{errors.UnitsInStock.message}</div>}
                            </div>
                            <br /><br />
                        </div>

                        {/* Categories et Status */}
                        <div className="row mb-4 align-items-center">
                            <label className="d-flex col-12 col-md-2 col-lg-2 align-items-center">
                                Options
                            </label>

                            <div className="col-12 col-md-10 col-lg-10 d-flex gap-3" style={{ maxWidth: "100%" }}>
                                {/* Category dropdown */}
                                <div className=" col-6">
                                    {isClient && (
                                        <Controller
                                            name="Categories"
                                            control={control}
                                            rules={{ required: "Sélectionnez au moins une catégorie" }}
                                            render={({ field }) => (
                                                <CreatableSelect
                                                    {...field}
                                                    isMulti
                                                    placeholder="Tapez une catégorie et appuyez sur Entrée..."
                                                    options={categorie.map((s) => ({
                                                        value: s,
                                                        label: s,
                                                    }))}
                                                    value={
                                                        field.value
                                                            ? field.value.map((val: string) => ({ value: val, label: val }))
                                                            : []
                                                    }

                                                    onChange={(selectedOptions) => {
                                                        field.onChange(selectedOptions.map((opt: any) => opt.value));
                                                    }}
                                                    onCreateOption={(inputValue) => {
                                                        const newOption = { value: inputValue, label: inputValue };
                                                        field.onChange([...(field.value || []), inputValue]);
                                                    }}
                                                />
                                            )}
                                        />
                                    )}

                                    {errors.Categories && (
                                        <div style={{ color: "red", fontSize: "0.9em" }}>
                                            {errors.Categories.message}
                                        </div>
                                    )}
                                </div>

                                {/* Status dropdown */}
                                <div className="flex-grow-1 col-6">
                                    <select
                                        className="form-select"
                                        {...register("Status", {
                                            required: "Sélectionnez un statut",
                                            valueAsNumber: true,
                                            validate: (v) => v >= 0 || "Veuillez sélectionner un statut",
                                        })}
                                        defaultValue={0}
                                    >
                                        <option key={-1} value={-1}>-- Sélectionnez un statut --</option>
                                        {status.map((s, i) => (
                                            <option key={i} value={i}>{s}</option>
                                        ))}
                                    </select>
                                    {errors.Status && (
                                        <div style={{ color: "red", fontSize: "0.9em" }}>
                                            {errors.Status.message}
                                        </div>
                                    )}
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
                        <button
                            type="submit"
                            disabled={isSubmitting || !isValid}
                            style={{
                                backgroundColor: !isValid ? '#ccc' : '#007bff',
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