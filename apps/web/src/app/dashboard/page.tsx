import { auth } from "@headshot-studio/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import GenerationHistory from "./generation-history";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="container-max mx-auto px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-md)] md:px-[var(--spacing-margin-desktop)]">
        <div className="mb-[var(--spacing-stack-md)]">
          <h1 className="text-display-lg-mobile text-primary md:text-display-lg">
            My Headshots
          </h1>
          <p className="text-body-md mt-2 text-on-surface-variant">
            {session.user.name} · {session.user.email}
          </p>
        </div>

        <GenerationHistory />
      </div>
    </div>
  );
}
