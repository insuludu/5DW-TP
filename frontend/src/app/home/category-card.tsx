import styles from "../styles/page.module.css"

export default function CategoryCard({categoryName, id} : { categoryName : string, id: number}) {
    return(
        <a href={`/shop?categories=${id}`} className={`m-2 rounded-5 text-center p-2 category-card ${styles.categoryCard} ${styles.backgroundThird}`}>
            <span className="fs-6" >{categoryName}</span>
        </a>
    );
} 