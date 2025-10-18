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

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(errorText, { status: response.status });
        }

        const result = await response.json();
        return Response.json(result);
    } catch (error) {
        console.error('Middleware error:', error);
        return new Response('Server error', { status: 500 });
    }
}