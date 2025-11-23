"use client";
import React from "react";
import styles from "@/app/styles/page.module.css";
import Image, { StaticImageData } from "next/image";
import NotFoundImage from "@/app/images/not-found.png";
import { CartProductDTO } from "@/interfaces";
import { ProductEnumToString } from "@/utility";

interface images {
    alt: string;
    url: string | StaticImageData;
}

interface CartCardProps {
    product: CartProductDTO;
    changeValue: (id: number, amount: number) => void;
}

export default function CartCard({ product, changeValue }: CartCardProps) {
    let images: images;

    if (product.imagesData != null)
        images = { alt: product.imagesData.alt, url: product.imagesData.url };
    else
        images = { alt: "Picture of product : Image not found", url: NotFoundImage };

    return (
        <div
            className={`d-flex flex-row p-3 mb-4 ${styles.backgroundThird} rounded-4 shadow`}
            style={{ minHeight: "150px", transition: "transform 0.3s" }}
        >
            {/* Image */}
            <a href={`/shop/product/${product.id}`} className="text-decoration-none text-dark">
                <div style={{ width: "150px", height: "150px", position: "relative" }}>
                    <Image src={images.url} alt={images.alt} fill style={{ objectFit: "contain" }} />
                </div>
            </a>

            {/* Infos produit */}
            <div className="flex-grow-1 ms-4 d-flex flex-column justify-content-between">
                <div>
                    <a href={`/shop/product/${product.id}`} className="text-decoration-none text-dark">
                        <h5 className="fw-bold">{product.name}</h5>
                    </a>
                    <p className="text-secondary">{ProductEnumToString(product.status)}</p>
                </div>

                {/* Contrôle quantité */}
                <div className="d-flex align-items-center mt-2">
                    <button
                        onClick={() => changeValue(product.id, product.amount - 1)}
                        className={`${styles.submitButton} btn-sm me-2 p-1`}
                        style={{ width: "35px", height: "35px", padding: 0 }}
                    >
                        {product.amount === 1 ? <i className="bi bi-trash"></i> : <i className="bi bi-dash"></i>}
                    </button>

                    <span className="mx-2 fw-bold">{product.amount}</span>

                    <button
                        onClick={() => changeValue(product.id, product.amount + 1)}
                        className={`${styles.submitButton} btn-sm ms-2 p-1`}
                        style={{ width: "35px", height: "35px", padding: 0 }}
                        disabled={product.amount >= product.maxQuantity}
                    >
                        <i className="bi bi-plus"></i>
                    </button>

                    {product.amount >= product.maxQuantity && (
                        <span className="ms-2 text-danger" style={{ fontSize: "0.85rem" }}>
                            Quantité maximale atteinte
                        </span>
                    )}
                </div>
            </div>

            {/* Prix */}
            <div className="d-flex align-items-center ms-3">
                {product.discountPrice == null ? (
                    <p className="fs-5 fw-bold mb-0">{product.price.toFixed(2)}$</p>
                ) : (
                    <p className="fs-6 fw-bold mb-0">
                        <span className="text-decoration-line-through">{product.price.toFixed(2)}$</span>
                        <span className="text-danger ms-2">
                            {product.discountPrice.toFixed(2)}$ (-{(100 - product.discountPrice / product.price * 100).toFixed(0)}%)
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
}
