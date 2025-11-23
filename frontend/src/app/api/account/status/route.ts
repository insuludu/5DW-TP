import { NextRequest, NextResponse } from "next/server";

const apiURL = process.env.API_BACKEND_URL + "/api/account/status";

export async function GET(req: NextRequest) {
    const cookies = req.headers.get('cookie');
    
    try {
        const backendResponse = await fetch(apiURL, {
            method: "GET",
            headers: {
                'Cookie': cookies || '',
            },
        });

        return NextResponse.json({
            isAuthenticated: backendResponse.ok
        });
    } catch (error) {
        return NextResponse.json({
            isAuthenticated: false
        });
    }
}