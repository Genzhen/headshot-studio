export default function FinalCTA() {
  return (
    <section className="px-[var(--spacing-margin-mobile)] py-24 md:px-[var(--spacing-margin-desktop)]">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[40px] bg-primary-container p-12 text-center md:p-20">
        <div className="relative z-10">
          <h2 className="text-display-lg-mobile mb-6 font-display text-white md:text-display-lg">
            Ready for your professional upgrade?
          </h2>
          <p className="text-body-lg mx-auto mb-10 max-w-lg text-on-primary-container">
            Get 40+ high-quality headshots in 90 minutes. Join the elite professionals upgrading
            their online presence.
          </p>
          <button className="rounded-2xl bg-[#00D4FF] px-10 py-5 text-lg font-bold text-primary-container shadow-2xl transition-all hover:bg-[#00B8E0] active:scale-95">
            Generate My Headshots Now
          </button>
          <p className="text-label-xs mt-6 text-on-primary-container">
            No credit card required to start • 100% Satisfaction Guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
