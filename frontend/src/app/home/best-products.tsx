import styles from '../styles/page.module.css'
import TemplateImage from '../images/template-image.png'
import TemplateImage1 from '../images/template-image-2.png'
import TemplateImage2 from '../images/template-image-3.png'
import ProductCard from './product-card';

export default function BestProducts() {
    return(
        <section id="best-products-section">
            <div className={`row mt-5 mb-5`}>
                <p className='fs-3 text-light text-center'>Produits les plus populaires</p>
                <div className={`d-flex justify-content-center align-items-center ${styles.lgFlexChange}`}>
                    <ProductCard image={TemplateImage} name="spider-chu"/>
                    <ProductCard image={TemplateImage1} name="bat-chu"/>
                    <ProductCard image={TemplateImage2} name="super-chu"/>
                </div>
            </div>
        </section>
    );
} 