import { NextResponse } from "next/server";
import { CreateProductDTO } from "@/interfaces";

const backendUrl = process.env.API_BACKEND_URL + "/api/product/GetEditProduct/";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  console.log(`${backendUrl}${id}`);

  try {
    const res = await fetch(`${backendUrl}${id}`);

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Erreur lors du fetch du produit", details: errorText },
        { status: res.status }
      );
    }

    
    const data: CreateProductDTO = await res.json();
    return NextResponse.json(data);
  } 
  catch (err) {
    console.log("Error fetching product:", err);
    return NextResponse.json({ error: "Erreur lors du fetch du produit" }, { status: 500 } );
  }
}
