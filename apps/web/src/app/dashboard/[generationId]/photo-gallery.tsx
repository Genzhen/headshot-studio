"use client";

import {
  ArrowLeft,
  Download,
  Heart,
  ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { trpc, queryClient } from "@/utils/trpc";

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  PENDING: { label: "Pending", class: "bg-surface-container text-on-surface-variant" },
  PROCESSING: { label: "Processing", class: "bg-secondary-container/20 text-secondary" },
  COMPLETED: { label: "Completed", class: "bg-secondary-container/30 text-on-secondary-container" },
  FAILED: { label: "Failed", class: "bg-error-container text-on-error-container" },
};

const STYLE_LABELS: Record<string, string> = {
  EXECUTIVE: "Executive Suite",
  CREATIVE: "Creative Studio",
  OUTDOOR: "Outdoor Casual",
};

interface PhotoGalleryProps {
  generationId: string;
}

export default function PhotoGallery({ generationId }: PhotoGalleryProps) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const generationQuery = useQuery(
    trpc.generation.getById.queryOptions({ id: generationId }),
  );

  const photosQuery = useQuery(
    trpc.photo.list.queryOptions({ generationId, limit: 100 }),
  );

  const toggleFavorite = useMutation({
    ...trpc.photo.toggleFavorite.mutationOptions(),
    onSuccess: () => {
      void queryClient.invalidateQueries(
        trpc.photo.list.queryOptions({ generationId, limit: 100 }),
      );
    },
  });

  const handleDownload = (photoUrl: string, photoId: string) => {
    const a = document.createElement("a");
    a.href = photoUrl;
    a.download = `headshot-${photoId}.jpg`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  if (generationQuery.isLoading || photosQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (generationQuery.isError || !generationQuery.data) {
    return (
      <div className="py-12 text-center">
        <p className="text-body-md text-on-surface-variant">Generation not found.</p>
        <Link href="/dashboard" className="text-secondary hover:underline text-label-sm mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const generation = generationQuery.data;
  const photos = photosQuery.data?.photos ?? [];
  const statusConfig = STATUS_LABELS[generation.status] ?? STATUS_LABELS.PENDING;

  return (
    <div className="space-y-[var(--spacing-stack-md)]">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-label-sm text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Generation header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-display-lg-mobile text-primary">
              {STYLE_LABELS[generation.style] ?? generation.style}
            </h1>
            <span className={`rounded-full px-3 py-1 text-label-xs ${statusConfig.class}`}>
              {statusConfig.label}
            </span>
          </div>
          <p className="text-body-md text-on-surface-variant">
            {photos.length > 0
              ? `${photos.length} photo${photos.length === 1 ? "" : "s"}`
              : `${generation.photoCount} photos requested`}
            {" · "}
            {new Date(generation.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Processing state */}
      {(generation.status === "PENDING" || generation.status === "PROCESSING") && (
        <div className="flex items-center gap-4 rounded-2xl bg-secondary-container/10 px-6 py-4">
          <Loader2 className="h-6 w-6 animate-spin text-secondary" />
          <div>
            <p className="text-label-sm text-primary">Generating your headshots…</p>
            <p className="text-body-md text-on-surface-variant">
              This typically takes 5–10 minutes. This page will update automatically.
            </p>
          </div>
        </div>
      )}

      {/* Failed state */}
      {generation.status === "FAILED" && photos.length === 0 && (
        <div className="rounded-2xl border border-error-container bg-error-container/10 p-8 text-center">
          <p className="text-label-sm text-on-error-container mb-2">Generation failed</p>
          <p className="text-body-md text-on-surface-variant">
            Please try uploading again or contact support.
          </p>
        </div>
      )}

      {/* Empty state for completed but no photos */}
      {generation.status === "COMPLETED" && photos.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-outline-variant/40 bg-white p-12 text-center">
          <ImageIcon className="mx-auto mb-4 h-12 w-12 text-on-surface-variant/40" />
          <p className="text-body-md text-on-surface-variant">No photos yet.</p>
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-container-low"
            >
              {/* Photo */}
              <img
                src={photo.url}
                alt="Generated headshot"
                className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
                onClick={() => setLightboxUrl(photo.url)}
              />

              {/* Action overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite.mutate({ id: photo.id });
                  }}
                  className="rounded-full p-2 text-white hover:text-red-400 transition-colors"
                  aria-label={photo.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    className="h-5 w-5"
                    fill={photo.isFavorite ? "currentColor" : "none"}
                  />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(photo.url, photo.id);
                  }}
                  className="rounded-full p-2 text-white hover:text-secondary-container transition-colors"
                  aria-label="Download photo"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>

              {/* Favorite indicator */}
              {photo.isFavorite && (
                <div className="absolute right-2 top-2">
                  <Heart className="h-4 w-4 fill-red-400 text-red-400 drop-shadow" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightboxUrl(null)}
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          <img
            src={lightboxUrl}
            alt="Headshot preview"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
