import * as m from "../i18n/paraglide/messages.js";
import type { SupportedLanguageCodes } from "../lib/language.ts";

export type OpenSourceProjectId =
  | "dotweave"
  | "proxer"
  | "tinyauth"
  | "design"
  | "dart-packages";

export type OpenSourceProject = {
  id: OpenSourceProjectId;
  name: string;
  repository: string;
  homepage: string;
  language: string;
  stars: number;
};

export type OpenSourceCopy = {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
  };
  projectsTitle: string;
  repositoryLabel: string;
  starsLabel: string;
};

/** Non-translatable project identity and repository metadata. */
export const OPEN_SOURCE_PROJECTS: readonly OpenSourceProject[] = [
  {
    id: "dotweave",
    name: "Dotweave",
    repository: "https://github.com/tinyrack-net/dotweave",
    homepage: "https://dotweave.tinyrack.net",
    language: "Dart",
    stars: 5,
  },
  {
    id: "proxer",
    name: "Proxer",
    repository: "https://github.com/tinyrack-net/proxer",
    homepage: "https://proxer.tinyrack.net",
    language: "TypeScript",
    stars: 0,
  },
  {
    id: "tinyauth",
    name: "Tinyauth",
    repository: "https://github.com/tinyrack-net/tinyauth",
    homepage: "https://tinyauth.tinyrack.net",
    language: "TypeScript",
    stars: 0,
  },
  {
    id: "design",
    name: "Tinyrack Design",
    repository: "https://github.com/tinyrack-net/design",
    homepage: "https://design.tinyrack.net",
    language: "TypeScript",
    stars: 0,
  },
  {
    id: "dart-packages",
    name: "Dart Packages",
    repository: "https://github.com/tinyrack-net/dart-packages",
    homepage: "https://github.com/tinyrack-net/dart-packages",
    language: "Dart",
    stars: 0,
  },
] as const;

const PROJECT_DESCRIPTION_MESSAGES = {
  dotweave: m.open_source_project_dotweave_description,
  proxer: m.open_source_project_proxer_description,
  tinyauth: m.open_source_project_tinyauth_description,
  design: m.open_source_project_design_description,
  "dart-packages": m.open_source_project_dart_packages_description,
} as const satisfies Record<
  OpenSourceProjectId,
  typeof m.open_source_project_dotweave_description
>;

export function getOpenSourceProjectDescription(
  id: OpenSourceProjectId,
  lang: SupportedLanguageCodes,
): string {
  return PROJECT_DESCRIPTION_MESSAGES[id]({}, { locale: lang });
}

export function getOpenSourceCopy(
  lang: SupportedLanguageCodes,
): OpenSourceCopy {
  const options = { locale: lang } as const;
  const site = m.nav_site({}, options);

  return {
    meta: {
      title: m.open_source_meta_title({ site }, options),
      description: m.open_source_meta_description({}, options),
    },
    hero: {
      eyebrow: m.open_source_hero_eyebrow({}, options),
      title: m.open_source_hero_title({}, options),
      description: m.open_source_hero_description({}, options),
      ctaLabel: m.open_source_hero_cta({}, options),
    },
    projectsTitle: m.open_source_projects_title({}, options),
    repositoryLabel: m.open_source_repository_label({}, options),
    starsLabel: m.open_source_stars_label({}, options),
  };
}
