"use client";

import { CheckCircle, ImagePlus, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface UploadZoneProps {
  onFilesSelected?: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export default function UploadZone({
  onFilesSelected,
  maxFiles = 20,
  maxSizeMB = 20,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > maxSizeBytes) continue;
      validFiles.push(file);
      if (validFiles.length >= maxFiles) break;
    }

    return validFiles;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(files);

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, maxFiles));
        onFilesSelected?.(validFiles);
      }
    },
    [maxFiles, maxSizeMB, onFilesSelected],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, maxFiles));
      onFilesSelected?.(validFiles);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const fileCount = selectedFiles.length;
  const isComplete = fileCount >= 10;

  return (
    <div
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
        isDragging
          ? "border-secondary-container bg-secondary-container/5"
          : isComplete
          ? "border-tertiary-container bg-tertiary-container/5"
          : "border-outline-variant/50 bg-white hover:border-secondary-container"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {/* Dot Pattern Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#00677e 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10">
        <div
          className={`mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-500 ${
            isComplete
              ? "bg-tertiary-container/30 text-tertiary-container"
              : "bg-secondary-fixed/30 text-on-secondary-container"
          } ${isDragging ? "scale-110 rotate-6" : ""}`}
        >
          {isComplete ? (
            <CheckCircle className="h-10 w-10" />
          ) : (
            <ImagePlus className="h-10 w-10" />
          )}
        </div>

        <h2 className="text-display-lg-mobile text-headline-md mb-2 font-display text-primary">
          {fileCount > 0 ? `${fileCount} photos selected` : "Drag and drop your photos"}
        </h2>

        <p className="text-body-md mx-auto mb-8 max-w-sm text-on-surface-variant">
          {isComplete
            ? "Ready to process. You can still add more or click continue below."
            : "Upload at least 10 high-quality portraits for the AI to learn your features. JPEG or PNG, up to 20MB."}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />

        <button
          className="inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-label-sm text-on-primary shadow-lg transition-colors hover:bg-primary-container"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <Upload className="h-5 w-5" />
          Select Files from Device
        </button>
      </div>
    </div>
  );
}
