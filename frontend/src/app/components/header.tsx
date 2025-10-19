"use client";
import styles from "../styles/page.module.css";
import imageLogo from "../images/Logo.png";
import Image from "next/image";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
    const [value, setValue] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    function handleChange(event: ChangeEvent<HTMLInputElement>): void {
        setValue(event.target.value);
    }

    function handleSearch() {
        if (value.trim() !== "") {
            router.push(`/shop?search=${encodeURIComponent(value)}`);
        } else {
            router.push(`/shop`);
        }
    }

    function handleKeyPress(event: KeyboardEvent<HTMLInputElement>): void {
        if (event.key === "Enter") handleSearch();
    }

    return (
        <header>
            <nav
                className="navbar navbar-expand-lg navbar-light"
                style={{
                    backgroundColor: "#f8f8f8",
                    borderBottom: "2px solid #ccc",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
                }}
            >
                <div className="container-fluid">
                    {/* Logo */}
                    <a href="/" className="navbar-brand d-flex align-items-center">
                        <Image
                            src={imageLogo}
                            width={180}
                            height={40}
                            style={{ objectFit: "contain" }}
                            alt="image logo"
                        />
                    </a>

                    {/* Hamburger Button */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Collapsible content */}
                    <div
                        className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
                    >
                        {/* Search bar */}
                        <div className="d-flex flex-grow-1 justify-content-center my-2 my-lg-0">
                            <input
                                type="text"
                                value={value}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="form-control"
                                placeholder="Rechercher..."
                                style={{ maxWidth: "400px" }}
                            />
                            <button
                                onClick={handleSearch}
                                className="btn btn-outline-dark ms-1"
                            >
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

                        {/* Nav links */}
                        <ul className="navbar-nav ms-auto text-center">
                            <li className="nav-item">
                                <a href="/terms" className="nav-link">POLITIQUE</a>
                            </li>
                            <li className="nav-item">
                                <a href="/about" className="nav-link">À PROPOS</a>
                            </li>
                            <li className="nav-item">
                                <a href="/contact-us" className="nav-link">CONTACTER</a>
                            </li>
                            <li className="nav-item">
                                <a href="/create-product" className="nav-link">CRÉER</a>

                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
