"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import PhotoGuidelines from "@/components/upload/photo-guidelines";
import SiteFooter from "@/components/site-footer";
import StepProgress from "@/components/upload/step-progress";
import StyleSelector from "@/components/upload/style-selector";
import UploadZone from "@/components/upload/upload-zone";
import type { StyleType } from "@/components/upload/style-selector";

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState<StyleType>("EXECUTIVE");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="container-max mx-auto px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-md)] md:px-[var(--spacing-margin-desktop)]">
        <StepProgress currentStep={currentStep} />

        <div className="grid grid-cols-1 gap-[var(--spacing-gutter)] lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-4">
            <PhotoGuidelines />
          </div>

          <div className="order-1 space-y-[var(--spacing-gutter)] lg:order-2 lg:col-span-8">
            <UploadZone onFilesSelected={handleFilesSelected} />
            <StyleSelector value={selectedStyle} onChange={setSelectedStyle} />
            <div className="flex justify-end pt-[var(--spacing-stack-sm)]">
              <button
                onClick={handleContinue}
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-label-sm text-white shadow-xl transition-all hover:opacity-90 active:scale-95"
              >
                {currentStep === 1
                  ? "Continue to Style Details"
                  : currentStep === 2
                    ? "Continue to Payment"
                    : "Complete"}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter variant="simple" />
    </div>
  );
}
