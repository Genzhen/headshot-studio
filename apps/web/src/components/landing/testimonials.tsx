"use client";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Software Engineer @ FinTech",
    content:
      "I needed a new LinkedIn photo for my job search. This AI generated a headshot better than any photographer I've ever hired. Incredible ROI.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjPErxwV9W7uSh3ydaCICA0tqOoxPt0xfetqb-8Ruf0abLz5MToJnGvwTRnWyGB9W1R9mHq3tD4JWnFB2HnJ2Pj2AvhKQ7v3KfYexI67h3QsOIsM92GQmv341oU72zcj8xPCFUZil472BckwWlfmpjYigJm16nuRrfqucGq5B2FpU2Hid9egfbvQjrEaY9frO4J6Ud3cbQJFYl5gYAvACZfqQg7_bZU7TUYPvQlxeNUES69NRrmj6QS1deGwqK7TIC2V1tc9WWwg",
  },
  {
    name: "Marcus Thompson",
    role: "Luxury Realtor",
    content:
      "As a realtor, my face is my brand. AIGEN Studio gave me 40 different looks to use across all my marketing platforms for the price of a lunch.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCminUMIrCAf0y0uRHDAJuNvgr4ZYd0Q4FTDAOkU3SwJjpVe2IEY9fdIkM0RBDPttF0ZPbxvT93sirWR_PzLOkmvWaHWn13MAUr73PCfFroa2VL2pJt2WZrb_Dvt2YKrPm3hV3X5IYYul0_aW_qwqWjCgnGVrk9c5x0-AAmPAz-hrjsv67cwniCJgddJ7Y25-016QivqzIe1qlSJ3cjOmok3X-coRSDATkqx9hb4HCTZ5eegkyT7RsNnww1uumCakng-NdY8g2f6A",
  },
  {
    name: "David Long",
    role: "Executive VP @ LogiCorp",
    content:
      "The lighting and skin textures are indistinguishable from real photography. Saved my team thousands on our website rebrand.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzCsInDdpn3pFd5zRgdXedNOa-KMw9uRSfQDMDIMzOr2_YPSRYFB0rRz-3cyEATL5iwDe9DwP8Lwr3rTCdcP4nEKlBiCxs_4mXgJNVZ6x0FeCc0cir3gzPlM5nLWwB3pmAICsMaSyHEioSc4f3J7zy6_5yWQROuPA0LEgAe6xWMNE5ZSqcy_LbhD63Q5nXzP1TMSNIPKSK58nHDABxSBKl1Tqu-JY4kXsDpGAMUsm_cLbTanRtwNUyct3dU7uyedATcbYAqKNOhg",
  },
] as const;

export default function Testimonials() {
  return (
    <section className="bg-background px-[var(--spacing-margin-mobile)] py-[var(--spacing-stack-lg)] md:px-[var(--spacing-margin-desktop)]">
      <div className="container-max mx-auto">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="mb-4 text-display-lg-mobile text-primary md:text-headline-md">
              Loved by 100k+ Professionals
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Our users range from startup founders to Fortune 500 executives who value their time
              and brand.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-outline transition-all hover:bg-primary hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-outline transition-all hover:bg-primary hover:text-white">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const featured = index === 1;

            return (
              <article
                key={testimonial.name}
                className={`flex flex-col justify-between rounded-3xl p-8 shadow-sm ${
                  featured ? "bg-primary text-white md:-translate-y-4" : "border border-outline-variant/50 bg-white"
                }`}
              >
                <div>
                  <div className="mb-6 flex text-secondary-container">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className={`mb-8 text-body-md italic ${featured ? "text-white/90" : "text-primary"}`}>
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className={`text-label-sm ${featured ? "text-white" : "text-primary"}`}>
                      {testimonial.name}
                    </p>
                    <p
                      className={`text-label-xs ${
                        featured ? "text-white/70" : "text-on-surface-variant"
                      }`}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
