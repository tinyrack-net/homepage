import type { SupportedLanguageCodes } from "@/lib/language.ts";

/**
 * The official lockup, taken from the design system rather than typeset.
 *
 * Korean surfaces use the Korean lockup and every other language uses the Latin
 * one, chosen by the language of the page. The two artworks share a 38-unit
 * height but differ in width, so they are sized by height only — scaling the
 * Korean lockup to a fixed width would distort it.
 *
 * Light and dark are two separate approved files rather than one file
 * recoloured, so both are rendered and CSS picks one. That keeps the swap in
 * step with `data-theme` without a flash and without JavaScript. Only the light
 * copy is exposed to assistive tech.
 *
 * Files are served from `/brand/`, synced out of `@tinyrack/ui` by
 * `app/vite/brand-assets.ts`, so the URLs stay stable for structured data.
 */
export function BrandLockup({ lang }: { lang: SupportedLanguageCodes }) {
  const korean = lang === "ko";
  const suffix = korean ? "-ko" : "";

  return (
    <span className="inline-flex items-center">
      <img
        alt={korean ? "타이니랙" : "Tinyrack"}
        className="tr-brand-lockup-light block h-tinyrack-control-height-sm w-auto"
        height={38}
        src={`/brand/tinyrack-lockup${suffix}.svg`}
      />
      <img
        alt=""
        aria-hidden="true"
        className="tr-brand-lockup-dark block h-tinyrack-control-height-sm w-auto"
        height={38}
        src={`/brand/tinyrack-lockup${suffix}-inverse.svg`}
      />
    </span>
  );
}
