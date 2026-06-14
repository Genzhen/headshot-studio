"use client";

import { ArrowRight, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-[var(--spacing-margin-mobile)] py-20 md:px-[var(--spacing-margin-desktop)] md:py-32">
      <div className="container-max relative z-10 mx-auto grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Content */}
        <div className="text-left">
          {/* Trust Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary-container/10 px-3 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary-container" />
            <span className="text-label-sm text-on-secondary-container">
              Trusted by 100,000+ Professionals
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-display-lg-mobile mb-6 text-display-lg font-display text-primary md:text-display-lg">
            Get the perfect professional headshot in 90 minutes.
          </h1>

          {/* Subheadline */}
          <p className="text-body-lg mb-10 max-w-xl text-on-surface-variant">
            Save $1,000s on traditional photoshoots. Over 100,000+ professionals trust us for their
            LinkedIn, Resume, and Team photos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00D4FF] px-8 py-4 font-bold text-primary-container shadow-lg transition-all hover:bg-[#00B8E0] active:scale-95">
              Get Your Photos
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="inline-flex items-center justify-center rounded-xl border-2 border-primary-container px-8 py-4 font-bold text-primary-container transition-all hover:bg-primary-container hover:text-white">
              See Gallery
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-surface-container"
                >
                  <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                </div>
              ))}
            </div>
            <div className="text-label-xs text-on-surface-variant">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span>4.9/5 from 2,000+ reviews</span>
            </div>
          </div>
        </div>

        {/* Right Visual - AI Generation Preview */}
        <div className="relative h-[500px] w-full overflow-hidden rounded-3xl shadow-2xl md:h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-primary" />

          {/* Glass Card Overlay */}
          <div className="absolute inset-0 flex items-end p-8">
            <div className="glass-card w-full rounded-2xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-bold text-primary">AI Generation in progress...</span>
                <span className="font-bold text-[#00D4FF]">87%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                <div className="h-full w-[87%] animate-pulse bg-[#00D4FF]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
