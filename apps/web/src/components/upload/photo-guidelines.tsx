import { CheckCircle, XCircle } from "lucide-react";

const dos = [
  { label: "Clear Lighting", emoji: "" },
  { label: "Different Angles", emoji: "📐" },
];

const donts = [
  { label: "Sunglasses/Hats", emoji: "️" },
  { label: "Group Photos", emoji: "👥" },
];

export default function PhotoGuidelines() {
  return (
    <aside className="space-y-[var(--spacing-gutter)]">
      <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-6">
        <h3 className="text-headline-md mb-[var(--spacing-stack-sm)] font-heading text-primary">
          Photo Guidelines
        </h3>
        <p className="text-body-md mb-6 text-on-surface-variant">
          For the best AI results, follow these professional standards.
        </p>

        {/* DO'S */}
        <div className="mb-6">
          <div className="text-label-sm mb-3 flex items-center gap-2 font-semibold text-tertiary-container">
            <CheckCircle className="h-5 w-5" />
            <span>DO&apos;S</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {dos.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="aspect-square overflow-hidden rounded-lg border-2 border-tertiary-fixed bg-surface-container-highest">
                  <div className="flex h-full items-center justify-center text-4xl">
                    {item.emoji}
                  </div>
                </div>
                <p className="text-label-xs text-on-surface-variant">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DON'TS */}
        <div>
          <div className="text-label-sm mb-3 flex items-center gap-2 font-semibold text-error">
            <XCircle className="h-5 w-5" />
            <span>DON&apos;TS</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {donts.map((item) => (
              <div key={item.label} className="relative space-y-2">
                <div className="aspect-square overflow-hidden rounded-lg bg-surface-container-highest grayscale opacity-60">
                  <div className="flex h-full items-center justify-center text-4xl">
                    {item.emoji}
                  </div>
                </div>
                <p className="text-label-xs text-on-surface-variant">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
