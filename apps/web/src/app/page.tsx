import BeforeAfterSlider from "@/components/landing/before-after-slider";
import FinalCTA from "@/components/landing/final-cta";
import Footer from "@/components/landing/footer";
import HeroSection from "@/components/landing/hero-section";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonials from "@/components/landing/testimonials";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Social Proof */}
      <section className="border-y border-outline-variant/10 bg-white py-12">
        <div className="container-max mx-auto px-[var(--spacing-margin-mobile)] text-center md:px-[var(--spacing-margin-desktop)]">
          <p className="text-label-sm mb-8 uppercase tracking-widest text-on-surface-variant">
            As seen on
          </p>
          <div className="flex flex-wrap justify-center gap-10 opacity-50 grayscale transition-all hover:grayscale-0 md:gap-20">
            {["Forbes", "TechCrunch", "WIRED", "VOGUE", "Inc."].map((brand) => (
              <div key={brand} className="text-display-lg text-2xl font-black text-primary">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <BeforeAfterSlider />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
