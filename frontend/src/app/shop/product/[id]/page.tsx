import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { DetailProductDTO } from "@/interfaces";
import ProductGallery from "./product-gallery";
import AddToCartButton from "./cartbutton";

const nextUrl = process.env.API_MIDDLEWARE_URL;

async function GetProductById(id: string): Promise<DetailProductDTO> {
    const res = await fetch(`${nextUrl}/api/shop/product/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur lors du chargement du produit");
    return res.json();
}

function getStatusLabel(status: number) {
    switch (status) {
        case 0:
            return "En stock";
        case 1:
            return "Indisponible";
        case 2:
            return "Rupture de stock";
        case 3:
            return "Bientôt disponible";
        default:
            return "Statut inconnu";
    }
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
                        {/* En-tête de produit */}
                        <div className="mb-4">
                            <h1 className="fs-2 fw-bold mb-3">{product.name}</h1>

                            {/* Statut et stock */}
                            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                                <span className={`badge ${product.status === 0 ? 'bg-success' : 'bg-secondary'} fs-6`}>
                                    {getStatusLabel(product.status)}
                                </span>

                                {product.unitsInStock !== undefined && (
                                    <>
                                        <span className="text-muted">
                                            <strong>{product.unitsInStock}</strong> unités disponibles
                                        </span>
                                        {product.unitsInStock <= 5 && product.unitsInStock > 0 && (
                                            <span className="badge bg-danger">
                                                Derniers exemplaires !
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Prix */}
                            <div className="fs-3">
                                {product.discountedPrice ? (
                                    <>
                                        <span className="text-decoration-line-through text-muted me-3 fs-5">
                                            {product.price.toFixed(2)}$
                                        </span>
                                        <strong className="text-danger">
                                            {product.discountedPrice.toFixed(2)}$
                                        </strong>
                                    </>
                                ) : (
                                    <strong>{product.price.toFixed(2)}$</strong>
                                )}
                            </div>
                        </div>

                        {/* Catégories */}
                        <div className="mb-4 pb-2">
                            <h6 className="text-muted mb-2">Catégories</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {product.categories && product.categories.length > 0 ? (
                                    product.categories.map((c, index) => (
                                        <span key={index} className="badge bg-light text-dark border">
                                            {c.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-muted">Aucune catégorie</span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="mb-4">
                                <h5 className="fw-semibold mb-3 pb-2 border-bottom">Description</h5>
                                <p className="text-muted lh-lg">{product.description}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="d-grid gap-2">
                            <AddToCartButton productId={product.id} maxQuantity={product.unitsInStock} />
                            <a
                                href={`/edit-product?id=${product.id}`}
                                className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                                Modifier le produit
                            </a>
                        </div>

                        {/* <button className="btn btn-dark mt-3" disabled={product.status !== 0}>
                                {product.status === 0 ? "Ajouter au panier" : "Indisponible"}
                            </button> */}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}