"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SortOption {
    value: string;
    label: string;
}

interface SortSelectorProps {
    options?: SortOption[];
}

export default function SortSelector({
    options = [
        { value: "", label: "Par défaut" },
        { value: "price-asc", label: "Prix croissant" },
        { value: "price-desc", label: "Prix décroissant" },
        { value: "name-asc", label: "Nom A → Z" },
        { value: "name-desc", label: "Nom Z → A" },
    ],
}: SortSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Initialiser à vide pour éviter l'erreur d'hydration
    const [selectedSort, setSelectedSort] = useState("");
    const [mounted, setMounted] = useState(false);

    // Synchroniser avec les paramètres URL après le montage
    useEffect(() => {
        setMounted(true);
        setSelectedSort(searchParams.get("sort") || "");
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        
        if (value) {
            params.set("sort", value);
        } else {
            params.delete("sort");
        }
        
        router.push(`?${params.toString()}`);
        router.refresh();
        setSelectedSort(value);
    };

    // Afficher un placeholder pendant l'hydration
    if (!mounted) {
        return (
            <div
                className="sort-selector mb-3"
                style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "12px",
                    display: "inline-block",
                    minWidth: "200px",
                }}
            >
                <select
                    className="form-select"
                    disabled
                    style={{
                        backgroundColor: "var(--backgroundThird)",
                        color: "var(--foreground)",
                        border: "1px solid var(--backgroundPrimary)",
                        borderRadius: "8px",
                        padding: "0.4rem 0.6rem",
                        width: "100%",
                        appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                    }}
                >
                    <option>Chargement...</option>
                </select>
            </div>
        );
    }

    return (
        <div
            className="sort-selector mb-3"
            style={{
                padding: "0.5rem 1rem",
                borderRadius: "12px",
                display: "inline-block",
                minWidth: "200px",
            }}
        >
            <select
                value={selectedSort}
                onChange={handleChange}
                className="form-select"
                style={{
                    backgroundColor: "var(--backgroundThird)",
                    color: "var(--foreground)",
                    border: "1px solid var(--backgroundPrimary)",
                    borderRadius: "8px",
                    padding: "0.4rem 0.6rem",
                    width: "100%",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                }}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}