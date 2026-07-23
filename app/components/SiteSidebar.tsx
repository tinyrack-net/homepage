import { TRBadge } from "@tinyrack/ui/components/badge";
import { TRLanguageSelect } from "@tinyrack/ui/components/language-select";
import { TRLink } from "@tinyrack/ui/components/link";
import { TRSeparator } from "@tinyrack/ui/components/separator";
import { useNavigate } from "react-router";
import { t } from "@/i18n/index.ts";
import { getNavigationTags } from "@/lib/content.ts";
import { LOCALE_INFO, type SupportedLanguageCodes } from "@/lib/language.ts";
import { getContentPath, getHomePath, getTagPath } from "@/lib/routes.ts";
import { RouterLink } from "./RouterLink.tsx";
import { ThemeSwitcher } from "./ThemeSwitcher.tsx";

export type LanguageLink = {
  lang: SupportedLanguageCodes;
  href: string;
  label: string;
};

const PRODUCT_LINKS = [
  { label: "Dotweave", href: "https://dotweave.tinyrack.net" },
  { label: "Proxer", href: "https://proxer.tinyrack.net" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <li className="my-tinyrack-sm font-semibold text-tinyrack-text-muted">
      {children}
    </li>
  );
}

export function SiteSidebar({
  lang,
  languageLinks,
  onNavigate,
}: {
  lang: SupportedLanguageCodes;
  languageLinks: LanguageLink[];
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();
  const tags = getNavigationTags();

  const labels = {
    site: t(lang, "nav.site"),
    home: t(lang, "nav.home"),
    about: t(lang, "nav.about"),
    tags: t(lang, "nav.tags"),
    links: t(lang, "nav.links"),
    forum: t(lang, "nav.forum"),
    auto: t(lang, "theme.auto"),
    light: t(lang, "theme.light"),
    dark: t(lang, "theme.dark"),
  };

  const externalLinks = [
    { label: labels.forum, href: "https://forum.tinyrack.net/" },
    { label: "winetree94", href: "https://winetree94.com" },
    { label: "YouTube", href: "https://www.youtube.com/@tinyrack" },
  ];

  return (
    <div className="flex min-h-full w-60 flex-col gap-tinyrack-lg bg-tinyrack-surface-muted p-tinyrack-lg">
      <div className="flex flex-1 flex-col">
        <ul className="flex w-full flex-col">
          <SectionLabel>{labels.site}</SectionLabel>
          <li>
            <RouterLink onClick={onNavigate} to={getHomePath(lang)}>
              {labels.home}
            </RouterLink>
          </li>
          <li>
            <RouterLink onClick={onNavigate} to={getContentPath(lang, "about")}>
              {labels.about}
            </RouterLink>
          </li>
          <SectionLabel>{labels.tags}</SectionLabel>
        </ul>
        <div className="mt-tinyrack-sm flex flex-wrap gap-tinyrack-sm">
          {tags.map((tag) => (
            <RouterLink
              key={tag.slug}
              onClick={onNavigate}
              to={getTagPath(lang, tag.slug)}
              underline="none"
            >
              <TRBadge>{tag.translations[lang]?.title || tag.name}</TRBadge>
            </RouterLink>
          ))}
        </div>
        <ul className="mt-tinyrack-lg flex w-full flex-col">
          <SectionLabel>Products</SectionLabel>
          {PRODUCT_LINKS.map((link) => (
            <li key={link.href}>
              <TRLink
                href={link.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label}
              </TRLink>
            </li>
          ))}
          <SectionLabel>{labels.links}</SectionLabel>
          {externalLinks.map((link) => (
            <li key={link.href}>
              <TRLink
                href={link.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label}
              </TRLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-tinyrack-md">
        <TRSeparator />
        <ThemeSwitcher labels={labels} />
        <TRLanguageSelect
          label={LOCALE_INFO[lang]}
          onValueChange={(value) => {
            const target = languageLinks.find((link) => link.lang === value);
            if (target) {
              onNavigate?.();
              navigate(target.href);
            }
          }}
          options={languageLinks.map((link) => ({
            label: link.label,
            value: link.lang,
            language: link.lang,
          }))}
          value={lang}
        />
      </div>
    </div>
  );
}
