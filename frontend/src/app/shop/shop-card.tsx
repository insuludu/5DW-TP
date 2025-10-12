
"use client"
import React, { useState } from "react";
import styles from "@/app/styles/page.module.css"
import Image, { StaticImageData } from "next/image";
import NotFoundImage from "@/app/images/not-found.png"
import { ShopProductDTO } from "@/interfaces";

interface images {
    alt : string;
    url : string | StaticImageData
}

export default function ShopCard({product} : {product : ShopProductDTO}) {
    const [IsHovered, SetIsHovered] = useState(false);
    let images : images[];

    if (product.imagesData == null)
        images = [{alt: "Pictore of product 1 : Image not found", url: NotFoundImage}, {alt: "Pictore of product 2 : Image not found", url: NotFoundImage}]
    else if (product.imagesData.length == 1)
        images = [{alt: product.imagesData[0].alt, url: product.imagesData[0].url}, {alt: "Pictore of product 2 : Image not found", url: NotFoundImage}]
    else
        images = [{alt: product.imagesData[0].alt, url: product.imagesData[0].url}, {alt: product.imagesData[1].alt, url: product.imagesData[1].url}]

    return (
        <div style={{height: "550px", border: "solid 3px white"}} className={`d-flex flex-column overflow-hidden`} onMouseEnter={() => SetIsHovered(true)} onMouseLeave={() => SetIsHovered(false)}>
            <div className={`flex-grow-1 position-relative`}>
                <Image src={images[0].url} alt={images[0].alt} fill style={{objectFit: "cover", opacity: IsHovered ? "0" : "1", zIndex : "2" , transition: "opacity ease-in-out 0.3s"}}/>
                <Image src={images[1].url} alt={images[1].alt} fill style={{objectFit: "cover", opacity: IsHovered ? "1" : "0", zIndex : "1", position: "absolute", top: "0", left: "0", transition: "opacity ease-in-out 0.3s"}}/>
            </div>
            <div className={`p-3 flex-shrink-0 bg-white`}> 
                <p className={`fs-4 mb-0 text-truncate`}>{product.name}</p>
                {
                    product.discountedPrice == null ?
                        <p className={`fs-4 fw-bold mb-0`}>
                            {product.price.toFixed(2)}$
                        </p>
                    :
                        <p className={`fs-4 fw-bold mb-0`}>
                            <span className={`text-decoration-line-through`} >{product.price.toFixed(2)}$</span>
                            <span className={`text-danger`} > {product.discountedPrice.toFixed(2)}$ (-{(100 - product.discountedPrice / product.price * 100).toFixed(0)}%)</span>
                        </p>
                }
            </div>
        </div>
    );
}