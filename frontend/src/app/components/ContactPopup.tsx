'use client'
import React, { useState } from 'react'
import ContactForm from './contactform'

export default function ContactPopup() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
            >
                <span>📨</span>
                <span>
                    <span>Contact</span>
                </span>
            </button>
            {
                isOpen && (
                    <div>
                        <div
                            onClick={() => setIsOpen(false)}
                        />
                        <div>
                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label='Fermer'
                            >
                                <span>x</span>
                            </button>
                            <ContactForm />
                        </div>
                    </div>
                )
            }
        </>
    );
}