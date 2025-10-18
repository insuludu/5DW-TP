import { NextResponse } from "next/server";
import { CreateProductDTO } from "@/interfaces";

const apiURL = process.env.API_BACKEND_URL + "/api/product/CreateProduct/"

export async function POST(req: Request) {
    try {
        // Get the FormData from the request
        const formData = await req.formData();

        const response = await fetch(apiURL, {
            method: 'POST',
            body: formData, // Forward the FormData as-is
        });

        const text = await response.text();

        if (!response.ok) {
            const errorData = JSON.parse(text);


            return new Response(
                JSON.stringify({
                    status: response.status,
                    message: "Erreur lors de l'envoie du formulaire",
                    details: errorData,
                }),
                { status: response.status, headers: { "Content-Type": "application/json" } }
            );

        }

        let result = null;
        if (text) {
            try {
                result = JSON.parse(text);
            } catch {
                result = text;
            }
        }

        return new Response(JSON.stringify(result ?? { message: "OK" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error('Middleware error:', error);
        return new Response('Server error', { status: 500 });
    }
}