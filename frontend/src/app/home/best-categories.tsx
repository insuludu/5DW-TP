import styles from '../styles/page.module.css'
import TemplateImage from '../images/template-image.png'
import TemplateImage1 from '../images/template-image-2.png'
import TemplateImage2 from '../images/template-image-3.png'
import ProductCard from './product-card';
import CategoryCard from './category-card';
import { CategoryDTO } from '@/interfaces';
import { CreateHistogramOptions } from 'perf_hooks';
import { Alexandria } from 'next/font/google';

const nextUrl = process.env.NEXT_PUBLIC_API_MIDDLEWARE_URL;

async function GetBestCategories(): Promise<CategoryDTO[]> {
    console.log(nextUrl);
    try {
        const response = await fetch(`${nextUrl}/api/home/best-categories`);
        if (!response.ok) {
            throw new Error(`Error fetching categories: ${response.statusText}`);
        }
        const data: CategoryDTO[] = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function BestCategories() {

    console.log(nextUrl);
    const categories: CategoryDTO[] = await GetBestCategories();

    return (
        <section id="best-categories-section">
            <div className={`row mt-5 mb-5`}>
                <p className='fs-3 text-light text-center'>Voir aussi</p>
                <div className={`d-flex justify-content-center align-items-center ${styles.lgFlexChange}`}>

                    {categories.map((obj) => (
                        <CategoryCard
                            key={obj.id}
                            categoryName={obj.name}
                            id={obj.id}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
} 