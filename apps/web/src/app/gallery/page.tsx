import Link from "next/link";
import { Sparkles } from "lucide-react";

import PhotoGrid from "@/components/gallery/photo-grid";
import SiteFooter from "@/components/site-footer";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="container-max mx-auto px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-lg)] md:px-[var(--spacing-margin-desktop)]">
        <section className="mb-[var(--spacing-stack-lg)] text-center md:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-fixed px-4 py-1.5">
            <Sparkles className="h-[18px] w-[18px] text-on-primary-fixed-variant" />
            <span className="text-label-sm text-on-primary-fixed-variant">
              High-Precision AI Generation
            </span>
          </div>

          <h1 className="text-display-lg mb-6 font-display leading-tight">
            Professional Portraits
            <br className="hidden md:block" />
            <span className="text-secondary">Engineered for Success.</span>
          </h1>

          <p className="text-body-lg mx-auto max-w-2xl text-on-surface-variant md:mx-0">
            Browse our curated collection of AI-generated headshots across industries. Experience
            studio-quality lighting and professional aesthetics without the studio price tag.
          </p>
        </section>

        <section>
          <PhotoGrid />
        </section>

        <section className="relative mt-[var(--spacing-stack-lg)] overflow-hidden rounded-3xl bg-primary py-[var(--spacing-stack-lg)] px-[var(--spacing-margin-mobile)] text-center md:px-[var(--spacing-margin-desktop)]">
          <div className="relative z-10">
            <h2 className="text-display-lg-mobile mb-6 font-display text-white md:text-display-lg">
              Ready to upgrade your profile?
            </h2>
            <p className="text-body-lg mx-auto mb-[var(--spacing-stack-md)] max-w-xl text-white/80">
              Join 10,000+ professionals who trust AIGEN Studio for their digital identity.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/upload"
                className="rounded-xl bg-secondary-container px-8 py-4 text-label-sm font-bold text-primary shadow-lg transition-all hover:brightness-95 active:scale-95"
              >
                Get Started
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-white/30 px-8 py-4 text-label-sm text-white transition-all hover:bg-white/10 active:scale-95"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter variant="expanded" />
    </div>
  );
}
