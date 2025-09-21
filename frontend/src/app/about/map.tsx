// components/MapEmbed.tsx
import React from "react";

interface MapEmbedProps {
  width?: string;
  height?: string;
}

const MapEmbed: React.FC<MapEmbedProps> = ({ width = "100%", height = "400px" }) => {
  const src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1032.1039060830133!2d106.53809781725697!3d29.528893439203046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x369334d444158765%3A0xf2a833c3429cf58c!2sShangxin%20Supermarket!5e0!3m2!1sfr!2sca!4v1758417030450!5m2!1sfr!2sca`;
  
  return (
    <iframe
      src={src}
      width={width}
      height={height}
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Google Map"
    />
  );
};

export default MapEmbed;