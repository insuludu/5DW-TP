import styles from '../styles/page.module.css'
import Image from 'next/image';
import TemplateImage from '../images/template-image.png'

export default function Mission() {
    return(
        <section id="mission-section" className={`d-flex justify-content-center align-items-center`}>
            <div className={`overflow-hidden row ${styles.m10Md}`}>
                <div className={`col-md-6 col-sm-12 p-0`}>
                    <video style={{objectFit: "cover", width: "100%", height: "100%"}} autoPlay muted loop playsInline>
                        <source src="../videos/video-preview.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className={`text-light d-flex flex-column justify-content-center align-items-center col-md-6 col-sm-12 p-5 ${styles.backgroundSecondary}`}>
                    <p className={`display-3 text-center`}>Des produits libres de droits à bas prix</p>
                    <p className={`fs-2 text-center pre-line-text`}>Du plaisir en famille 🫃 et entre amis 😩👌</p>
                </div>
            </div>
        </section>
    );
} 