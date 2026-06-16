import { Download, Sparkles, Upload } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "1. Upload 10+ selfies",
    description: "Simply upload existing photos from your phone. No studio visit required.",
    className: "bg-primary text-white",
  },
  {
    icon: Sparkles,
    title: "2. AI works its magic",
    description:
      "Our custom-trained engine generates high-fidelity portraits tailored to your features.",
    className: "bg-secondary-container text-primary",
  },
  {
    icon: Download,
    title: "3. Download 40+ photos",
    description: "Get a variety of outfits, backgrounds, and expressions in high-resolution.",
    className: "bg-primary text-white",
  },
] as const;

export default function HowItWorks() {
  return (
    <section id="process" className="bg-white px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-lg)] md:px-[var(--spacing-margin-desktop)]">
      <div className="container-max mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-display-lg-mobile text-primary md:text-headline-md">
            The 90-Minute Professional Transformation
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="group rounded-3xl bg-surface-container p-8 text-center transition-colors hover:bg-surface-container-high"
            >
              <div
                className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${step.className}`}
              >
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-primary">{step.title}</h3>
              <p className="text-body-md text-on-surface-variant">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
