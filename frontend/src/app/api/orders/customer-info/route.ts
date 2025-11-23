import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthCookieName } from "@/constants";

const backendUrl = process.env.API_BACKEND_URL;

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get(AuthCookieName);

        if (!authToken) {
            return NextResponse.json(
                { message: "Non authentifié" },
                { status: 401 }
            );
        }

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken.value}`,
        };

        const res = await fetch(`${backendUrl}/api/orders/customer-info`, {
            method: "GET",
            headers: headers,
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (err) {
        console.error("Next.js api/orders/customer-info error:", err);
        return NextResponse.json(
            { message: "Erreur lors de la récupération des informations" },
            { status: 500 }
        );
    }
}