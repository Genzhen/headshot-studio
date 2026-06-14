import type { Route } from "next";
import Link from "next/link";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" as Route },
  { label: "Terms of Service", href: "/terms" as Route },
  { label: "Support", href: "/support" as Route },
  { label: "Contact", href: "/contact" as Route },
] as const;

export default function Footer() {
  return (
    <footer className="bg-primary">
      <div className="container-max mx-auto flex flex-col items-center justify-between px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-lg)] md:flex-row md:px-[var(--spacing-margin-desktop)]">
        {/* Brand */}
        <div className="mb-8 flex flex-col gap-4 md:mb-0">
          <div className="text-headline-md font-heading font-black text-on-primary">
            AIGEN Studio
          </div>
          <p className="text-body-md max-w-xs text-on-primary/70">
            Professional AI Portraits for the modern workforce.
          </p>
        </div>

        {/* Links */}
        <div className="mb-8 flex flex-wrap justify-center gap-8 md:mb-0">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-body-md text-on-primary/70 transition-colors hover:text-secondary-fixed"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-body-md text-sm text-on-primary/70">
          © 2024 AIGEN Studio. Professional AI Portraits.
        </div>
      </div>
    </footer>
  );
}
