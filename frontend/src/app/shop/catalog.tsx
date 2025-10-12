import ShopCard from "./shop-card";
import styles from "@/app/styles/page.module.css"

export default function Catalog() {
    const Products : number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    return (
        <div className={``}>
            <div className={`${styles.catalogGridContainer}`}>
                {
                    Products.map(p => (
                    <div key={p} className={`mb-3 rounded-3 overflow-hidden`}>
                        <ShopCard />
                    </div>
                    ))
                }
            </div>
        </div>
    )
}