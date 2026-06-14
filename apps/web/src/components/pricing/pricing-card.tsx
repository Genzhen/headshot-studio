"use client";

import { Check, Sparkles } from "lucide-react";

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  onSelect?: (planId: string) => void;
}

export default function PricingCard({ plan, onSelect }: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl border-2 p-8 transition-all ${
        plan.isPopular
          ? "border-secondary-container bg-white shadow-xl"
          : "border-outline-variant/30 bg-surface-container-low"
      }`}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 text-label-xs font-bold text-on-secondary-container">
          <Sparkles className="h-3 w-3" />
          Most Popular
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-6">
        <h3 className="text-headline-md mb-2 font-heading text-primary">{plan.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-display-lg font-display text-primary">{plan.price}</span>
          <span className="text-body-md text-on-surface-variant">/{plan.period}</span>
        </div>
        <p className="text-body-md mt-2 text-on-surface-variant">{plan.description}</p>
      </div>

      {/* Features */}
      <ul className="mb-8 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-tertiary-container" />
            <span className="text-body-md text-on-surface">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => onSelect?.(plan.id)}
        className={`w-full rounded-xl py-4 text-label-sm font-bold transition-all active:scale-95 ${
          plan.isPopular
            ? "bg-secondary-container text-on-secondary-container shadow-lg hover:brightness-110"
            : "bg-primary text-on-primary hover:bg-primary-container"
        }`}
      >
        {plan.cta}
      </button>
    </div>
  );
}
