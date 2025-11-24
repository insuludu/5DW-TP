import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthCookieName } from "@/constants";

const backendUrl = process.env.API_BACKEND_URL;

export async function POST(req: Request) {
    try {
        const body = await req.json(); // expects {id: string} from frontend
        const orderNumber = body.id;

        if (!orderNumber || typeof orderNumber !== "string") {
            return NextResponse.json({ message: "Numéro commande manquant" }, { status: 400 });
        }

        const res = await fetch(`${backendUrl}/api/Orders/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderNumber) // send string, not object
        });

        return NextResponse.json({ status: res.status });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
    }
}
