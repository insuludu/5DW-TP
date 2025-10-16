import { Suspense } from "react";
import Header from "../components/header";
import Catalog from "./catalog";
import SortSelector from "./sort-selector";
import FilterPanel from "./filter-panel";

const nextUrl = process.env.NEXT_PUBLIC_API_MIDDLEWARE_URL;

// --- Fonction pour récupérer les catégories ---
async function GetCategories() {
    try {
        const response = await fetch(`${nextUrl}/api/shop/categories`, {
            cache: "no-store",
        });

        if (!response.ok) return [];
        return response.json();
    } catch {
        return [];
    }
}

interface PageProps {
    searchParams: Promise<{
        sort?: string;
        minPrice?: string;
        maxPrice?: string;
        status?: string;
        discount?: string;
        categories?: string;
    }>;
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams; // ✅ On attend la Promise
    const categories = await GetCategories();

    return (
        <div>
            <Header />
            <section className="container-fluid mt-5 mb-5">
                <div className="row">
                    {/* --- Panneau de filtres --- */}
                    <div className="col-lg-3 col-md-4 mb-4">
                        <Suspense fallback={<div>Chargement des filtres...</div>}>
                            <FilterPanel categories={categories} />
                        </Suspense>
                    </div>

                    {/* --- Catalogue --- */}
                    <div className="col-lg-9 col-md-8">
                        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
                            <p className="fs-3 mb-0">Nos produits</p>
                            <Suspense fallback={<div>Chargement...</div>}>
                                <SortSelector />
                            </Suspense>
                        </div>
                        <div className="px-3">
                            <Catalog
                                sort={params.sort}
                                minPrice={params.minPrice}
                                maxPrice={params.maxPrice}
                                status={params.status}
                                discount={params.discount}
                                categories={params.categories}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
