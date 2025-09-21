import styles from "../styles/page.module.css"

export default function CategoryCard({categoryName} : { categoryName : string}) {
    return(
        <div className={`m-2 rounded-5 text-center p-2 category-card ${styles.categoryCard} ${styles.backgroundThird}`}>
            <span className="fs-6" >{categoryName}</span>
        </div>
    );
} 