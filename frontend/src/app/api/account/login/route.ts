import { ILoginForm, IRegisterFormResponse } from "@/interfaces";
import { NextRequest, NextResponse } from "next/server";

const apiURL = process.env.API_BACKEND_URL + "/api/account/login"

export async function POST(req : NextRequest) {
    let res: IRegisterFormResponse = { IsValid: true, Errors: [] };
    let loginForm : ILoginForm = await req.json();

    const backendResponse = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
    });

    if (!backendResponse.ok) {
        res.Errors.push("Connexion Invalide")
        res.IsValid = false;
        return NextResponse.json(res, { status: backendResponse.status });
    }
    else {
        const nextResponse = NextResponse.json(
            { message: 'Login successful' },
            { status: 200 }
        );
    
        const setCookieHeaders = backendResponse.headers.get('Set-Cookie');

        if (setCookieHeaders) {
            nextResponse.headers.set('Set-Cookie', setCookieHeaders);
        }

        return nextResponse;
    }
}