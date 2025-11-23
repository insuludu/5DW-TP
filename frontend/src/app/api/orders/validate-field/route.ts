import { NextResponse } from "next/server";

const backendUrl = process.env.API_BACKEND_URL;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const res = await fetch(`${backendUrl}/api/orders/validate-field`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: 200 });

    } catch (err) {
        console.error("Next.js api/orders/validate-field error:", err);
        return NextResponse.json(
            { isValid: false, errors: ["Erreur de validation"] },
            { status: 500 }
        );
    }
}