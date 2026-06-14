"use client";

import { Download, Heart } from "lucide-react";
import { useState } from "react";

export type PhotoCategory = "Corporate" | "Creative" | "Outdoor" | "Medical";

interface PhotoCardProps {
  id: string;
  category: PhotoCategory;
  title: string;
  gradient: string;
  emoji: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export default function PhotoCard({
  id,
  category,
  title,
  gradient,
  emoji,
  isFavorite = false,
  onFavoriteToggle,
  onDownload,
}: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">{emoji}</div>
          <p className="text-label-sm font-semibold">{title}</p>
        </div>
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/80 to-transparent p-6 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-label-xs text-on-primary/70 mb-1">{category}</span>
        <p className="text-label-sm font-bold text-on-primary">{title}</p>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.(id);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              isFavorite
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.(id);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
