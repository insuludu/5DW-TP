import styles from "../styles/page.module.css";
import HeaderSection from "../components/header";
import FooterSection from "../components/footer";
import "./_animations.css"
import MissionSection from "./mission"
import BestProducts from "./best-products"
import BestCategories from "./best-categories";
import ContactPopup from "../components/ContactPopup";

export default function Home() {

  return (
    <section>
        <div>
            <HeaderSection />
        </div>
        <div className={`row min-vh-100`}>
            <MissionSection />
        </div>
        <div className={`row min-vh-100 ${styles.backgroundPrimary}`}>
          <div className={`row text-light p-4`}>
              <p className={`display-3`}>Nos produits vedettes</p>
          </div>

          <BestProducts />
          <div style={{height: "20px"}}></div>
          <BestCategories/>
        </div>

        <div className={`row min-vh-100`}>
        </div>
        <div>
          <FooterSection />
        </div>
        <footer>
            <ContactPopup/>
        </footer>
    </section>
  );
}
