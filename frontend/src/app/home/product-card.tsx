import Image, { StaticImageData } from 'next/image';
import styles from '../styles/page.module.css'

export default function ProductCard({ image, name } : { image: StaticImageData, name: string }) {
    return(
        <div className={`m-2`}>
            <div className={`best-product-product-card rounded-4 p-2 ${styles.backgroundThird}`}>
                <div style={{height: "350px", width: "350px", position: "relative"}} className={`rounded-5`}>
                    <Image
                    src={image}
                    alt="Picture of the product"
                    fill
                    style={{ objectFit: "cover", borderRadius: "1.2em"}}
                    />
                </div>
                <div className={`d-flex justify-content-center align-items-center p-1`}>
                    <div className={`best-product-product-name fs-2 text-center`}>{name}</div>
                </div>
            </div>
        </div>
    );
}