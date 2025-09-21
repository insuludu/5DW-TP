import Image from "next/image";
import styles from "../styles/page.module.css";

import TemplateImage from '../images/template-image.png'
import TemplateLargeImage from '../images/template_large.png'

export default function Description() {
    return (
        <div  className={` text-light row mt-5`}>
            <div className={` col-lg-6 col-md-12`} style={{ height: "675px" }}>
                <div className={`rounded-5 overflow-hidden h-100`}>
                    <div className={`row p-2 ${styles.backgroundPrimary}`} style={{ height: "50%" }}>
                        <div className={`  col-9 p-4`}>
                            <h1>À propos de nous</h1>
                        </div>
                        <div className={`col-3 text-md-end `}>
                            <p className={` mt-5`}>Depuis 2025</p>
                        </div>
                        <hr style={{ height: "4px", backgroundColor: "white" }} />
                        <p className={`p-4 pt-0`}>Tout a commencé dans un petit atelier, avec quelques figurines posées un peu partout
                            et beaucoup trop de café. Petit à petit, la <b>passion</b> et l'<b>inspiration</b> a pris le dessus et
                            <b> botte et jambe</b> est née pour créer des figurines qui font sourire,
                            intriguent et se glissent partout dans vos collections.</p>
                    </div>
                    <div className={`row`} style={{ height: "50%" }}>
                        <div style={{ height: "100%", position: "relative" }} >
                            <Image
                                src={TemplateLargeImage}
                                alt="Picture of the author"
                                fill
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`col-lg-1`} />
            <div className={`col-lg-5 col-md-12 rounded-5 overflow-hidden mt-4 mt-lg-0`} style={{ height: "675px" }}>
                <div className={`row `} style={{ height: "60%" }} >
                    <div style={{ height: "100%", position: "relative" }} >
                        <Image
                            src={TemplateImage}
                            alt="Picture of the author"
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    </div>

                </div>
                <div className={`row p-3 ${styles.backgroundPrimary}`} style={{ height: "100%" }}>
                    <p>Chez <b>botte et jambe</b>, nous croyons que chaque passion mérite d'être célébrée.
                        Nous créons des figurines pour tous les goûts et toutes les envies :
                        héros de films, personnages de jeux vidéo, animaux adorés ou créations originales.
                        Chaque figurine raconte une histoire et rend vos collections uniques.</p>
                </div>
            </div>
        </div>
    );
}
