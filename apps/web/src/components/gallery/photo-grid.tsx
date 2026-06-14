"use client";

import { useState } from "react";

import FilterBar from "./filter-bar";
import PhotoCard, { type PhotoCategory } from "./photo-card";

interface Photo {
  id: string;
  category: PhotoCategory;
  title: string;
  gradient: string;
  emoji: string;
}

const samplePhotos: Photo[] = [
  {
    id: "1",
    category: "Corporate",
    title: "Executive Profile",
    gradient: "from-primary-container to-primary",
    emoji: "💼",
  },
  {
    id: "2",
    category: "Creative",
    title: "Art Director",
    gradient: "from-secondary-container to-secondary",
    emoji: "🎨",
  },
  {
    id: "3",
    category: "Outdoor",
    title: "Entrepreneur",
    gradient: "from-tertiary-container to-tertiary",
    emoji: "",
  },
  {
    id: "4",
    category: "Medical",
    title: "Specialist Surgeon",
    gradient: "from-blue-600 to-blue-800",
    emoji: "️",
  },
  {
    id: "5",
    category: "Corporate",
    title: "Senior Consultant",
    gradient: "from-slate-700 to-slate-900",
    emoji: "",
  },
  {
    id: "6",
    category: "Creative",
    title: "UX Architect",
    gradient: "from-purple-600 to-purple-800",
    emoji: "🖌️",
  },
  {
    id: "7",
    category: "Medical",
    title: "Research Lead",
    gradient: "from-cyan-600 to-cyan-800",
    emoji: "🔬",
  },
  {
    id: "8",
    category: "Corporate",
    title: "Founding Partner",
    gradient: "from-gray-700 to-gray-900",
    emoji: "🤝",
  },
];

export default function PhotoGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredPhotos =
    activeCategory === "All"
      ? samplePhotos
      : samplePhotos.filter((photo) => photo.category === activeCategory);

  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDownload = (id: string) => {
    console.log("Download photo:", id);
    // TODO: Implement download via tRPC
  };

  return (
    <div>
      <FilterBar
        categories={["All", "Corporate", "Creative", "Outdoor", "Medical"]}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="grid grid-cols-2 gap-[var(--spacing-gutter)] transition-all duration-500 md:grid-cols-3 lg:grid-cols-4">
        {filteredPhotos.map((photo) => (
          <PhotoCard
            key={photo.id}
            id={photo.id}
            category={photo.category}
            title={photo.title}
            gradient={photo.gradient}
            emoji={photo.emoji}
            isFavorite={favorites.has(photo.id)}
            onFavoriteToggle={handleFavoriteToggle}
            onDownload={handleDownload}
          />
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-body-lg text-on-surface-variant">No photos found in this category.</p>
        </div>
      )}
    </div>
  );
}
