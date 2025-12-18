"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm from "./checkout-form";
import styles from "@/app/styles/page.module.css";

export default function CheckoutFlow() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    void checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuthentication() {
    try {
      setIsChecking(true);

      // EF21 - Vérifier le statut d'authentification
      const response = await fetch("/api/orders/check-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setShowAuthPrompt(false);
      } else {
        setIsAuthenticated(false);
        setShowAuthPrompt(true);
      }
    } catch {
      // En cas d’erreur réseau, on considère non-auth (tu peux ajuster si tu préfères)
      setIsAuthenticated(false);
      setShowAuthPrompt(true);
    } finally {
      setIsChecking(false);
    }
  }

  // Loader simple pendant la vérif
  if (isChecking || isAuthenticated === null) {
    return (
      <div className={styles.pageContainer ?? ""} style={{ padding: 24 }}>
        <h2 style={{ marginBottom: 8 }}>Vérification...</h2>
        <p>On vérifie si tu es connecté.</p>
      </div>
    );
  }

  // Popup si non connecté
  if (!isAuthenticated && showAuthPrompt) {
    return (
      <div
        style={{
          padding: 24,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: "100%",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h2 style={{ marginBottom: 8 }}>Connexion requise</h2>
          <p style={{ marginBottom: 16 }}>
            Tu dois être connecté pour passer une commande.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => router.push("/login?redirect=/checkout")}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
              }}
            >
              Se connecter
            </button>

            <button
              type="button"
              onClick={() => router.push("/register?redirect=/checkout")}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Créer un compte
            </button>

            <button
              type="button"
              onClick={() => router.push("/cart")}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Retour au panier
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Afficher le formulaire de commande
  return <CheckoutForm isAuthenticated={true} />;
}
