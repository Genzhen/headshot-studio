"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/gallery" as Route, label: "Gallery" },
  { href: "/#process" as Route, label: "Process" },
  { href: "/pricing" as Route, label: "Pricing" },
] as const;

function isActiveLink(pathname: string, href: string) {
  if (href === "/gallery") {
    return pathname === "/" || pathname.startsWith("/gallery");
  }

  return pathname === href;
}

export default function Header() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/login");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/20 bg-surface/80 backdrop-blur-md">
      <div
        className={`container-max mx-auto flex items-center px-[var(--spacing-margin-mobile)] py-5 md:px-[var(--spacing-margin-desktop)] ${
          isAuthPage ? "justify-between" : "justify-between md:grid md:grid-cols-[1fr_auto_1fr]"
        }`}
      >
        <Link href="/" className="text-headline-md font-black text-primary">
          AIGEN Studio
        </Link>

        <nav
          className={`flex items-center gap-8 ${
            isAuthPage ? "ml-auto" : "absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
          }`}
        >
          {navLinks.map((link) => {
            const active = !isAuthPage && isActiveLink(pathname, link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-label-sm transition-colors duration-200 ${
                  active
                    ? "border-b-2 border-secondary-container pb-1 text-secondary-container"
                    : "text-on-surface hover:text-secondary-container"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {!isAuthPage ? (
          <div className="hidden items-center justify-self-end md:flex md:gap-4">
            <Link
              href="/login"
              className="text-label-sm px-4 py-2 text-primary transition-opacity hover:opacity-70"
            >
              Sign In
            </Link>
            <Link
              href="/upload"
              className="rounded-lg bg-primary px-6 py-2.5 text-label-sm text-white shadow-md transition-all duration-150 hover:opacity-95 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
