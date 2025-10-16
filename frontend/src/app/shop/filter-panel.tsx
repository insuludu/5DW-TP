"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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

    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || "");
    const [selectedDiscount, setSelectedDiscount] = useState(searchParams.get("discount") || "");
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.get("categories")?.split(",").filter(Boolean) || []
    );

    const statuses = [
        { value: "", label: "Tous" },
        { value: "available", label: "Disponible" },
        { value: "unavailable", label: "Indisponible" },
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

        minPrice ? params.set("minPrice", minPrice) : params.delete("minPrice");
        maxPrice ? params.set("maxPrice", maxPrice) : params.delete("maxPrice");
        selectedStatus ? params.set("status", selectedStatus) : params.delete("status");
        selectedDiscount ? params.set("discount", selectedDiscount) : params.delete("discount");
        selectedCategories.length > 0
            ? params.set("categories", selectedCategories.join(","))
            : params.delete("categories");

        router.push(`?${params.toString()}`);
    };

    const resetFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setSelectedStatus("");
        setSelectedDiscount("");
        setSelectedCategories([]);

        const params = new URLSearchParams(searchParams.toString());
        ["minPrice", "maxPrice", "status", "discount", "categories"].forEach((p) => params.delete(p));
        router.push(`?${params.toString()}`);
    };

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
                            checked={selectedDiscount === option.value}
                            onChange={() => setSelectedDiscount(option.value)}
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
                {statuses.map((status) => (
                    <div key={status.value} className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="statusOption"
                            id={`status-${status.value}`}
                            checked={selectedStatus === status.value}
                            onChange={() => setSelectedStatus(status.value)}
                        />
                        <label
                            className="form-check-label"
                            htmlFor={`status-${status.value}`}
                            style={{ color: "var(--foreground)" }}
                        >
                            {status.label}
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
