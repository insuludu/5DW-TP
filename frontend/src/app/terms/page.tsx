"use client";

import { useState } from "react";
import { termsContent, Language } from "./content";
import styles from "../styles/page.module.css";

export default function Terms() {
  const [language, setLanguage] = useState<Language>("fr");

  return (
    <div className={styles.contactContainer}>
      {/* Sélecteur de langue */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginBottom: '2rem',
        maxWidth: '1200px',
        margin: '0 auto 2rem auto'
      }}>
        <div className={styles.infoBlock} style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          padding: '0.5rem',
          marginBottom: '0',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <button
            onClick={() => setLanguage("en")}
            className={language === "en" ? styles.submitButton : ''}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              backgroundColor: language === "en" ? undefined : 'transparent',
              color: language === "en" ? undefined : 'var(--text-medium)',
              transition: 'all 0.3s ease'
            }}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("fr")}
            className={language === "fr" ? styles.submitButton : ''}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              backgroundColor: language === "fr" ? undefined : 'transparent',
              color: language === "fr" ? undefined : 'var(--text-medium)',
              transition: 'all 0.3s ease'
            }}
          >
            Français
          </button>
        </div>
      </div>

      <div className={styles.contactContent} style={{ gridTemplateColumns: '1fr' }}>
        {/* Contenu */}
        <div className={styles.infoBlock}>
          <div className={styles.formHeader} style={{ marginBottom: '1.5rem' }}>
            <h1 className={styles.italic}>
              {termsContent[language].title}
            </h1>
          </div>
          <div>
            {termsContent[language].sections.map((section, index) => (
              <div key={index} style={{ marginBottom: '2rem' }}>
                {section.title && (
                  <h2 style={{ 
                    color: 'var(--color-primary)', 
                    marginBottom: '1rem',
                    fontSize: '1.4rem',
                    fontWeight: '400'
                  }}>
                    {section.title}
                  </h2>
                )}
                <div>
                  {section.content.split('\n').map((paragraph, pIndex) => (
                    <p key={pIndex} style={{ 
                      marginBottom: '0.75rem',
                      color: 'var(--text-medium)',
                      lineHeight: '1.6'
                    }}>
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}