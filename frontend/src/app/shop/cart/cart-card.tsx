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

    const unitPrice = product.discountPrice ?? product.price;
    const totalPrice = unitPrice * product.amount;

    return (
        <div
            className={`d-flex flex-column flex-md-row p-3 mb-4 ${styles.backgroundThird} rounded-4 shadow`}
            style={{ minHeight: "150px", transition: "transform 0.3s" }}
        >
            <div className="d-flex flex-row w-100">
                {/* Image */}
                <a href={`/shop/product/${product.id}`} className="text-decoration-none text-dark flex-shrink-0">
                    <div
                        className="position-relative"
                        style={{
                            width: "100px",
                            height: "100px",
                            minWidth: "100px"
                        }}
                    >
                        <Image src={images.url} alt={images.alt} fill style={{ objectFit: "contain" }} />
                    </div>
                </a>

                {/* Infos produit */}
                <div className="flex-grow-1 ms-3 d-flex flex-column justify-content-between min-w-0">
                    <div>
                        <a href={`/shop/product/${product.id}`} className="text-decoration-none text-dark">
                            <h5 className="fw-bold mb-1" style={{ fontSize: "1rem" }}>{product.name}</h5>
                        </a>
                        <p className="text-secondary mb-2" style={{ fontSize: "0.85rem" }}>
                            {ProductEnumToString(product.status)}
                        </p>
                    </div>

                    {/* Prix (mobile seulement) */}
                    <div className="d-md-none mb-2">
                        {product.discountPrice == null ? (
                            <p className="fs-6 fw-bold mb-0">{product.price.toFixed(2)}$</p>
                        ) : (
                            <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                                <span className="text-decoration-line-through me-2">{product.price.toFixed(2)}$</span>
                                <span className="text-danger fw-bold">
                                    {product.discountPrice.toFixed(2)}$ (-{(100 - product.discountPrice / product.price * 100).toFixed(0)}%)
                                </span>
                            </p>
                        )}
                        <p className="fw-bold mt-1 text-success">
                            Total : {totalPrice.toFixed(2)}$
                        </p>
                    </div>

                    {/* Contrôle quantité */}
                    <div className="d-flex align-items-center flex-wrap">
                        <div className="d-flex align-items-center">
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
                        </div>

                        {product.amount >= product.maxQuantity && (
                            <span className="ms-2 text-danger" style={{ fontSize: "0.85rem" }}>
                                Quantité maximale atteinte
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Prix (desktop seulement) */}
            <div className="d-none d-md-flex flex-column justify-content-center ms-3 flex-shrink-0 text-end">

                {/* Prix unitaire */}
                {product.discountPrice == null ? (
                    <p className="fs-5 fw-bold mb-1 text-nowrap">{product.price.toFixed(2)}$</p>
                ) : (
                    <p className="fs-6 fw-bold mb-1 text-nowrap">
                        <span className="text-decoration-line-through">{product.price.toFixed(2)}$</span>
                        <span className="text-danger ms-2">
                            {product.discountPrice.toFixed(2)}$ (-{(100 - product.discountPrice / product.price * 100).toFixed(0)}%)
                        </span>
                    </p>
                )}

                {/* 🟢 Prix total desktop */}
                <p className="fw-bold mt-1 fs-6 text-success">
                    Total : {totalPrice.toFixed(2)}$
                </p>
            </div>
        </div>
    );
}