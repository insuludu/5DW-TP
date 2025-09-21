import styles from "../styles/page.module.css";
import Description from "./description";
import Team from "./team";
import MapEmbed from "./map";

export default function About() {
  return (
    <div className={`container`}>
      <Description />
      <div style={{ height: "100px" }}></div>
      <Team />
      <div className={`row mt-5`}>
        <h1>coordonnées</h1>
        <MapEmbed />
        <h4>Nous contacter directement</h4>
        <a href="http://localhost:3000/about" className={styles.link}>123-456-7890</a>
        <a href="http://localhost:3000/about" className={styles.link}> botte_et_jambe@gmail.com</a>
      </div>
    </div>
  );
}
