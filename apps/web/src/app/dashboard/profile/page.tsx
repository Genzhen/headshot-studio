import { auth } from "@headshot-studio/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import ProfileEditor from "./profile-editor";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="container-max mx-auto px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-md)] md:px-[var(--spacing-margin-desktop)]">
        <div className="mx-auto max-w-lg">
          <h1 className="text-display-lg-mobile mb-[var(--spacing-stack-md)] text-primary">
            Profile Settings
          </h1>
          <ProfileEditor />
        </div>
      </div>
    </div>
  );
}
