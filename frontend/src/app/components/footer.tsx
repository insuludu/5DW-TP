import styles from "../styles/page.module.css"
import imageLogo from "../images/Logo.png"
import Image from "next/image"

export default function Footer() {
    return (
        <footer className={` ${styles.backgroundPrimary}`}>
            <div className={` pt-3 row`}>
                <div className={` col-6 d-flex justify-content-end`}>
                    <Image
                        src={imageLogo}
                        width={210}
                        height={44}
                        alt="image logo"
                    />
                </div>
                <div className={` p-3 col-6`}>
                    <p className={` mb-0 ${styles.footerLinks}`}><a href="../terms">POLITIQUE</a>    |    <a href="../about">À PROPOS</a>    |    <a href="../contact-us">CONTACTER</a></p>
                </div>
            </div>
            <div style={{textAlign: "center"}}>
                <p className={` mb-0`}>
                    Copyright © 2025 Bottes & Jambes
                </p>
            </div>
        </footer>
    );
}