"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import styles from "@/app/styles/page.module.css";

interface OrderConfirmation {
  orderNumber: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    fullAddress: string;
  };
  items: Array<{
    productID: number;
    name: string;
    price: number;
    discountPrice?: number;
    finalPrice: number;
    quantity: number;
    total: number;
  }>;
  subTotal: number;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Empêche de vider le panier 2 fois (dev/refresh)
  const clearedCartRef = useRef(false);

  useEffect(() => {
    if (!params?.id) return;
    confirmAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  async function confirmAndLoad() {
    try {
      setLoading(true);
      setError("");

      // 1️⃣ Confirmer le paiement Stripe (si session_id présent)
      if (sessionId) {
        const confirmRes = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: Number(params.id),
            sessionId: sessionId,
          }),
        });

        const confirmData = await confirmRes.json().catch(() => null);

        if (!confirmRes.ok) {
          throw new Error(
            confirmData?.message || "Erreur lors de la confirmation du paiement"
          );
        }

        // ✅ Paiement réussi => vider le panier UNE seule fois
        if (confirmData?.success === true && !clearedCartRef.current) {
          clearedCartRef.current = true;

          // on essaie de vider le panier, mais si ça échoue on n'empêche pas l'affichage
          try {
            await fetch("/api/shop/cart/clear", { method: "POST" });
          } catch (e) {
            console.warn("Impossible de vider le panier:", e);
          }
        }
      }

      // 2️⃣ Charger la confirmation de commande
      const res = await fetch(`/api/orders/${params.id}/confirmation`);
      if (!res.ok) {
        throw new Error("Commande introuvable");
      }

      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      console.error("Erreur confirmation commande:", err);
      setError(err.message || "Erreur lors du chargement de la commande");
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     UI STATES
  ========================= */

  if (loading) {
    return (
      <div>
        <Header />
        <div
          className={`min-vh-100 ${styles.backgroundPrimary} d-flex align-items-center justify-content-center`}
        >
          <p className="text-light">Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Header />
        <div
          className={`min-vh-100 ${styles.backgroundPrimary} d-flex align-items-center justify-content-center`}
        >
          <div className="text-center">
            <p className="text-danger fs-4 mb-4">
              {error || "Commande introuvable"}
            </p>
            <button
              onClick={() => router.push("/")}
              className={styles.submitButton}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* =========================
     UI SUCCESS
  ========================= */

  return (
    <div>
      <Header />
      <section className={`min-vh-100 ${styles.backgroundPrimary} py-5`}>
        <div className="container">
          {/* En-tête */}
          <div className="text-center mb-5">
            <i
              className="bi bi-check-circle-fill text-success mb-4"
              style={{ fontSize: "4rem" }}
            />
            <h1 className="display-4 text-light mb-3">Paiement réussi 🎉</h1>
            <p className="text-light fs-5">
              Merci pour votre commande. Un courriel de confirmation a été envoyé
              à<strong> {order.customer.email}</strong>
            </p>
          </div>

          <div className="row g-4">
            {/* Détails */}
            <div className="col-lg-8">
              <div
                className={`p-4 ${styles.backgroundThird} rounded-4 shadow mb-4`}
              >
                <h3 className="mb-4">Détails de la commande</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <p className="text-secondary mb-1">Numéro de commande</p>
                    <p className="fs-5 fw-bold mb-0">{order.orderNumber}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-secondary mb-1">Date</p>
                    <p className="fs-5 fw-bold mb-0">
                      {new Date(order.createdAt).toLocaleDateString("fr-CA")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Client */}
              <div
                className={`p-4 ${styles.backgroundThird} rounded-4 shadow mb-4`}
              >
                <h3 className="mb-4">Informations de livraison</h3>
                <p className="mb-1 fw-bold">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="mb-1">{order.customer.email}</p>
                <p className="mb-1">{order.customer.phoneNumber}</p>
                <p className="mb-0 text-secondary">{order.customer.fullAddress}</p>
              </div>

              {/* Articles */}
              <div className={`p-4 ${styles.backgroundThird} rounded-4 shadow`}>
                <h3 className="mb-4">Articles commandés</h3>

                {order.items.map((item) => (
                  <div
                    key={item.productID}
                    className="d-flex justify-content-between border-bottom py-3"
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <div className="text-secondary">
                        Quantité : {item.quantity}
                      </div>
                    </div>
                    <div className="fw-bold">{item.total.toFixed(2)} $</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Résumé */}
            <div className="col-lg-4">
              <div
                className={`p-4 ${styles.backgroundThird} rounded-4 shadow sticky-top`}
                style={{ top: "20px" }}
              >
                <h3 className="mb-4">Résumé</h3>

                <div className="d-flex justify-content-between mb-3">
                  <span>Sous-total</span>
                  <span className="fw-bold">{order.subTotal.toFixed(2)} $</span>
                </div>

                <div className="d-flex justify-content-between fs-4 fw-bold border-top pt-3">
                  <span>Total payé</span>
                  <span>{order.subTotal.toFixed(2)} $</span>
                </div>

                <div className="mt-4 pt-4 border-top">
                  <button
                    onClick={() => router.push("/")}
                    className={`${styles.submitButton} w-100 mb-3`}
                  >
                    Retour à l'accueil
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn btn-outline-secondary w-100"
                  >
                    Imprimer le reçu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
