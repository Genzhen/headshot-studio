"use client";

import { Check } from "lucide-react";

import PricingCard, { type PricingPlan } from "@/components/pricing/pricing-card";

const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    period: "one-time",
    description: "Perfect for individuals updating their LinkedIn profile.",
    features: [
      "40 AI-generated headshots",
      "5 style options",
      "48-hour delivery",
      "High-resolution downloads",
      "Email support",
    ],
    cta: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    price: "$59",
    period: "one-time",
    description: "Best for professionals who need variety and quality.",
    features: [
      "80 AI-generated headshots",
      "10 style options",
      "24-hour priority delivery",
      "Ultra high-resolution (4K)",
      "Background customization",
      "Outfit variations",
      "Priority support",
    ],
    cta: "Get Professional",
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$199",
    period: "per team",
    description: "Ideal for teams and companies building their brand.",
    features: [
      "Unlimited headshots",
      "All style options",
      "Same-day delivery",
      "Team member management",
      "Brand color matching",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
  },
];

const faqs = [
  {
    question: "How does AI headshot generation work?",
    answer:
      "Upload 10+ photos of yourself, and our AI analyzes your facial features to generate professional headshots in various styles and backgrounds.",
  },
  {
    question: "How long does it take?",
    answer:
      "Standard delivery is 48 hours. Professional plan gets 24-hour priority, and Enterprise gets same-day delivery.",
  },
  {
    question: "What if I'm not satisfied?",
    answer:
      "We offer a 100% satisfaction guarantee. If you're not happy with your headshots, we'll regenerate them or refund your payment.",
  },
  {
    question: "Can I use these for LinkedIn?",
    answer:
      "Absolutely! Our headshots are specifically optimized for LinkedIn, resumes, company websites, and other professional platforms.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="container-max mx-auto px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-lg)] md:px-[var(--spacing-margin-desktop)]">
        {/* Header */}
        <section className="mb-16 text-center">
          <h1 className="text-display-lg-mobile mb-4 font-display text-primary md:text-display-lg">
            Simple, Transparent Pricing
          </h1>
          <p className="text-body-lg mx-auto max-w-2xl text-on-surface-variant">
            Choose the plan that fits your needs. All plans include our 100% satisfaction guarantee.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="mx-auto mb-24 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSelect={(id) => console.log("Selected plan:", id)}
            />
          ))}
        </section>

        {/* Feature Comparison */}
        <section className="mb-24">
          <h2 className="text-headline-md mb-8 text-center font-heading text-primary">
            Feature Comparison
          </h2>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-outline-variant/30 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                  <th className="p-4 text-left text-label-sm text-primary">Feature</th>
                  <th className="p-4 text-center text-label-sm text-primary">Starter</th>
                  <th className="p-4 text-center text-label-sm text-primary">Professional</th>
                  <th className="p-4 text-center text-label-sm text-primary">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "AI Headshots", starter: "40", professional: "80", enterprise: "Unlimited" },
                  { feature: "Style Options", starter: "5", professional: "10", enterprise: "All" },
                  { feature: "Delivery Time", starter: "48h", professional: "24h", enterprise: "Same day" },
                  { feature: "Resolution", starter: "HD", professional: "4K", enterprise: "4K+" },
                  { feature: "Background Customization", starter: false, professional: true, enterprise: true },
                  { feature: "Outfit Variations", starter: false, professional: true, enterprise: true },
                  { feature: "API Access", starter: false, professional: false, enterprise: true },
                  { feature: "Dedicated Support", starter: false, professional: true, enterprise: true },
                ].map((row, index) => (
                  <tr key={row.feature} className="border-b border-outline-variant/20 last:border-0">
                    <td className="p-4 text-body-md text-on-surface">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.starter === "boolean" ? (
                        row.starter ? (
                          <Check className="mx-auto h-5 w-5 text-tertiary-container" />
                        ) : (
                          <span className="text-on-surface-variant/30">—</span>
                        )
                      ) : (
                        <span className="text-body-md text-on-surface">{row.starter}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.professional === "boolean" ? (
                        row.professional ? (
                          <Check className="mx-auto h-5 w-5 text-tertiary-container" />
                        ) : (
                          <span className="text-on-surface-variant/30">—</span>
                        )
                      ) : (
                        <span className="text-body-md font-semibold text-on-surface">{row.professional}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? (
                          <Check className="mx-auto h-5 w-5 text-tertiary-container" />
                        ) : (
                          <span className="text-on-surface-variant/30">—</span>
                        )
                      ) : (
                        <span className="text-body-md font-semibold text-on-surface">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-3xl">
          <h2 className="text-headline-md mb-8 text-center font-heading text-primary">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-headline-md mb-2 font-heading text-primary">{faq.question}</h3>
                <p className="text-body-md text-on-surface-variant">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
