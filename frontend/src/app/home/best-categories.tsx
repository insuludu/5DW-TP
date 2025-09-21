import styles from '../styles/page.module.css'
import TemplateImage from '../images/template-image.png'
import TemplateImage1 from '../images/template-image-2.png'
import TemplateImage2 from '../images/template-image-3.png'
import ProductCard from './product-card';
import CategoryCard from './category-card';

export default function BestCategories() {
    return(
        <section id="best-categories-section">
            <div className={`row mt-5 mb-5`}>
                <p className='fs-3 text-light text-center'>Voir aussi</p>
                <div className={`d-flex justify-content-center align-items-center ${styles.lgFlexChange}`}>
                    <CategoryCard categoryName='Pika collection' />
                    <CategoryCard categoryName='Star Fighters collection' />
                    <CategoryCard categoryName='Funny Toy collection' />
                    <CategoryCard categoryName='Space Friend collection' />
                    <CategoryCard categoryName='Bat Boy collection' />
                </div>
            </div>
        </section>
    );
} 