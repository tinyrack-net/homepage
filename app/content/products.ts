import * as m from "@/i18n/paraglide/messages.js";
import type { SupportedLanguageCodes } from "@/lib/language.ts";

export type ProductsCopy = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
};

/** The products overview is still a coming-soon state. Its copy is assembled
 * from the central Paraglide catalog so every locale stays type checked. */
export function getProductsCopy(lang: SupportedLanguageCodes): ProductsCopy {
  const options = { locale: lang } as const;

  return {
    eyebrow: m.products_eyebrow({}, options),
    title: m.products_title({}, options),
    description: m.products_description({}, options),
    ctaLabel: m.products_cta({}, options),
  };
}
