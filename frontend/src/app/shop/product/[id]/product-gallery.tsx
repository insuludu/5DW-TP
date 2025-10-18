"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageDTO } from "@/interfaces";

export default function ProductGallery({ images }: { images: ImageDTO[] }) {
    const [selectedImage, setSelectedImage] = useState<ImageDTO>(
        images[0] || { id: 0, url: "", alt: "", order: 0 }
    );

    return (
        <div className="d-flex flex-row">
            <div className="d-flex flex-column align-items-center me-3" style={{ gap: "10px" }}>
                {images.map((img) => (
                    <div
                        key={img.id}
                        onClick={() => setSelectedImage(img)}
                        style={{
                            cursor: "pointer",
                            border:
                                selectedImage.id === img.id
                                    ? "2px solid #000"
                                    : "1px solid #ccc",
                            borderRadius: "6px",
                            overflow: "hidden",
                        }}
                    >
                        <Image
                            src={img.url}
                            alt={img.alt}
                            width={70}
                            height={70}
                            style={{
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="flex-grow-1 text-center">
                <Image
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    width={450}
                    height={450}
                    className="img-fluid rounded shadow-sm"
                    style={{ objectFit: "contain", maxHeight: "500px" }}
                />
            </div>
        </div>
    );
}