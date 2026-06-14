"use client";

import { Check, Palette, Upload } from "lucide-react";

interface StepProgressProps {
  currentStep: number; // 1, 2, 3
  steps?: { label: string; icon: React.ElementType }[];
}

const defaultSteps = [
  { label: "Upload", icon: Upload },
  { label: "Select Style", icon: Palette },
  { label: "Payment", icon: Check },
];

export default function StepProgress({ currentStep, steps = defaultSteps }: StepProgressProps) {
  return (
    <div className="mx-auto mb-[var(--spacing-stack-lg)] flex max-w-2xl items-center justify-between relative">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-surface-container-highest" />

      {/* Active Progress Line */}
      <div
        className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-secondary-container transition-all duration-500"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={step.label} className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container"
                  : isCompleted
                  ? "bg-tertiary-container text-on-tertiary-container"
                  : "bg-surface-container-highest text-on-surface-variant"
              }`}
            >
              {isCompleted ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
            </div>
            <span
              className={`text-label-sm ${
                isActive ? "text-primary font-semibold" : "text-on-surface-variant"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
