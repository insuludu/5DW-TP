import { ShopProductDTO } from "@/interfaces";
import ShopCard from "./shop-card";
import styles from "@/app/styles/page.module.css"

const nextUrl = process.env.API_MIDDLEWARE_URL;

async function GetCatalogProducts() : Promise<ShopProductDTO[]> {
    const response = await fetch(nextUrl +`/api/shop/catalog-products`, {
        cache: 'no-store', 
    });

    if (!response.ok) {
        throw new Error('Incapable de communiquer avec le middleware');
    }

    return response.json();
}

export default async function Catalog() {
    const Products : ShopProductDTO[] = await GetCatalogProducts();
    return (
        <div className={``}>
            <div className={`${styles.catalogGridContainer}`}>
                {
                    Products.map(p => (
                    <div key={p.id} className={`mb-3 rounded-3 overflow-hidden`}>
                        <ShopCard product={p} />
                    </div>
                    ))
                }
            </div>
        </div>
    )
}