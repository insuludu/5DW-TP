"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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

    const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "");

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        value ? params.set("sort", value) : params.delete("sort");
        router.push(`?${params.toString()}`);
        setSelectedSort(value);
    };

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
                    backgroundColor: "var(--backgroundThird)", // menu rose
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
