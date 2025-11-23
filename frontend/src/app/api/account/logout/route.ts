import { NextRequest, NextResponse } from "next/server";

const apiURL = process.env.API_BACKEND_URL + "/api/account/logout";

export async function POST(req: NextRequest) {
    const cookies = req.headers.get('cookie');
    
    try {
        const backendResponse = await fetch(apiURL, {
            method: "POST",
            headers: {
                'Cookie': cookies || '',
            },
        });

        const nextResponse = NextResponse.json(
            { success: backendResponse.ok },
            { status: backendResponse.ok ? 200 : 500 }
        );

        // Supprimer le cookie côté client aussi
        nextResponse.cookies.set('authToken', '', {
            maxAge: 0,
            path: '/',
        });

        return nextResponse;
    } catch (error) {
        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}