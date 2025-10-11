import styles from '../styles/page.module.css'
import Image from 'next/image';
import NotFoundImage from "@/app/images/not-found.png"
import { StarProductDTO } from '@/interfaces';

export default function ProductCard({ product } : { product: StarProductDTO }) {
    console.log(product.imageData?.url)
    return(
        <div className={`m-2`}>
            <div className={`best-product-product-card rounded-4 p-2 ${styles.backgroundThird}`}>
                <div style={{height: "350px", width: "350px", position: "relative"}} className={`rounded-5`}>
                    <Image
                    src={product.imageData != null && product.imageData.url != null ? product.imageData.url : NotFoundImage}
                    alt={product.imageData != null && product.imageData.alt != null ? product.imageData.alt : "Picture of the product"}
                    fill
                    style={{ objectFit: "cover", borderRadius: "1.2em"}}
                    />
                </div>
                <div className={`d-flex justify-content-center align-items-center p-1`}>
                    <div className={`best-product-product-name fs-2 text-center`}>{product.name}</div>
                </div>
            </div>
        </div>
    );
}