import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { DetailProductDTO } from "@/interfaces";
import ProductClient from "./product-client";

const nextUrl = process.env.API_MIDDLEWARE_URL;

async function GetProductById(id: string): Promise<DetailProductDTO> {
    const res = await fetch(`${nextUrl}/api/shop/product/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur lors du chargement du produit");
    return res.json();
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params; // Await params directly
    const product = await GetProductById(params.id);

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <ProductClient product={product} />
            <Footer />
        </div>
    );
}