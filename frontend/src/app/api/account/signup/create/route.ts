import { IRegisterForm, IRegisterFormResponse } from "@/interfaces"
import { IdentityErrorCodeToMessage } from "@/utility";
import { NextRequest, NextResponse } from "next/server"

const apiURL = process.env.API_BACKEND_URL + "/api/account/create"

export async function POST(req : NextRequest) {
    let res : IRegisterFormResponse =  {IsValid: true, Errors: [] };
    const userForm : IRegisterForm = await req.json();
    const backendResponse = await fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm), 
    });

    if (!backendResponse.ok) {
        const data = await backendResponse.json(); 
        if (data.errors)
        {
            for (let i = 0; i < data.errors.length; i++) {
                let err : string = data.errors[i];
                res.Errors.push(IdentityErrorCodeToMessage(err));
            }
        }
    }

    console.log(res)

    return NextResponse.json(res, { status: backendResponse.status });;
}