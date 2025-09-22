"use client";
import styles from '../styles/page.module.css'
import Image from "next/image";

import dollo from "../images/logos/dollorama.png";
import gamestop from "../images/logos/GameStop-logo.png";
import imaginaire from "../images/logos/imaginaire.png";
import wallmart from "../images/logos/wallmart.png";
import zonecollection from "../images/logos/zoneCollection.png";

const images = [
    dollo,
    gamestop,
    imaginaire,
    wallmart,
    zonecollection
];

export default function ConfidenceIndex() {
    return (
        <section className={`pb-5 pt-5 ${styles.backgroundThird}`}>
            <div className={` text-center row mb-3`}>
                <h1>Ces compagnies nous font confiance.</h1>
            </div>
            <div className=" row h-52 px-5 d-flex align-content-center">
                {images.map((src, i) => (
                    <div key={i} className="col ">
                        <Image
                            src={src}
                            alt={`Image ${i}`}
                            width={208}
                            height={208}
                            className="object-cover rounded-xl"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
} 