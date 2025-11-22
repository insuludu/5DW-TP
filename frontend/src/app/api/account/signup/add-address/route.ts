import { IAddress, IAddressFormResponse } from "@/interfaces";
import { IdentityErrorCodeToMessage } from "@/utility";
import { NextRequest, NextResponse } from "next/server"

const apiURL = process.env.API_BACKEND_URL + "/api/account/addAddress"

export async function POST(req: NextRequest) {
    let res: IAddressFormResponse = { IsValid: true, Errors: [] };
    const addressForm: IAddress = await req.json();
    const cookies = req.headers.get('cookie')
    const backendResponse = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Cookie': cookies || '',
        },
        body: JSON.stringify(addressForm),
    });

    if (!backendResponse.ok) {
        const text = await backendResponse.text();
        if (text) {
            try {
                const data = JSON.parse(text);
                if (data.errors) 
                {
                    for (let i = 0; i < data.errors.length; i++) {
                        let err : string = data.errors[i];
                        res.Errors.push(IdentityErrorCodeToMessage(err));
                    }
                }
            } catch (e) {
                res.Errors.push("Une erreur est survenue");
            }
        }
    }

    return NextResponse.json(res, { status: backendResponse.status });
}