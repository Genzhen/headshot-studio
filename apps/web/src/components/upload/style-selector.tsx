"use client";

import { Check } from "lucide-react";
import { useState } from "react";

export type StyleType = "EXECUTIVE" | "CREATIVE" | "OUTDOOR";

interface Style {
  id: StyleType;
  name: string;
  description: string;
  gradient: string;
}

const styles: Style[] = [
  {
    id: "EXECUTIVE",
    name: "Executive Suite",
    description: "Premium corporate aesthetic with sharp tailoring",
    gradient: "from-primary-container to-primary",
  },
  {
    id: "CREATIVE",
    name: "Creative Studio",
    description: "Vibrant artistic lighting in minimalist loft",
    gradient: "from-secondary-container to-secondary",
  },
  {
    id: "OUTDOOR",
    name: "Outdoor Casual",
    description: "Natural golden-hour lighting in park setting",
    gradient: "from-tertiary-container to-tertiary",
  },
];

interface StyleSelectorProps {
  value?: StyleType;
  onChange?: (style: StyleType) => void;
}

export default function StyleSelector({ value = "EXECUTIVE", onChange }: StyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<StyleType>(value);

  const handleSelect = (styleId: StyleType) => {
    setSelectedStyle(styleId);
    onChange?.(styleId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h3 className="text-headline-md font-heading text-primary">Pre-select Preferred Style</h3>
        <a href="#" className="text-label-sm text-secondary hover:underline">
          View all styles
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {styles.map((style) => {
          const isSelected = selectedStyle === style.id;

          return (
            <label
              key={style.id}
              className={`group relative cursor-pointer ${isSelected ? "ring-4 ring-secondary-container/10" : ""}`}
            >
              <input
                type="radio"
                name="style-select"
                value={style.id}
                checked={isSelected}
                onChange={() => handleSelect(style.id)}
                className="peer hidden"
              />

              <div
                className={`overflow-hidden rounded-xl border-2 transition-all ${
                  isSelected ? "border-secondary-container" : "border-transparent"
                }`}
              >
                <div className={`aspect-[4/3] relative bg-gradient-to-br ${style.gradient}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">
                        {style.id === "EXECUTIVE" ? "💼" : style.id === "CREATIVE" ? "🎨" : "🌿"}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-label-sm font-semibold">{style.name}</p>
                  </div>
                </div>
              </div>

              {/* Check Badge */}
              <div
                className={`absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-md transition-all ${
                  isSelected ? "flex" : "hidden"
                }`}
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
