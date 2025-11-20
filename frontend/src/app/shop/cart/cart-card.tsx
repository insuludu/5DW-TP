
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

export default function CartCard({ product }: { product: CartProductDTO }) {
    const [Amount, setAmount] = useState(2);
    let images: images;

    const changeValue = (value: number) => {
        setAmount(Math.max(1, Amount + value));
    }

    if (product.imagesData != null)
        images = { alt: product.imagesData.alt, url: product.imagesData.url }
    else
        images = { alt: "Picture of product : Image not found", url: NotFoundImage }

    return (


        <div style={{ height: "250px", border: "solid 3px white" }} className={`d-flex row overflow-hidden`}>
            <div className="col-12 col-md-4 col-lg-4 w-25 position-relative" style={{ height: "250px" }}>
                <a
                    href={`/shop/product/${product.id}`}
                    className="text-decoration-none text-dark"
                    style={{ height: "250px" }}
                >
                    <Image
                        src={images.url}
                        alt={images.alt}
                        fill
                        style={{ objectFit: "cover", zIndex: 2 }}
                    />
                </a>
            </div>
            <div className={`col-12 col-md-6 col-lg-6`}>
                <a
                    href={`/shop/product/${product.id}`}
                    className="text-decoration-none text-dark"
                    style={{ height: "250px" }}
                >
                    <h3 className={` col-12`}>{product.name}</h3>
                </a>

                <p className={` col-12`}>{ProductEnumToString(product.status)}</p>
                <div className="flex items-center justify-between w-24 px-3 py-1 border-4 border-yellow-400 rounded-full font-bold">
                    <button onClick={() => changeValue(-1)} className="text-xl">
                        -
                    </button>

                    <span>{Amount}</span>

                    <button
                        onClick={() => changeValue(1)}
                        className="text-xl"
                    >
                        +
                    </button>
                </div>
            </div>
            <div className={`col-12 col-md-2 col-lg-2`}>
                <p className={`fs-4 mb-0 text-truncate col-12`}>Prix : </p>
                {
                    product.discountedPrice == null ?
                        <p className={`fs-4 fw-bold mb-0 col-12`}>
                            {product.price.toFixed(2)}$
                        </p>
                        :
                        <p className={`fs-4 fw-bold mb-0 col-12`}>
                            <span className={`text-decoration-line-through`} >{product.price.toFixed(2)}$</span>
                            <span className={`text-danger`} > {product.discountedPrice.toFixed(2)}$ (-{(100 - product.discountedPrice / product.price * 100).toFixed(0)}%)</span>
                        </p>
                }
            </div>
        </div>
    );
}