import { NextResponse } from "next/server";

const backendUrl = process.env.API_BACKEND_URL;

export async function POST(req: Request) {
    try {
        // Parse the incoming form data
        const formData = await req.formData();
        const ordernumber = formData.get("ordernumber");

        if (!ordernumber || typeof ordernumber !== "string") {
            return NextResponse.json(
                { message: "Missing or invalid 'ordernumber'" },
                { status: 400 }
            );
        }

        console.log("Fetching order number:", ordernumber);

        // Call backend
        const res = await fetch(`${backendUrl}/api/Orders/getOrdersByNumber`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ordernumber)
        });

        // Check for HTTP errors from backend
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            console.error("Backend error:", errorData);
            return NextResponse.json(
                { message: "Backend returned an error", details: errorData },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 200 });

    } catch (err) {
        console.error("Error in API route:", err);
        return NextResponse.json(
            {
                message: "Internal server error",
                details: err instanceof Error ? err.message : String(err)
            },
            { status: 500 }
        );
    }
}
