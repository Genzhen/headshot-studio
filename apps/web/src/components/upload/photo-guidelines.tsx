import { CheckCircle, EyeOff, Users, XCircle } from "lucide-react";

const dos = [
  {
    label: "Clear Lighting",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtB_lIBwSgUa9WYZZjk2VNAC8k-J87XunyERfur4r9NglvGscB-MVTRWWF4ec8jMFd8IMY7qAAmJEnlBJ4FzDL7JsEeUNRM9PRUZD51QI3PEJauLcDJWRfh-mhq4wX1lGgLX-pycray6s8Y0p4l64I1ijp0BKIUvOvJqJ2FStc-bMM5DoUDbrvpTgY5NmoMYy56MzfQVEtvJSR4cFSw8-J4hk_TEtJ48xnaKbqJ5a_xIuBbS5FUXuObOVwMkqAKuY42IYtDA9OhA",
  },
  {
    label: "Different Angles",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCWbxfWEXERCq2pljsrpSXVQx9ngdkwkHEH0RXrMOPRjdYhxKni99EB4PlMWotdy8-Wi76KxJ5XKOB3wh6ORconlwjbOgw5bX5KGEbXvecMttMTTR3E6IpknWmhBTLB8Tf5HWxEwDEMLLdzL6U_yvTygsqqkKzJqH1XLjfiQ_3qr3Hj-hFEHcIBeIQo0uqXoH07WA7BqGB7r0zph6UxNIycaZXhS6sD1Y_XzLIl-XiBnoaOVNDLGdajOr1chA0W6iRFyIT2v0SgIA",
  },
] as const;

const donts = [
  {
    label: "Sunglasses/Hats",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDnOGKPZQ6BPCh0oFEc8VImlBOJiEAc-bVAMgDe7Qw-8xbgbMZVmLYylwzy0GXI_4fZWYgk3L0NEHOSfsI5X7Xl3f9IExo9fJr8bYgo5aIfR2WfyQvEAMHv8kCMaHzSCsruH3JgkPH9pGv7C1jEvxPc7LgwO4DffNWkA5Ra9bDWJphXG_EESb4ZMekl7T-sjP0OXbsAdX86Dw0VGghwUgwBTwto2b1L9Rb-2hc1DTkk7gfgRk4eVu072jHJ1fhGGW7QmizGlB2mcA",
    icon: EyeOff,
  },
  {
    label: "Group Photos",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB33gPPK1PlEaufa_pTNTuyygm9h6PrrH3nRBKf2WYQiL6kCMrlPnbf56zMrnoPwk2ZptUMqiK1gfmyGHz507Q55MdPNfQ2rtLQSMf325tvQnSLy6scyTZfBMw_Ztj6LaFEtvGyOQgV57PpYOjNd55-nqS5WaHppFzPJnoccGFY5XEXz5SOhNc7qeUNxoAsNbM0o-7peJ9KJFgW2IHmCbVhQtX8_jyA_PjkQO7xLU1tCrL0A75hWvtlip1HF3lcWd1Q7F4lFlDxCQ",
    icon: Users,
  },
] as const;

export default function PhotoGuidelines() {
  return (
    <aside className="space-y-[var(--spacing-gutter)]">
      <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-6">
        <h3 className="text-headline-md mb-[var(--spacing-stack-sm)] text-primary">
          Photo Guidelines
        </h3>
        <p className="text-body-md mb-6 text-on-surface-variant">
          For the best AI results, follow these professional standards.
        </p>

        <div className="mb-6">
          <div className="text-label-sm mb-3 flex items-center gap-2 text-on-tertiary-container">
            <CheckCircle className="h-5 w-5" />
            <span>DO&apos;S</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {dos.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="aspect-square overflow-hidden rounded-lg border-2 border-tertiary-fixed bg-surface-container-highest">
                  <img src={item.image} alt={item.label} className="h-full w-full object-cover" />
                </div>
                <p className="text-label-xs text-on-surface-variant">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-label-sm mb-3 flex items-center gap-2 text-error">
            <XCircle className="h-5 w-5" />
            <span>DON&apos;TS</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {donts.map((item) => (
              <div key={item.label} className="relative">
                <div className="aspect-square overflow-hidden rounded-lg bg-surface-container-highest grayscale opacity-60">
                  <img src={item.image} alt={item.label} className="h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <item.icon className="h-8 w-8 text-white drop-shadow-md" />
                </div>
                <p className="mt-2 text-label-xs text-on-surface-variant">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
