
"use client"
import React, { useState } from "react";
import styles from "@/app/styles/page.module.css"
import Image, { StaticImageData } from "next/image";
import NotFoundImage from "@/app/images/not-found.png"
import { CartProductDTO, ShopProductDTO } from "@/interfaces";
import { ProductEnumToString } from "@/utility";
import { setFlagsFromString } from "v8";

interface images {
    alt: string;
    url: string | StaticImageData
}

interface CartCardProps {
    product: CartProductDTO;
    onSelectedChange: (id: number, selected: boolean) => void;
    changeValue: (id: number, amount: number) => void;
}

export default function CartCard({ product, onSelectedChange, changeValue }: CartCardProps) {
    const [Amount, setAmount] = useState(2);
    const [Selected, setSelected] = useState(Boolean);
    let images: images;

    if (product.imagesData != null)
        images = { alt: product.imagesData.alt, url: product.imagesData.url }
    else
        images = { alt: "Picture of product : Image not found", url: NotFoundImage }

    return (


        <div style={{ height: "250px", border: "solid 3px white" }} className={`d-flex row overflow-hidden`}>
            <div className="d-flex align-items-start mb-4">
                <a href={`/shop/product/${product.id}`} className="text-decoration-none text-dark" >
                    <div style={{ width: "200px", height: "250px", position: "relative" }}>
                        <Image src={images.url} alt={images.alt} fill style={{ objectFit: "contain" }} />
                    </div>
                </a>

                <div className="flex-grow-1 ms-3">
                    <div className="row align-items-center">
                        <div className="col-9">
                            <a href={`/shop/product/${product.id}`} className="text-decoration-none text-dark">
                                <h3>{product.name}</h3>
                            </a>
                            <p>{ProductEnumToString(product.status)}</p>
                            <div className="d-flex align-items-center justify-content-center px-3 py-1 mb-2 rounded-5 bg-danger text-white" style={{ width: "100px" }}>
                                <button
                                    onClick={() => changeValue(product.id, product.amount - 1)}
                                    className="text-white btn p-0 border-0 bg-transparent mx-2"
                                >
                                    {product.amount === 1 ? (
                                        <i className="bi bi-trash"></i>   // show trash when amount = 1
                                    ) : (
                                        <i className="bi bi-dash"></i>    // show minus otherwise
                                    )}
                                </button>

                                <span className="mx-2">{product.amount}</span>

                                <button
                                    onClick={() => changeValue(product.id, product.amount + 1)}
                                    className="text-xl text-white btn p-0 border-0 bg-transparent mx-2"
                                    disabled={product.amount >= product.maxQuantity }
                                >
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                                {product.amount >= product.maxQuantity ? <label className={` text-danger`}>Quantité maximal atteinte</label> : <></>}
                        </div>

                        <div className="col-3 d-flex justify-content-end">
                            {product.discountPrice == null ? (
                                <p className="fs-4 fw-bold mb-0">{product.price.toFixed(2)}$</p>
                            ) : (
                                <p className="fs-4 fw-bold mb-0">
                                    <span className="text-decoration-line-through">{product.price.toFixed(2)}$</span>
                                    <span className="text-danger">
                                        {" "} {product.discountPrice.toFixed(2)}$ (-{(100 - product.discountPrice / product.price * 100).toFixed(0)}%)
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}