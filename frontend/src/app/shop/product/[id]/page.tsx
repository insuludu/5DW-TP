import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { DetailProductDTO } from "@/interfaces";
import ProductGallery from "./product-gallery";

const nextUrl = process.env.API_MIDDLEWARE_URL;

async function GetProductById(id: string): Promise<DetailProductDTO> {
    const res = await fetch(`${nextUrl}/api/shop/product/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur lors du chargement du produit");
    return res.json();
}

export default async function Page({ params }: { params: { id: string } }) {
    const product = await GetProductById(params.id);

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <section className="container py-5 flex-grow-1">
                <div className="row g-4">
                    <div className="col-12 col-md-6 d-flex justify-content-center">
                        <ProductGallery images={product.imagesData ?? []} />
                    </div>

                    <div className="col-12 col-md-6">
                        <h1 className="fs-4 fs-md-2">{product.name}</h1>
                        <p className="text-muted fs-6 fs-md-5">
                            {product.discountedPrice ? (
                                <>
                                    <span className="text-decoration-line-through me-2">
                                        {product.price.toFixed(2)}$
                                    </span>
                                    <strong className="text-danger">
                                        {product.discountedPrice.toFixed(2)}$
                                    </strong>
                                </>
                            ) : (
                                <>{product.price.toFixed(2)}$</>
                            )}
                        </p>

                        <p className="fs-6 fs-md-5">
                            <strong>Disponibilité :</strong>{" "}
                            {product.status > 0 ? "En stock" : "Rupture"}
                        </p>

                        <p className="fs-6 fs-md-5">
                            <strong>Catégories :</strong>{" "}
                            {product.categories.map((c) => c.name).join(", ")}
                        </p>

                        {product.description && (
                            <div className="mt-4">
                                <h5 className="fs-6 fs-md-5">Description :</h5>
                                <p className="fs-6 fs-md-5">{product.description}</p>
                            </div>
                        )}

                        <button className="btn btn-dark mt-3" disabled={product.status <= 0}>
                            {product.status > 0 ? "Ajouter au panier" : "Indisponible"}
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}