'use client'
import React, { useState } from 'react'
import ContactForm from './contactform'
import styles from '../styles/page.module.css'

export default function ContactPopup() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                className={styles.popup}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Fermer le formulaire de contact" : "Ouvrir le formulaire de contact"}
            >
                <span>📨</span>
                <span>
                    <span>Contact</span>
                </span>
            </button>
            {
                isOpen && (
                    <div className={styles.popupModal}>
                        <div className={styles.popupContent}>
                            <ContactForm />
                        </div>
                    </div>
                )
            }
        </>
    );
}