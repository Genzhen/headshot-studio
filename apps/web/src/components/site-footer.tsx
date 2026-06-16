import type { Route } from "next";
import Link from "next/link";

type FooterVariant = "simple" | "expanded";

const simpleLinks = [
  { label: "Privacy Policy", href: "/privacy" as Route },
  { label: "Terms of Service", href: "/terms" as Route },
  { label: "Support", href: "/support" as Route },
  { label: "Contact", href: "/contact" as Route },
] as const;

const expandedColumns = [
  {
    title: "Company",
    links: [
      { label: "Privacy Policy", href: "/privacy" as Route },
      { label: "Terms of Service", href: "/terms" as Route },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Gallery", href: "/gallery" as Route },
      { label: "Pricing", href: "/pricing" as Route },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "LinkedIn", href: "/login" as Route },
      { label: "Twitter", href: "/login" as Route },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" as Route },
      { label: "Help Center", href: "/support" as Route },
    ],
  },
] as const;

export default function SiteFooter({ variant = "simple" }: { variant?: FooterVariant }) {
  if (variant === "expanded") {
    return (
      <footer className="mt-[var(--spacing-stack-lg)] bg-primary">
        <div className="container-max mx-auto flex flex-col gap-10 px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-lg)] md:flex-row md:justify-between md:px-[var(--spacing-margin-desktop)]">
          <div className="max-w-xs">
            <p className="mb-4 text-headline-md font-black text-white">AIGEN Studio</p>
            <p className="text-body-md text-white/70">
              © 2024 AIGEN Studio. Professional AI Portraits.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {expandedColumns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <span className="text-label-sm text-secondary-fixed">{column.title}</span>
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-body-md text-white/70 transition-colors hover:text-secondary-fixed"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-[var(--spacing-stack-lg)] bg-primary">
      <div className="container-max mx-auto flex flex-col gap-8 px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-lg)] md:flex-row md:items-center md:justify-between md:px-[var(--spacing-margin-desktop)]">
        <div>
          <p className="mb-2 text-headline-md font-black text-white">AIGEN Studio</p>
          <p className="text-body-md text-white/70">
            © 2024 AIGEN Studio. Professional AI Portraits.
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          {simpleLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-body-md text-white/70 transition-colors hover:text-secondary-fixed"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
