"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "");
    const [discount, setDiscount] = useState(searchParams.get("discount") || "");
    const [categories, setCategories] = useState<string[]>(
        searchParams.get("categories")?.split(",").filter(Boolean) || []
    );

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        minPrice ? params.set("minPrice", minPrice) : params.delete("minPrice");
        maxPrice ? params.set("maxPrice", maxPrice) : params.delete("maxPrice");
        status ? params.set("status", status) : params.delete("status");
        discount ? params.set("discount", discount) : params.delete("discount");
        categories.length > 0
            ? params.set("categories", categories.join(","))
            : params.delete("categories");

        router.push(`?${params.toString()}`);
    };

    const resetFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setStatus("");
        setDiscount("");
        setCategories([]);

        const params = new URLSearchParams(searchParams.toString());
        ["minPrice", "maxPrice", "status", "discount", "categories"].forEach((p) =>
            params.delete(p)
        );
        router.push(`?${params.toString()}`);
    };

    return {
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        status,
        setStatus,
        discount,
        setDiscount,
        categories,
        setCategories,
        applyFilters,
        resetFilters,
    };
};