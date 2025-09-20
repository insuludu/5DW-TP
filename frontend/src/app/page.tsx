import styles from "./styles/page.module.css";
import Header from "./components/header";

export default function Home() {
  return (
    <div>
        <h1 className={styles.italic}>Page d'accueil</h1>
        <Header/>
    </div>
  );
}
