"use client";

import { ArrowRight, ImageIcon, Loader2, Plus, RefreshCw } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";

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

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function GenerationHistory() {
  const { data, isLoading, isError, refetch } = useQuery(
    trpc.generation.list.queryOptions({ limit: 20 }),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-outline-variant/30 bg-white p-12 text-center">
        <p className="text-body-md text-on-surface-variant mb-4">
          Failed to load your generations.
        </p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-label-sm text-white hover:opacity-90"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  const generations = data?.generations ?? [];

  if (generations.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-outline-variant/40 bg-white p-16 text-center">
        <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary-fixed/30 text-on-secondary-container">
          <ImageIcon className="h-10 w-10" />
        </div>
        <h2 className="text-headline-md mb-2 text-primary">No headshots yet</h2>
        <p className="text-body-md mx-auto mb-8 max-w-sm text-on-surface-variant">
          Upload your photos and let AI create stunning professional headshots for you.
        </p>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-label-sm text-white shadow-lg hover:opacity-90 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Create Your First Headshot
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-[var(--spacing-stack-md)]">
      <div className="flex items-center justify-between">
        <p className="text-body-md text-on-surface-variant">
          {generations.length} generation{generations.length === 1 ? "" : "s"}
        </p>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-label-sm text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Headshot
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {generations.map((gen) => {
          const statusConfig = STATUS_LABELS[gen.status] ?? STATUS_LABELS.PENDING;
          const photoCount = gen._count.photos;

          return (
            <Link
              key={gen.id}
              href={`/dashboard/${gen.id}` as Route}
              className="group block rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm transition-all hover:border-secondary-container hover:shadow-md"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-fixed/30 text-on-secondary-container">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-label-xs ${statusConfig.class}`}
                >
                  {statusConfig.label}
                </span>
              </div>

              {/* Info */}
              <h3 className="text-headline-md mb-1 text-primary">
                {STYLE_LABELS[gen.style] ?? gen.style}
              </h3>
              <p className="text-body-md text-on-surface-variant">
                {photoCount > 0
                  ? `${photoCount} photo${photoCount === 1 ? "" : "s"} generated`
                  : `${gen.photoCount} photos requested`}
              </p>
              <p className="text-label-xs mt-3 text-on-surface-variant">
                {formatDate(gen.createdAt)}
              </p>

              {/* Arrow */}
              <div className="mt-4 flex items-center justify-end text-secondary opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
