"use client";

import { useFilters } from "../hooks/useFilters";

interface Category {
    id: number;
    name: string;
}

interface FilterPanelProps {
    categories?: Category[];
}

export default function FilterPanel({ categories = [] }: FilterPanelProps) {
    const {
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,
        status, setStatus,
        discount, setDiscount,
        categories: selectedCategories, setCategories,
        applyFilters, resetFilters,
    } = useFilters();

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
        setCategories(newCategories);
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