'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'default';

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sortValue = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        
        if (sortValue === 'default') {
            params.delete('sort');
        } else {
            params.set('sort', sortValue);
        }
        
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="mb-4 d-flex align-items-center gap-3">
            <label htmlFor="sort-select" className="mb-0">Trier par:</label>
            <select 
                id="sort-select"
                className="form-select w-auto"
                value={currentSort}
                onChange={handleSortChange}
            >
                <option value="default">Par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
            </select>
        </div>
    );
}