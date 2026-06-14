"use client";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Software Engineer @ FinTech",
    content:
      "I needed a new LinkedIn photo for my job search. This AI generated a headshot better than any photographer I've ever hired. Incredible ROI.",
    avatar: "SJ",
  },
  {
    name: "Marcus Thompson",
    role: "Luxury Realtor",
    content:
      "As a realtor, my face is my brand. AIGEN Studio gave me 40 different looks to use across all my marketing platforms for the price of a lunch.",
    avatar: "MT",
  },
  {
    name: "David Long",
    role: "Executive VP @ LogiCorp",
    content:
      "The lighting and skin textures are indistinguishable from real photography. Saved my team thousands on our website rebrand.",
    avatar: "DL",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((i) => (i + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-background px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-lg)] md:px-[var(--spacing-margin-desktop)]">
      <div className="container-max mx-auto">
        {/* Header */}
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="text-display-lg-mobile mb-4 font-display text-headline-md text-primary md:text-display-lg">
              Loved by 100k+ Professionals
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Our users range from startup founders to Fortune 500 executives who value their time
              and brand.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-outline transition-all hover:bg-primary hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-outline transition-all hover:bg-primary hover:text-white"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`flex flex-col justify-between rounded-3xl border border-outline-variant/50 bg-white p-8 shadow-sm ${
                index === 1 ? "md:-translate-y-4" : ""
              } ${index === 1 ? "bg-primary text-on-primary" : ""}`}
            >
              <div>
                {/* Stars */}
                <div className={`mb-6 flex ${index === 1 ? "text-[#00D4FF]" : "text-[#00D4FF]"}`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p
                  className={`text-body-md mb-8 italic ${
                    index === 1 ? "text-on-primary/90" : "text-primary"
                  }`}
                >
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    index === 1 ? "bg-white/20" : "bg-secondary-container/20"
                  }`}
                >
                  <span
                    className={`text-label-sm font-bold ${
                      index === 1 ? "text-white" : "text-primary"
                    }`}
                  >
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p
                    className={`text-label-sm ${
                      index === 1 ? "text-on-primary" : "text-primary"
                    }`}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className={`text-label-xs ${
                      index === 1 ? "text-on-primary/70" : "text-on-surface-variant"
                    }`}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
