"use client";

import { AlertCircle, CheckCircle, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";

interface UploadFileState {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  fileKey?: string;
}

interface UploadZoneProps {
  onFileUploaded?: (fileKey: string) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

function uploadToS3(
  url: string,
  file: File,
  onProgress: (p: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`S3 upload failed with status ${xhr.status}`));
    });
    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

export default function UploadZone({
  onFileUploaded,
  maxFiles = 20,
  maxSizeMB = 20,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadFileState[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep a ref in sync so the unmount cleanup can revoke all blob URLs
  const filesRef = useRef<UploadFileState[]>([]);
  filesRef.current = files;

  useEffect(() => {
    return () => {
      filesRef.current.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, []);

  const getPresignedUrl = useMutation(trpc.upload.getPresignedUrl.mutationOptions());
  const confirmUpload = useMutation(trpc.upload.confirmUpload.mutationOptions());

  const updateFile = useCallback(
    (id: string, patch: Partial<UploadFileState>) =>
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f))),
    [],
  );

  const uploadFile = useCallback(
    async (fileState: UploadFileState) => {
      const { id, file } = fileState;

      try {
        updateFile(id, { status: "uploading", progress: 0 });

        const { presignedUrl, fileKey } = await getPresignedUrl.mutateAsync({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });

        await uploadToS3(presignedUrl, file, (progress) => updateFile(id, { progress }));

        await confirmUpload.mutateAsync({
          fileKey,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        });

        updateFile(id, { status: "success", progress: 100, fileKey });
        onFileUploaded?.(fileKey);
      } catch {
        updateFile(id, { status: "error", error: "Upload failed. Try again." });
      }
    },
    [getPresignedUrl, confirmUpload, updateFile, onFileUploaded],
  );

  const addFiles = useCallback(
    (rawFiles: File[]) => {
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      setFiles((prev) => {
        const remaining = Math.max(0, maxFiles - prev.length);
        const valid = rawFiles
          .filter((f) => f.type.startsWith("image/") && f.size <= maxSizeBytes)
          .slice(0, remaining);

        if (!valid.length) return prev;

        const newStates: UploadFileState[] = valid.map((file) => ({
          id: Math.random().toString(36).slice(2),
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: "pending",
        }));

        // Kick off uploads after state is set (microtask)
        Promise.resolve().then(() => {
          newStates.forEach((fs) => void uploadFile(fs));
        });

        return [...prev, ...newStates];
      });
    },
    [maxFiles, maxSizeMB, uploadFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const successCount = files.filter((f) => f.status === "success").length;
  const isComplete = successCount >= 10;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload photos — click or drag and drop"
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
          isDragging
            ? "border-secondary-container bg-secondary-container/5"
            : isComplete
              ? "border-secondary-container bg-secondary-container/5"
              : "border-outline-variant/50 bg-white hover:border-secondary-container"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
      >
        {/* Dot pattern background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#00677e 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10">
          <div
            className={`mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary-fixed/30 text-on-secondary-container transition-transform duration-500 ${
              isDragging ? "scale-110 rotate-6" : ""
            }`}
          >
            {isComplete ? (
              <CheckCircle className="h-10 w-10" />
            ) : (
              <ImagePlus className="h-10 w-10" />
            )}
          </div>

          <h2 className="text-headline-md mb-2 text-primary md:text-display-lg-mobile">
            {successCount > 0
              ? `${successCount} photo${successCount === 1 ? "" : "s"} uploaded`
              : "Drag and drop your photos"}
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
            className="inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-label-sm font-bold text-white shadow-lg transition-colors hover:bg-primary-container"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <Upload className="h-5 w-5" />
            Select Files from Device
          </button>
        </div>
      </div>

      {/* File thumbnail grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {files.map((f) => (
            <div
              key={f.id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-surface-container-low"
            >
              <img
                src={f.preview}
                alt={f.file.name}
                className="h-full w-full object-cover"
              />

              {/* Upload overlay */}
              {f.status !== "success" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                  {f.status === "error" ? (
                    <>
                      <AlertCircle className="h-6 w-6 text-red-400" />
                      <p className="mt-1 px-2 text-center text-[10px] leading-tight text-red-300">
                        Failed
                      </p>
                    </>
                  ) : (
                    <>
                      <Loader2 className="mb-2 h-6 w-6 animate-spin text-white" />
                      <div className="w-3/4 overflow-hidden rounded-full bg-white/30">
                        <div
                          className="h-1 rounded-full bg-white transition-all duration-200"
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                      <span className="mt-1 text-[10px] text-white/70">{f.progress}%</span>
                    </>
                  )}
                </div>
              )}

              {/* Success badge */}
              {f.status === "success" && (
                <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary-container shadow">
                  <CheckCircle className="h-3 w-3 text-primary" strokeWidth={2.5} />
                </div>
              )}

              {/* Remove button (hover) */}
              <button
                className="absolute left-1.5 top-1.5 hidden h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white group-hover:flex"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(f.id);
                }}
                aria-label="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Progress summary */}
      {files.length > 0 && !isComplete && (
        <p className="text-body-md text-center text-on-surface-variant">
          {successCount} / 10 minimum photos uploaded
        </p>
      )}
    </div>
  );
}
