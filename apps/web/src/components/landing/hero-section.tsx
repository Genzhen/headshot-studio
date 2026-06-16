"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const avatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC05N467h7ewSHRjy5FV7MdeJS0986E1WaZjiVBBRxtavt5xldkr-SgvnamxkVWjum_-TOouU1_iv-nFT1zHSQ4kDdVzy7kwVWhA2W_doaWfqFaHtw5rEfvVS5u9arLwAddXMXKCOPIJT7lzjp6R29c_nsid6DwW6ETUb4gvPLUMNwjHx3Cw2Jui-Z_pPL8e9tOT-Vu464vRPgmZWkX05s1CRrT4t9uGEmBJ5uwoUsm0fQ1M_qnmymSn1T5lYS_ADahI0w7fpehDQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDf6h07rLzndABuHoR3LeTr1X_oGyaVYy-AHmbQEbWBaAZZjppsmCdZgZrGOtT0lLtorFUfDcmNQPTdVtt03vGAGAndt4Ut7X2Odmcb5GO-ZWCsy0SCdFD35QFpl3VkDvnRCPk-upEs1d1QxzWEPV_rWeGg70IHcRy362YSFVUAyGXhi8sO2MoKRCpzs0x2FdgecKfhtv7DH7RGFi55Gvo79Wk72QBRwVNlTDSgKsu3CuEc4OaPccqMsFKaRwLV7_QXOQEC6dry1A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCJPpsfkeSHrCTQHH4LlmUcRE6P0BqBf_dFdgdf9DeM9GvSYKFctwbFPgIw6k4Ex6vtWvmxGMxMOrG_ecJfiYcKlhNun36IFXnAJMRDeXCt5n_20QI1cFq72olo3EW9PNPwwAcOPQ78Mmb0li9HTyIL-cVdeT382J9n6EOrz8wFTtOYXha5ynQaHxGhAYm_t3a0cv0B4hUDY2itHg4T3NYtJwSu4u-nT378DPB2s-6tMI6EggYsa8xMbHFoP7z9Bj-usSaOqNd3Ug",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-[var(--spacing-margin-mobile)] py-20 md:px-[var(--spacing-margin-desktop)] md:py-32">
      <div className="container-max relative z-10 mx-auto grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary-container/10 px-3 py-1.5 text-on-secondary-container">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary-container" />
            <span className="text-label-xs">Trusted by 100,000+ Professionals</span>
          </div>

          <h1 className="mb-6 max-w-xl text-display-lg-mobile text-primary md:text-display-lg">
            Get the perfect professional headshot in 90 minutes.
          </h1>
          <p className="text-body-lg mb-10 max-w-xl text-on-surface-variant">
            Save $1,000s on traditional photoshoots. Over 100,000+ professionals trust us for
            their LinkedIn, Resume, and Team photos.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary-container px-8 py-4 text-label-sm font-bold text-primary shadow-lg transition-all hover:brightness-95 active:scale-95"
            >
              Get Your Photos
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-xl border-2 border-primary-container px-8 py-4 text-label-sm font-bold text-primary-container transition-all hover:bg-primary-container hover:text-white"
            >
              See Gallery
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {avatars.map((avatar, index) => (
                <img
                  key={avatar}
                  src={avatar}
                  alt={`User ${index + 1}`}
                  className="h-10 w-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div className="text-label-xs text-on-surface-variant">
              <div className="mb-1 flex text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span>4.9/5 from 2,000+ reviews</span>
            </div>
          </div>
        </div>

        <div className="relative h-[500px] overflow-hidden rounded-[1.75rem] shadow-2xl md:h-[600px]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSrdBQF-BnKYbBOiqGNCQd7qfLZBdBoJCKdRPi_dRGAEU1CYZA1v539T0UyWa4UTbV6LFMmPPxwR0v6tHv8BSqVwlyBSpWRwJ2e-Tb2jf8v23t_Dm_AyC9QST9sGFV5UXkQZcXBKmj_xlMj6a95-F3Sl96fJX5wNg3rWwsU_S5Dp9mFenuEZ_4xU4SCptdHG3UZYsjCqSbQPSx0IgtF5qmYdY3iZ6EhxmFkXxs5JWXspqCA4sJZ-JxNU4uudyIWQk010dhrLcvlg"
            alt="Professional AI headshot preview"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
          <div className="absolute inset-x-8 bottom-8">
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-label-sm text-primary">AI Generation in progress...</span>
                <span className="text-label-sm font-bold text-secondary-container">87%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-primary/10">
                <div className="h-full w-[87%] animate-pulse bg-secondary-container" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
