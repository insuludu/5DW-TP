
"use client"
import React, { useState } from "react";
import styles from "@/app/styles/page.module.css"
import Image from "next/image";
import ImageOrder0 from "@/app/images/template-shop-item-image-0.png"
import ImageOrder1 from "@/app/images/template-shop-item-image-1.png"



export default function ShopCard() {
    const [IsHovered, SetIsHovered] = useState(false);

    return (
        <div style={{height: "550px"}} className={`d-flex flex-column`} onMouseEnter={() => SetIsHovered(true)} onMouseLeave={() => SetIsHovered(false)}>
            <div className={`flex-grow-1 position-relative`}>
                <Image src={ImageOrder0} alt="Pictore of product 1" fill style={{objectFit: "cover", opacity: IsHovered ? "0" : "1", zIndex : "2" , transition: "opacity ease-in-out 0.3s"}}/>
                <Image src={ImageOrder1} alt="Pictore of product 2" fill style={{objectFit: "cover", opacity: IsHovered ? "1" : "0", zIndex : "1", position: "absolute", top: "0", left: "0", transition: "opacity ease-in-out 0.3s"}}/>
            </div>
            <div className={`p-3 flex-shrink-0 bg-white`}> 
                <p className={`fs-4 mb-0 text-truncate`}>Product Name</p>
                <p className={`fs-4 fw-bold mb-0`}>19.99$</p>
            </div>
        </div>
    );
}