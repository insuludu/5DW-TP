import styles from "../styles/page.module.css";
import Description from "./description";
import Team from "./team";
import MapEmbed from "./map";
import Header from "../components/header";
import Footer from "../components/footer";

export default function About() {
  return (
    <div >
      <Header />
      
      <div className="container">

        <Description />
        <div style={{ height: "100px" }}></div>
        <Team />
        <div className={`row mt-5`}>
          <h1>coordonnées</h1>
          <MapEmbed />
          <h4>Nous contacter directement</h4>
          <a href="http://localhost:3000/about" className={styles.link}> 450-123-4567 </a>
          <a href="http://localhost:3000/about" className={styles.link}> bottesetjambes@gmail.com</a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
