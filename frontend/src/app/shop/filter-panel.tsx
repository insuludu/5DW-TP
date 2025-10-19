"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Category {
    id: number;
    name: string;
}

interface FilterPanelProps {
    categories?: Category[];
}

export default function FilterPanel({ categories = [] }: FilterPanelProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialiser à vide pour éviter l'erreur d'hydration
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [status, setStatus] = useState("");
    const [discount, setDiscount] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    // Synchroniser avec les paramètres URL après le montage
    useEffect(() => {
        setMounted(true);
        setMinPrice(searchParams.get("minPrice") || "");
        setMaxPrice(searchParams.get("maxPrice") || "");
        setStatus(searchParams.get("status") || "");
        setDiscount(searchParams.get("discount") || "");
        setSelectedCategories(searchParams.get("categories")?.split(",").filter(Boolean) || []);
    }, [searchParams]);

    const statuses = [
        { value: "", label: "Tous" },
        { value: "available", label: "Disponible" },
        { value: "unavailable", label: "Indisponible" },
        { value: "outofstock", label: "Rupture de stock" },
        { value: "comingsoon", label: "Bientôt disponible" },
    ];

    const discountOptions = [
        { value: "", label: "Tous" },
        { value: "discount", label: "En rabais" },
        { value: "no-discount", label: "Sans rabais" },
    ];

    const handleCategoryChange = (categoryId: string) => {
        const newCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter((c) => c !== categoryId)
            : [...selectedCategories, categoryId];
        setSelectedCategories(newCategories);
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (minPrice) {
            params.set("minPrice", minPrice);
        } else {
            params.delete("minPrice");
        }

        if (maxPrice) {
            params.set("maxPrice", maxPrice);
        } else {
            params.delete("maxPrice");
        }

        if (status) {
            params.set("status", status);
        } else {
            params.delete("status");
        }

        if (discount) {
            params.set("discount", discount);
        } else {
            params.delete("discount");
        }

        if (selectedCategories.length > 0) {
            params.set("categories", selectedCategories.join(","));
        } else {
            params.delete("categories");
        }

        router.push(`?${params.toString()}`);
        router.refresh();
    };

    const resetFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        const search = params.get("search");
        const sort = params.get("sort");
        
        const newParams = new URLSearchParams();
        if (search) newParams.set("search", search);
        if (sort) newParams.set("sort", sort);

        setMinPrice("");
        setMaxPrice("");
        setStatus("");
        setDiscount("");
        setSelectedCategories([]);

        router.push(`?${newParams.toString()}`);
        router.refresh();
    };

    // Afficher un placeholder pendant l'hydration
    if (!mounted) {
        return (
            <div
                className="filter-panel card p-3 mb-4"
                style={{
                    backgroundColor: "var(--backgroundThird)",
                    color: "var(--foreground)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
            >
                <h5 className="mb-3" style={{ color: "var(--backgroundPrimary)" }}>
                    Filtres
                </h5>
                <p className="text-muted">Chargement...</p>
            </div>
        );
    }

    return (
        <div
            className="filter-panel card p-3 mb-4"
            style={{
                backgroundColor: "var(--backgroundThird)",
                color: "var(--foreground)",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
        >
            <h5 className="mb-3" style={{ color: "var(--backgroundPrimary)" }}>
                Filtres
            </h5>

            {/* --- Rabais --- */}
            <div className="mb-3">
                <label className="form-label fw-bold" style={{ color: "var(--foreground)" }}>
                    Rabais
                </label>
                {discountOptions.map((option, index) => (
                    <div key={index} className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="discountOption"
                            id={`discount-${index}`}
                            checked={discount === option.value}
                            onChange={() => setDiscount(option.value)}
                        />
                        <label
                            className="form-check-label"
                            htmlFor={`discount-${index}`}
                            style={{ color: "var(--foreground)" }}
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>

            {/* --- Prix --- */}
            <div className="mb-3">
                <label className="form-label fw-bold" style={{ color: "var(--foreground)" }}>
                    Prix personnalisé
                </label>
                <div className="d-flex gap-2 align-items-center">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        min="0"
                        style={{ borderColor: "var(--backgroundPrimary)" }}
                    />
                    <span style={{ color: "var(--foreground)" }}>-</span>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        min="0"
                        style={{ borderColor: "var(--backgroundPrimary)" }}
                    />
                </div>
            </div>

            {/* --- Catégories --- */}
            {categories.length > 0 && (
                <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: "var(--foreground)" }}>
                        Catégories
                    </label>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {categories.map((category) => (
                            <div key={category.id} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`category-${category.id}`}
                                    checked={selectedCategories.includes(category.id.toString())}
                                    onChange={() => handleCategoryChange(category.id.toString())}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={`category-${category.id}`}
                                    style={{ color: "var(--foreground)" }}
                                >
                                    {category.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- Disponibilité --- */}
            <div className="mb-3">
                <label className="form-label fw-bold" style={{ color: "var(--foreground)" }}>
                    Disponibilité
                </label>
                {statuses.map((s) => (
                    <div key={s.value} className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="statusOption"
                            id={`status-${s.value}`}
                            checked={status === s.value}
                            onChange={() => setStatus(s.value)}
                        />
                        <label
                            className="form-check-label"
                            htmlFor={`status-${s.value}`}
                            style={{ color: "var(--foreground)" }}
                        >
                            {s.label}
                        </label>
                    </div>
                ))}
            </div>

            {/* --- Boutons --- */}
            <div className="d-flex gap-2">
                <button
                    className="btn flex-grow-1"
                    style={{
                        backgroundColor: "var(--backgroundPrimary)",
                        color: "var(--textLight)",
                        border: "none",
                    }}
                    onClick={applyFilters}
                >
                    Appliquer
                </button>
                <button
                    className="btn"
                    style={{
                        backgroundColor: "var(--backgroundSecondaryComplement)",
                        color: "var(--foreground)",
                        border: "none",
                    }}
                    onClick={resetFilters}
                >
                    Réinitialiser
                </button>
            </div>
        </div>
    );
}