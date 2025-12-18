"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import styles from "@/app/styles/page.module.css";
import { CartProductDTO } from "@/interfaces";

interface CheckoutFormProps {
  isAuthenticated: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
}

async function safeJson(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Erreur serveur: réponse invalide (status ${res.status}). Début: ${text.substring(
        0,
        120
      )}`
    );
  }
  return res.json();
}

export default function CheckoutForm({ isAuthenticated }: CheckoutFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    clearErrors,
    watch,
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      province: "",
      country: "Canada",
      postalCode: "",
    },
  });

  const [cartItems, setCartItems] = useState<CartProductDTO[]>([]);
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const validationTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    loadCartItems();
    if (isAuthenticated) loadCustomerInfo();

    return () => {
      Object.values(validationTimers.current).forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  async function loadCartItems() {
    try {
      const res = await fetch("/api/shop/cart/products");
      const data = await safeJson(res);
      setCartItems(data);

      if (Array.isArray(data) && data.length === 0) {
        router.push("/shop/cart");
      }
    } catch (e: any) {
      console.error(e);
      setGeneralError(e.message || "Erreur lors du chargement du panier");
    }
  }

  async function loadCustomerInfo() {
    try {
      const res = await fetch("/api/orders/customer-info");
      if (!res.ok) return;
      const data = await safeJson(res);
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof FormData, value as string);
      });
    } catch {
      // silencieux
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setGeneralError("");

    try {
      if (!cartItems || cartItems.length === 0) {
        setGeneralError("Votre panier est vide.");
        router.push("/shop/cart");
        return;
      }

      /* ================================
         CRÉATION DE LA COMMANDE
      ================================= */
      const orderPayload = {
        ...data,
        cartItems: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.amount,
        })),
      };

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const orderJson = await safeJson(orderRes);

      if (!orderRes.ok) {
        setGeneralError(orderJson.message || "Erreur lors de la création de la commande");
        return;
      }

      // Supporte plusieurs formats possibles
      const orderId =
        orderJson.orderID ?? orderJson.orderId ?? orderJson.id ?? orderJson.order?.orderID;

      if (!orderId) {
        throw new Error("Commande créée, mais orderId introuvable dans la réponse.");
      }

      /* ================================
         CRÉATION SESSION STRIPE
      ================================= */
      const payRes = await fetch("/api/payments/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: Number(orderId) }),
      });

      const payJson = await safeJson(payRes);

      if (!payRes.ok) {
        throw new Error(payJson.message || "Impossible de démarrer le paiement Stripe");
      }

      if (!payJson?.url) {
        throw new Error("Réponse Stripe invalide: url manquante");
      }

      /* ================================
         REDIRECTION STRIPE
      ================================= */
      window.location.href = payJson.url;
    } catch (err: any) {
      console.error(err);
      setGeneralError(err.message || "Une erreur est survenue");
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.discountPrice ?? item.price;
    return sum + price * item.amount;
  }, 0);

  return (
    <section className={`min-vh-100 ${styles.backgroundPrimary} py-5`}>
      <div className="container">
        <h1 className="display-4 text-light text-center mb-5">
          Informations de livraison
        </h1>

        {generalError && (
          <div className="alert alert-danger text-center mb-4">{generalError}</div>
        )}

        {/* Tu peux remettre tes champs ici (tu les as retirés dans l'extrait).
            Je laisse la structure intacte pour ton bouton Stripe. */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <button
            type="submit"
            className={`${styles.submitButton} w-100 py-3`}
            disabled={loading || isSubmitting}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Redirection vers Stripe...
              </>
            ) : (
              "Procéder au paiement"
            )}
          </button>
        </form>

        <div className="text-center text-secondary mt-3">Paiement sécurisé via Stripe</div>

        <div className="text-center text-light mt-4 fs-5">
          Total : <strong>{subtotal.toFixed(2)} $</strong>
        </div>
      </div>
    </section>
  );
}
