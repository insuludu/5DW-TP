import styles from "../styles/page.module.css"
import imageLogo from "../images/Logo.png"
import Image from "next/image"

export default function Header() {
    return (
        <header>
            <div style={{ backgroundColor: "#EEEEEE" }} className={` p-3 row`}>
                <div className={` col-5`}>
                    <a href="./">
                        <Image
                            src={imageLogo}
                            width={280}
                            height={58}
                            style={{ objectFit: "contain" }}
                            alt="image logo"
                        />
                    </a>
                </div>
                <div className={` p-3 col-2`}>
                    <input type="text" className={` col-10`} />
                    <button className={` col-2`} >
                        {/*yo sim wtf le logo??????*/}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                    </button>
                </div>
                <div className={` p-3 col-2`}></div>
                <div className={` p-3 col-3 row ${styles.headerLinks}`}>
                    <a href="../terms" className={` pt-1 col-4`}>POLITIQUE</a>
                    <a href="../about" className={` pt-1 col-4`}>À PROPOS</a>
                    <a href="../contact-us" className={` pt-1 col-4`}>CONTACTER</a>
                </div>
            </div>
        </header>
    );
}