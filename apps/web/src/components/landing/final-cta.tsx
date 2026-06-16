import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="px-[var(--spacing-margin-mobile)] py-24 md:px-[var(--spacing-margin-desktop)]">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[40px] bg-primary-container p-12 text-center md:p-20">
        <div className="relative z-10">
          <h2 className="mb-6 text-display-lg-mobile text-white md:text-display-lg">
            Ready for your professional upgrade?
          </h2>
          <p className="text-body-lg mx-auto mb-10 max-w-lg text-white/70">
            Get 40+ high-quality headshots in 90 minutes. Join the elite professionals upgrading
            their online presence.
          </p>
          <Link
            href="/upload"
            className="inline-flex rounded-2xl bg-secondary-container px-10 py-5 text-lg font-bold text-primary shadow-2xl transition-all hover:brightness-95 active:scale-95"
          >
            Generate My Headshots Now
          </Link>
          <p className="mt-6 text-label-xs text-white/60">
            No credit card required to start • 100% Satisfaction Guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
