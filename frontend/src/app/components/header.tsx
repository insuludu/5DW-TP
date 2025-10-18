"use client";
import styles from "../styles/page.module.css"
import imageLogo from "../images/Logo.png"
import Image from "next/image"
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
    const [value, setValue] = useState("");
    const router = useRouter();

    function handleChange(event: ChangeEvent<HTMLInputElement>): void {
        setValue(event.target.value);
    }

    function handleSearch() {
        if (value.trim() !== "") {
            router.push(`/shop?search=${encodeURIComponent(value)}`);
        }
    }

    function handleKeyPress(event: KeyboardEvent<HTMLInputElement>): void {
        if (event.key === "Enter") {
            handleSearch();
        }
    }
    return (
        <header>
            <div style={{ backgroundColor: "#f8f8f8", borderBottom: "2px solid #ccc", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)", }} className={` p-3 row`}>
                <div className={` col-lg-4 col-md-6 pb-3 d-flex justify-content-center`}>
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
                <div className="col-lg-4 col-md-6 d-flex flex-column justify-content-center">
                    <div className="d-flex w-100 justify-content-center">
                        <input
                            type="text"
                            value={value}
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                            className="form-control"
                            placeholder="Rechercher..."
                            style={{ maxWidth: "500px" }}
                        />
                        <button onClick={handleSearch} className="btn btn-outline-dark ms-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-search"
                                viewBox="0 0 16 16"
                            >
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className={` p-3 col-lg-4 d-flex ${styles.headerLinks} text-center`}>
                    <a href="../terms" className={` pt-1 col-3`}>POLITIQUE</a>
                    <a href="../about" className={` pt-1 col-3`}>À PROPOS</a>
                    <a href="../contact-us" className={` pt-1 col-3`}>CONTACTER</a>
                    <a href="../create-product" className={` pt-1 col-3`}>CRÉER</a>
                </div>
            </div>
        </header>
    );
}