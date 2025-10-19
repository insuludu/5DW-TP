"use client"
import styles from "../styles/page.module.css"
import imageLogo from "../images/Logo.png"
import Image from "next/image"

export default function Footer() {
    return (
        <footer className="py-4 footer-gradient">
            <div className="container">
                <div className="row align-items-center mb-3">
                    <div className="col-lg-6 col-12 d-flex justify-content-lg-end justify-content-center mb-2 mb-lg-0">
                        <a href="/" className="text-center text-lg-end">
                            <Image
                                src={imageLogo}
                                width={250}
                                height={48}
                                alt="Logo Bottes & Jambes"
                                className="mb-3"
                            />
                        </a>
                    </div>

                    <div className="col-lg-auto d-none d-lg-flex px-0">
                        <div className="border-end border-separator" style={{ height: '70px', borderWidth: '2px' }}></div>
                    </div>

                    <div className="col-12 d-lg-none mb-3">
                        <div className="border-top border-separator" style={{ borderWidth: '2px', margin: '0 auto' }}></div>
                    </div>
                    
                    <div className="col-lg col-12 d-flex justify-content-center justify-content-lg-start">
                        <nav className={`${styles.footerLinks}`} aria-label="Footer navigation">
                            <div className="d-flex flex-row flex-wrap gap-3 gap-md-4">
                                <a href="/terms" className="text-decoration-none d-inline-flex align-items-center transition-opacity fw-semibold" style={{ opacity: 0.85, color: '#2C3E50' }}>
                                    <span className="me-2">📋</span> POLITIQUE
                                </a>
                                <a href="/about" className="text-decoration-none d-inline-flex align-items-center transition-opacity fw-semibold" style={{ opacity: 0.85, color: '#2C3E50' }}>
                                    <span className="me-2">ℹ️</span> À PROPOS
                                </a>
                                <a href="/contact-us" className="text-decoration-none d-inline-flex align-items-center transition-opacity fw-semibold" style={{ opacity: 0.85, color: '#2C3E50' }}>
                                    <span className="me-2">✉️</span> CONTACTER
                                </a>
                            </div>
                        </nav>
                    </div>
                </div>

                <div className="border-top border-separator pt-4">
                    <div className="row justify-content-center">
                        <div className="col-12 text-center">
                            <p className="mb-0 small" style={{ opacity: 0.75, color: '#2C3E50' }}>
                                Copyright © 2025 Bottes & Jambes. Tous droits réservés.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .footer-gradient {
                    background: rgba(184, 0, 0, 0.27);
                }
                .border-separator {
                    border-color: rgba(44, 62, 80, 0.2) !important;
                }
                .transition-opacity:hover {
                    opacity: 1 !important;
                }
            `}</style>
        </footer>
    );
}