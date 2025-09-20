import styles from '../styles/page.module.css'
import Image from 'next/image';

import TemplateImage from '../images/template-image.png'

export default function Mission() {
    return(
        <section id="mission-section" className={`d-flex justify-content-center align-items-center`}>
            <div className={`rounded-5 overflow-hidden row ${styles.m12Md}`}>
                <div style={{height: "600px", position: "relative"}} className={`col-md-6 col-sm-12`}>
                    <Image
                    src={TemplateImage}
                    alt="Picture of the author"
                    fill
                    style={{ objectFit: "cover" }}
                    />
                </div>
                <div className={`text-light d-flex flex-column justify-content-center align-items-center col-md-6 col-sm-12 p-5 ${styles.backgroundPrimary}`}>
                    <p className={`display-3 text-center`}>Des produits libres de droit à bas prix</p>
                    <p className={`fs-3 text-center pre-line-text`}>
                        Du plaisir en famille 🫃 et entre amis 😩👌
                    </p>
                </div>
            </div>
        </section>
    );
} 