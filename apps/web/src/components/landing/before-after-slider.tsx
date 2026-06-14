"use client";

import { useRef, useState } from "react";

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section className="bg-surface-container-low px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-lg)] md:px-[var(--spacing-margin-desktop)]">
      <div className="container-max mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-display-lg-mobile mb-4 font-display text-headline-md text-primary md:text-display-lg">
            Studio Quality, Zero Hassle
          </h2>
          <p className="mx-auto max-w-2xl text-body-md text-on-surface-variant">
            See how our AI transforms casual smartphone photos into world-class corporate headshots
            with pixel-perfect lighting and style.
          </p>
        </div>

        {/* Slider Container */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border-8 border-white bg-white shadow-2xl">
          <div
            ref={sliderRef}
            className="relative aspect-[16/9] w-full cursor-ew-resize select-none"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* Before Image (Casual Selfie) */}
            <div className="absolute inset-0">
              <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl">📱</div>
                    <p className="mt-4 text-lg font-bold text-gray-600">Before: Casual Selfie</p>
                  </div>
                </div>
              </div>
              <div className="absolute left-4 top-4 rounded-full bg-white/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur">
                Before: Casual Selfie
              </div>
            </div>

            {/* After Image (AI Studio) - Clipped */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <div className="h-full w-full bg-gradient-to-br from-primary-container to-primary">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl">✨</div>
                    <p className="mt-4 text-lg font-bold text-white">After: AI Studio</p>
                  </div>
                </div>
              </div>
              <div className="absolute right-4 top-4 rounded-full bg-[#00D4FF] px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
                After: AI Studio
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 z-10 w-1 bg-[#00D4FF]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#00D4FF] shadow-lg">
                <span className="text-xl text-white">↔</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
