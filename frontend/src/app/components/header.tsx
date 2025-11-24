"use client";
import imageLogo from "../images/Logo.png"
import Image from "next/image"
import { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
    const [value, setValue] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [roles, setRoles] = useState<string[] | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Vérifier l'état de connexion via une API route
        const checkAuthStatus = async () => {
            try {
                console.log('Vérification du statut d\'authentification...');
                const response = await fetch('/api/account/status');
                const data = await response.json();
                console.log('Réponse status:', data);
                setIsLoggedIn(data.isAuthenticated);
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'authentification:', error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);


    useEffect(() => {
        async function fetchRoles() {
            try {
                const res = await fetch("/api/auth/me", { cache: "no-store" });

                if (!res.ok) {
                    console.error("API /me failed");
                    return setRoles([]);
                }

                const data = await res.json();

                setRoles(data.roles || []);
            } catch (err) {
                console.error("Error fetching /api/auth/me:", err);
                setRoles([]);
            }
        }

        fetchRoles();
    }, []);

    function handleChange(event: ChangeEvent<HTMLInputElement>): void {
        setValue(event.target.value);
    }

    function handleSearch() {
        if (value.trim() !== "") {
            router.push(`/shop?search=${encodeURIComponent(value)}`);
        }
        else {
            router.push(`/shop`);
        }
    }

    function handleKeyPress(event: KeyboardEvent<HTMLInputElement>): void {
        if (event.key === "Enter") {
            handleSearch();
        }
    }

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    function closeMenu() {
        setIsMenuOpen(false);
    }

    async function handleLogout() {
        try {
            const response = await fetch('/api/account/logout', {
                method: 'POST',
            });
            window.location.reload();  
            
            if (response.ok) {
                setIsLoggedIn(false);
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    }

    return (
        <header>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
            <div style={{ backgroundColor: "#f8f8f8", borderBottom: "2px solid #ccc", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)", position: "relative" }} className={` p-3 row`}>
                <div className={` col-lg-4 col-md-6 pb-3 d-flex justify-content-center`}>
                    <a href="/">
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
                <div className="col-lg-4 col-md-12 d-flex justify-content-lg-end justify-content-center align-items-center p-3">
                    {/* Menu Desktop */}
                    <div className="d-none d-lg-flex gap-3 align-items-center">
                        {roles?.includes("Admin") && (
                            <a href="/create-product" className="text-dark text-decoration-none fw-semibold">CRÉER</a>
                        )}

                        {/* Affichage conditionnel selon l'état de connexion */}
                        {!isLoading && (
                            isLoggedIn ? (
                                // Bouton Déconnexion
                                <button onClick={handleLogout} className="btn btn-outline-danger">
                                    Se déconnecter
                                </button>
                            ) : (
                                // Boutons Connexion/Inscription
                                <>
                                    <a href="/account/login" className="btn btn-outline-dark">
                                        Se connecter
                                    </a>
                                    <a href="/account/signup" className="btn btn-dark">
                                        S'inscrire
                                    </a>
                                </>
                            )
                        )}

                        {/* Bouton Panier Desktop */}
                        <a
                            href="/shop/cart"
                            className="btn btn-outline-dark"
                            style={{ padding: "0.375rem 0.75rem" }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                            </svg>
                        </a>
                    </div>

                    {/* Bouton Hamburger Mobile */}
                    <button
                        className="d-lg-none btn btn-link text-dark p-0"
                        onClick={toggleMenu}
                        aria-label="Menu"
                        style={{ border: "none", background: "none" }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            {isMenuOpen ? (
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                            ) : (
                                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                            )}
                        </svg>
                    </button>

                    {/* Bouton Panier Mobile */}
                    <a
                        href="/shop/cart"
                        className="btn btn-outline-dark d-lg-none ms-3"
                        style={{ padding: "0.375rem 0.75rem" }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                        </svg>
                    </a>
                </div>

                {/* Menu Mobile Dropdown - Pleine largeur */}
                <div
                    className="d-lg-none position-absolute bg-white"
                    style={{
                        top: "100%",
                        left: 0,
                        right: 0,
                        width: "100%",
                        maxHeight: isMenuOpen ? "400px" : "0",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease-in-out",
                        zIndex: 1000,
                        borderBottom: isMenuOpen ? "2px solid #ccc" : "none",
                        boxShadow: isMenuOpen ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none"
                    }}
                >
                    <div className="d-flex flex-column">
                        {roles?.includes("Admin") && (
                        <a
                            href="/create-product"
                            className="text-dark text-decoration-none fw-semibold p-3 text-center"
                            onClick={closeMenu}
                            style={{ transition: "background-color 0.2s" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            CRÉER
                        </a>
                        )}

                        {/* Affichage conditionnel mobile */}
                        {!isLoading && (
                            isLoggedIn ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        closeMenu();
                                    }}
                                    className="text-danger text-decoration-none fw-semibold p-3 text-center"
                                    style={{
                                        transition: "background-color 0.2s",
                                        border: "none",
                                        background: "transparent"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                >
                                    SE DÉCONNECTER
                                </button>
                            ) : (
                                <>
                                    <a
                                        href="/account/login"
                                        className="text-dark text-decoration-none fw-semibold p-3 text-center"
                                        onClick={closeMenu}
                                        style={{ transition: "background-color 0.2s" }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                        SE CONNECTER
                                    </a>
                                    <a
                                        href="/account/signup"
                                        className="text-dark text-decoration-none fw-semibold p-3 text-center"
                                        onClick={closeMenu}
                                        style={{ transition: "background-color 0.2s" }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                        S'INSCRIRE
                                    </a>
                                </>
                            )
                        )}
                    </div>
                </div>
            </div>
        </header >
    );
}