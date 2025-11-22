import { IUserData } from "@/interfaces";
import { NextRequest, NextResponse } from "next/server"

const apiURL = process.env.API_BACKEND_URL + "/api/account/ValidateToken"

export async function GET(req : NextRequest) {
    const cookies = req.headers.get('cookie')
    const backendResponse = await fetch(apiURL, {
        method: "GET",
        headers: {
            'Cookie': cookies || '',
        },
    });

    let status : number = 200;
    let res : IUserData = await backendResponse.json();

    if (!backendResponse.ok) {
        status = 401;
    }

    return NextResponse.json(res, { status: status });
}