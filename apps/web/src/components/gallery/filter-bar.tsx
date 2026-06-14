"use client";

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterBar({
  categories = ["All", "Corporate", "Creative", "Outdoor", "Medical"],
  activeCategory = "All",
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="mb-[var(--spacing-stack-md)] flex flex-wrap items-center gap-3 border-b border-outline-variant/30 pb-4">
      {categories.map((category) => {
        const isActive = category === activeCategory;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`rounded-full px-6 py-2.5 text-label-sm transition-all duration-200 ${
              isActive
                ? "bg-primary-container text-on-primary-container font-semibold"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
