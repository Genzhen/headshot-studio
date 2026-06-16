"use client";

import { useRef, useState } from "react";

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) {
      return;
    }

    const rect = sliderRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (position / rect.width) * 100;
    setSliderPosition(percentage);
  };

  return (
    <section className="bg-surface-container-low px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-lg)] md:px-[var(--spacing-margin-desktop)]">
      <div className="container-max mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-display-lg-mobile text-primary md:text-headline-md">
            Studio Quality, Zero Hassle
          </h2>
          <p className="mx-auto max-w-2xl text-body-md text-on-surface-variant">
            See how our AI transforms casual smartphone photos into world-class corporate
            headshots with pixel-perfect lighting and style.
          </p>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border-8 border-white bg-white shadow-2xl">
          <div
            ref={sliderRef}
            className="relative aspect-[16/9] w-full cursor-ew-resize select-none"
            onMouseMove={(event) => handleMove(event.clientX)}
            onTouchMove={(event) => handleMove(event.touches[0].clientX)}
          >
            <div className="absolute inset-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFDCeLOdB1jw9xcRTo4KYkeFb-9PBdkdu2IwcC4SOy2i5UCoeqJzJfuW7a3cqzlkasTPnwT70rZCS5dOYPn004s-6d3v-JwvSZPKEBcXQbIqHr35qX1oRK665xKRgtlDU0cXe-5NZdI7IZFl_ThBiXPXj2gx_s6eYx6uN1fMA8PCyY519ZsRwq5nvKcv51quOE0VIub2qilpzFtxqmqm_43ZGehjDFi9kE2MWWSKECvr56nJwqdCDE-2nvA23LMbZxELM6GOD9fw"
                alt="Before casual selfie"
                className="h-full w-full object-cover"
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/80 px-4 py-1 text-label-xs uppercase tracking-wider text-primary shadow-sm backdrop-blur">
                Before: Casual Selfie
              </div>
            </div>

            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyaDESq7vFfBGYKQnAI_moo-0Za3ZR5ERW6ZgxwePb7e16GTtHy7e7x5yTBo3GwIza4a_MzAiAv_FrJ0MgBltnhIUOi3fEcmwZYnfnNRQYKfI9e9cRfXskY3MiLVL2W_4wk9RYtF6TaH6Gxw0UrPytrJF-YgK7jqFncaRQ03MOok95H2bzDUxpzWg039FueqQTa2XLRUwKX49AHvkYSz3JYyBqn0iMeJY2OZAuOj55CkUgLrIQjIqPYLMvamw5xSwR9jRSf-aZHg"
                alt="After AI studio portrait"
                className="h-full w-full object-cover"
              />
              <div className="absolute right-4 top-4 rounded-full bg-secondary-container px-4 py-1 text-label-xs uppercase tracking-wider text-primary shadow-sm">
                After: AI Studio
              </div>
            </div>

            <div
              className="absolute bottom-0 top-0 z-10 w-1 bg-secondary-container"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-secondary-container text-white shadow-lg">
                ↔
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
