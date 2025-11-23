import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthCookieName } from "@/constants";

const backendUrl = process.env.API_BACKEND_URL;

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get(AuthCookieName);

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken.value}`;
        }

        const res = await fetch(`${backendUrl}/api/orders/check-auth`, {
            method: "POST",
            headers: headers,
        });

        const data = await res.json();
        return NextResponse.json(data, { status: 200 });

    } catch (err) {
        console.error("Next.js api/orders/check-auth error:", err);
        return NextResponse.json(
            { isAuthenticated: false },
            { status: 200 }
        );
    }
}