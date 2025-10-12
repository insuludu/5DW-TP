
"use client"
import React, { useState } from "react";
import styles from "@/app/styles/page.module.css"
import Image from "next/image";
import ImageOrder0 from "@/app/images/template-shop-item-image-0.png"
import ImageOrder1 from "@/app/images/template-shop-item-image-1.png"
import Image2Order0 from "@/app/images/template-shop-item2-image-0.png"
import Image2Order1 from "@/app/images/template-shop-item2-image-1.png"



export default function ShopCard({index} : {index : number}) {
    const [IsHovered, SetIsHovered] = useState(false);

    return (
        <div style={{height: "550px", border: "solid 3px white"}} className={`d-flex flex-column overflow-hidden`} onMouseEnter={() => SetIsHovered(true)} onMouseLeave={() => SetIsHovered(false)}>
            <div className={`flex-grow-1 position-relative`}>
                <Image src={index % 2 == 0 ? ImageOrder1 : Image2Order1} alt="Pictore of product 1" fill style={{objectFit: "cover", opacity: IsHovered ? "0" : "1", zIndex : "2" , transition: "opacity ease-in-out 0.3s"}}/>
                <Image src={index % 2 == 0 ? ImageOrder0 : Image2Order0} alt="Pictore of product 2" fill style={{objectFit: "cover", opacity: IsHovered ? "1" : "0", zIndex : "1", position: "absolute", top: "0", left: "0", transition: "opacity ease-in-out 0.3s"}}/>
            </div>
            <div className={`p-3 flex-shrink-0 bg-white`}> 
                <p className={`fs-4 mb-0 text-truncate`}>Product Name</p>
                <p className={`fs-4 fw-bold mb-0`}>19.99$</p>
            </div>
        </div>
    );
}