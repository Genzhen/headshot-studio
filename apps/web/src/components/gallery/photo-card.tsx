"use client";

import { useState } from "react";

export type PhotoCategory = "Corporate" | "Creative" | "Outdoor" | "Medical";

interface PhotoCardProps {
  category: PhotoCategory;
  title: string;
  image: string;
}

export default function PhotoCard({ category, title, image }: PhotoCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={image} alt={title} className="h-full w-full object-cover" />
      <div
        className={`image-overlay absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="mb-1 text-label-sm text-white/70">{category}</span>
        <p className="text-label-sm font-bold text-white">{title}</p>
      </div>
    </div>
  );
}
