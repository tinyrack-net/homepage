import { LINKS } from "./constants.ts";

export type SiteLink = {
  href: string;
  label: string;
};

/** Open-source products, shown on the landing, in the drawer, and the footer. */
export const PRODUCT_LINKS: readonly SiteLink[] = [
  { label: "Dotweave", href: "https://dotweave.tinyrack.net" },
  { label: "Proxer", href: "https://proxer.tinyrack.net" },
  { label: "Tinyauth", href: "https://tinyauth.tinyrack.net" },
];

/** Where the work happens outside this site. */
export const SOCIAL_LINKS: readonly SiteLink[] = [
  { label: "Forum", href: LINKS.FORUM },
  { label: "GitHub", href: LINKS.GITHUB },
  { label: "YouTube", href: LINKS.YOUTUBE },
];

export const AUTHOR_LINK: SiteLink = {
  label: "winetree94",
  href: "https://winetree94.com",
};
