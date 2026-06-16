"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export type StyleType = "EXECUTIVE" | "CREATIVE" | "OUTDOOR";

const styles = [
  {
    id: "EXECUTIVE" as const,
    name: "Executive Suite",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcYmGaIS7JM_MZ6SLh3-oLj0pbdfSvDAkDS4KKMzGTs9eUS_dG8_BnRd-xCePnBwrHcqSQXTuB5VZ0trJXBSTEcGhwqe_xV0a8sTgZ13klET68dxOdZrKzR5ay68OuH2SpSxoZ5XCmFF5BAfmn6GXIIlBRvUf2v_z0WCNPgUG5YuySy8dFKx3Bu1rXJkon0nZTEp7YQ1akNnMEj9LgTWBF5fWfzXZX6FbR8PJR7l9mVM8JIz70kW43CL0GRvPmx0j_CgUyR2JyEg",
  },
  {
    id: "CREATIVE" as const,
    name: "Creative Studio",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGyyQeNbHcUalSD24BCBLl8WY4btsYARu5FNYae2q1l7-YYZ-fr0WTttaNBgu9-5RSAzI6J2sas61LZbJXKyZCbopJLadHvJRMBATa0I8i1kSCWOqnSRSv_xsMw3RgWqvbEfjyGcj0VjJSl-6FBoJ9bKU9FG2WPG4lvlw2QGr1UZpvc6X8ihqd6vdfbgjNPxrRmwjIZz66dJgXAgDxb_xeDphp_C8e3Stj-pVI6cURW12f9gZ5-V4j1wEBSoEaMkekQ0iJhyZnqA",
  },
  {
    id: "OUTDOOR" as const,
    name: "Outdoor Casual",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARd1zxMVoQ1Rja-tSjjLYA0Ay2S8nDGrZWmgBITpnf2mDTj_Foo06LJvAf_8nTjgNmpLFFfQCR1LKyEHu_fTmRvB6lu4_0S_N6c_oBiQ8bx5TRG7imWJJOrFsQa0i0J2ksBObZEzV5au9iTRXo4RDoV4G68P78Mk0comAiEgVhfRXg4UbKn1u99dz4i697zigbqsG_tAsOZUF5itq4_b_FSgdXpDcIIq2MMoropGQT2oCnUn-135K8G1yLmjtHUzbgBo1NKrlpOw",
  },
] as const;

interface StyleSelectorProps {
  value?: StyleType;
  onChange?: (style: StyleType) => void;
}

export default function StyleSelector({ value = "EXECUTIVE", onChange }: StyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<StyleType>(value);

  useEffect(() => {
    setSelectedStyle(value);
  }, [value]);

  const handleSelect = (styleId: StyleType) => {
    setSelectedStyle(styleId);
    onChange?.(styleId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h3 className="text-headline-md text-primary">Pre-select Preferred Style</h3>
        <a href="#" className="text-label-sm text-secondary hover:underline">
          View all styles
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {styles.map((style) => {
          const isSelected = selectedStyle === style.id;

          return (
            <label key={style.id} className="group relative cursor-pointer">
              <input
                type="radio"
                name="style-select"
                value={style.id}
                checked={isSelected}
                onChange={() => handleSelect(style.id)}
                className="peer hidden"
              />

              <div
                className={`overflow-hidden rounded-xl border-2 bg-surface-container-low transition-all ${
                  isSelected
                    ? "border-secondary-container ring-4 ring-secondary-container/10"
                    : "border-transparent"
                }`}
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-label-sm">{style.name}</p>
                  </div>
                </div>
              </div>

              {isSelected ? (
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-container text-primary shadow-md">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </div>
              ) : null}
            </label>
          );
        })}
      </div>
    </div>
  );
}
