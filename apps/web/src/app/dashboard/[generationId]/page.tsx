import { auth } from "@headshot-studio/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import PhotoGallery from "./photo-gallery";

interface PageProps {
  params: Promise<{ generationId: string }>;
}

export default async function GenerationDetailPage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { generationId } = await params;

  return (
    <div className="min-h-screen bg-surface">
      <div className="container-max mx-auto px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-md)] md:px-[var(--spacing-margin-desktop)]">
        <PhotoGallery generationId={generationId} />
      </div>
    </div>
  );
}
