import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthCookieName } from "@/constants";

const backendUrl = process.env.API_BACKEND_URL;

export async function POST(req: NextRequest) {
  try {
    console.log("=== API Route: POST /api/payments/checkout-session ===");

    if (!backendUrl) {
      return NextResponse.json(
        { message: "API_BACKEND_URL est manquant dans .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { orderId } = body ?? {};

    if (!orderId) {
      return NextResponse.json(
        { message: "orderId est requis" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const authToken = cookieStore.get(AuthCookieName);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken.value}`;
    }

    const url = `${backendUrl}/api/payments/checkout-session`;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ orderId: Number(orderId) }),
    });

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Backend returned non-JSON:", text.substring(0, 500));
      return NextResponse.json(
        { message: "Erreur serveur: réponse invalide" },
        { status: 500 }
      );
    }

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // backend retourne { url: "https://checkout.stripe.com/..." }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Erreur API payments/checkout-session:", err);
    return NextResponse.json(
      {
        message:
          "Erreur lors de la création de la session de paiement: " +
          (err instanceof Error ? err.message : String(err)),
      },
      { status: 500 }
    );
  }
}
