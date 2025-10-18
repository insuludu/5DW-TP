import styles from '../styles/page.module.css'
import ProductCard from './product-card';
import { StarProductDTO } from '@/interfaces';
import Link from 'next/link';

const nextUrl = process.env.API_MIDDLEWARE_URL;

async function GetStarProducts(): Promise<StarProductDTO[]> {
    const response = await fetch(nextUrl + `/api/home/star-products`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Incapable de communiquer avec le middleware');
    }

    return response.json();
}

export default async function BestProducts() {
    const products = await GetStarProducts();
    return (
        <section id="best-products-section">
            <div className={`row mt-5 mb-5`}>
                <p className='fs-3 text-light text-center'>Produits les plus populaires</p>
                <div className={`d-flex justify-content-center align-items-center ${styles.lgFlexChange}`}>
                    {
                        products.map(p => (
                            <div key={p.id}>
                                <Link href={`/shop/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <ProductCard product={p} />
                                </Link>
                            </div>

                        ))
                    }
                </div>
            </div>
        </section>
    );
} 