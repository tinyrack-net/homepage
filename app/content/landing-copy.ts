import * as m from "@/i18n/paraglide/messages.js";
import type { SupportedLanguageCodes } from "@/lib/language.ts";

/**
 * Landing page structure.
 *
 * Natural-language copy lives in the Paraglide catalogs. This module only
 * assembles those typed messages into the authored visual structure: two hero
 * lines and three principle rows in a stable order.
 */

export type LandingHeadlineSegment = {
  text: string;
  tone?: "inverse" | "muted";
};

export type LandingValueItem = {
  title: string;
  description: string;
};

export type LandingCopy = {
  hero: {
    /** Rendered as slash-separated fragments. */
    eyebrow: readonly string[];
    /** One entry per authored line, with optional semantic emphasis. */
    headline: readonly (readonly LandingHeadlineSegment[])[];
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    subhead: string;
  };
  values: {
    title: string;
    items: readonly LandingValueItem[];
  };
  work: {
    title: string;
    description: string;
    ctaLabel: string;
    githubCtaLabel: string;
  };
  blog: {
    title: string;
    description: string;
    linkLabel: string;
    empty: string;
  };
};

export function getLandingCopy(lang: SupportedLanguageCodes): LandingCopy {
  const options = { locale: lang } as const;

  return {
    hero: {
      eyebrow: [
        m.home_hero_eyebrow_open_infrastructure({}, options),
        m.home_hero_eyebrow_self_hosted({}, options),
      ],
      headline: [
        [
          {
            text: m.home_hero_headline_first({}, options),
            tone: "inverse",
          },
        ],
        [
          {
            text: m.home_hero_headline_second({}, options),
            tone: "muted",
          },
        ],
      ],
      subhead: m.home_hero_subhead({}, options),
      primaryCtaLabel: m.home_hero_primary_cta({}, options),
      secondaryCtaLabel: m.home_hero_secondary_cta({}, options),
    },
    values: {
      title: m.home_values_title({}, options),
      items: [
        {
          title: m.home_values_open_source_title({}, options),
          description: m.home_values_open_source_description({}, options),
        },
        {
          title: m.home_values_self_hosting_title({}, options),
          description: m.home_values_self_hosting_description({}, options),
        },
        {
          title: m.home_values_simplicity_title({}, options),
          description: m.home_values_simplicity_description({}, options),
        },
      ],
    },
    work: {
      title: m.home_work_title({}, options),
      description: m.home_work_description({}, options),
      ctaLabel: m.home_work_cta({}, options),
      githubCtaLabel: m.home_work_github_cta({}, options),
    },
    blog: {
      title: m.home_blog_title({}, options),
      description: m.home_blog_description({}, options),
      linkLabel: m.home_blog_link({}, options),
      empty: m.home_blog_empty({}, options),
    },
  };
}
