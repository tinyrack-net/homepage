import { TRBadge } from "@tinyrack/ui/components/badge";
import { TRCard } from "@tinyrack/ui/components/card";
import { TRCodeBlock } from "@tinyrack/ui/components/code-block";
import { TRLinkButton } from "@tinyrack/ui/components/link-button";
import { TRSeparator } from "@tinyrack/ui/components/separator";
import { TRSteps } from "@tinyrack/ui/components/steps";
// lucide-react dropped its brand icons in 1.25, and the design system allows no
// other icon source, so these are the closest generic equivalents.
import {
  ArrowRight,
  Code,
  type LucideIcon,
  MessagesSquare,
  Video,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { ArticleCard } from "@/components/ArticleCard.tsx";
import { landingCopy } from "@/content/landing-copy.ts";
import { getAllArticles } from "@/lib/content.ts";
import { getBlogPath } from "@/lib/routes.ts";
import { langFromPath } from "@/lib/site-page.ts";

const TEASER_COUNT = 3;

const COMMUNITY_ICONS: Record<string, LucideIcon> = {
  Forum: MessagesSquare,
  포럼: MessagesSquare,
  フォーラム: MessagesSquare,
  GitHub: Code,
  YouTube: Video,
};

function Section({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="flex flex-col gap-tinyrack-xl">
      <header className="flex flex-col gap-tinyrack-sm">
        <h2 className="text-tinyrack-3xl font-bold">{title}</h2>
        {description ? (
          <p className="max-w-prose text-tinyrack-text-muted">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

export default function Home() {
  const location = useLocation();
  const lang = langFromPath(location.pathname);
  const copy = landingCopy[lang];
  const hero = copy.hero;

  const posts = getAllArticles()
    .filter((post) => post.data.lang === lang)
    .slice(0, TEASER_COUNT);

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-tinyrack-2xl px-tinyrack-lg py-page-y">
      <section className="flex flex-col items-start gap-tinyrack-lg py-tinyrack-2xl">
        <TRBadge uiSize="sm">{hero.eyebrow}</TRBadge>
        <h1 className="max-w-article text-tinyrack-4xl font-bold leading-tinyrack-sm sm:text-tinyrack-5xl">
          {hero.headline}
        </h1>
        <p className="max-w-prose text-tinyrack-lg text-tinyrack-text-muted">
          {hero.subhead}
        </p>
        <div className="mt-tinyrack-sm flex flex-wrap gap-tinyrack-md">
          <TRLinkButton
            href={hero.primaryCta.href}
            intent="primary"
            rel="noopener noreferrer"
            target="_blank"
            uiSize="lg"
          >
            {hero.primaryCta.label}
          </TRLinkButton>
          <TRLinkButton
            appearance="outline"
            render={<Link to={getBlogPath(lang)} />}
            uiSize="lg"
          >
            {hero.secondaryCtaLabel}
          </TRLinkButton>
        </div>
      </section>

      <TRSeparator />

      <Section description={copy.values.intro} title={copy.values.title}>
        <ul className="grid gap-tinyrack-lg sm:grid-cols-2">
          {copy.values.items.map((item) => (
            <li className="flex" key={item.title}>
              <TRCard.Root className="w-full" padding="lg" variant="outlined">
                <TRCard.Title
                  className="text-tinyrack-lg font-bold"
                  // biome-ignore lint/a11y/useHeadingContent: Base UI injects the title content into this render slot.
                  render={<h3 />}
                >
                  {item.title}
                </TRCard.Title>
                <TRCard.Description className="mt-tinyrack-sm text-tinyrack-text-muted">
                  {item.body}
                </TRCard.Description>
              </TRCard.Root>
            </li>
          ))}
        </ul>
      </Section>

      <Section description={copy.products.intro} title={copy.products.title}>
        <ul className="flex flex-col gap-tinyrack-lg">
          {copy.products.items.map((product) => (
            <li key={product.name}>
              <TRCard.Root padding="lg" variant="elevated">
                <div className="flex flex-wrap items-center gap-tinyrack-sm">
                  <TRCard.Title
                    className="text-tinyrack-2xl font-bold"
                    // biome-ignore lint/a11y/useHeadingContent: Base UI injects the title content into this render slot.
                    render={<h3 />}
                  >
                    {product.name}
                  </TRCard.Title>
                  <TRBadge uiSize="sm" variant="success">
                    {product.license}
                  </TRBadge>
                </div>
                <p className="mt-tinyrack-sm font-medium text-tinyrack-text">
                  {product.tagline}
                </p>
                <TRCard.Description className="mt-tinyrack-md max-w-prose text-tinyrack-text-muted">
                  {product.description}
                </TRCard.Description>
                <ul className="mt-tinyrack-lg flex list-disc flex-col gap-tinyrack-xs ps-tinyrack-lg text-tinyrack-sm text-tinyrack-text-muted">
                  {product.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {product.install ? (
                  <div className="mt-tinyrack-lg">
                    <TRCodeBlock code={product.install} language="bash" />
                  </div>
                ) : null}
                <div className="mt-tinyrack-lg flex flex-wrap gap-tinyrack-md">
                  <TRLinkButton
                    appearance="outline"
                    href={product.repoHref}
                    rel="noopener noreferrer"
                    target="_blank"
                    uiSize="sm"
                  >
                    GitHub
                  </TRLinkButton>
                  {product.siteHref ? (
                    <TRLinkButton
                      appearance="ghost"
                      href={product.siteHref}
                      rel="noopener noreferrer"
                      target="_blank"
                      uiSize="sm"
                    >
                      {product.name}
                      <ArrowRight aria-hidden="true" />
                    </TRLinkButton>
                  ) : null}
                </div>
              </TRCard.Root>
            </li>
          ))}
        </ul>
      </Section>

      <Section description={copy.start.intro} title={copy.start.title}>
        <TRSteps.Root>
          {copy.start.steps.map((step) => (
            <TRSteps.Item key={step.title}>
              <p className="font-bold text-tinyrack-text">{step.title}</p>
              <p className="mt-tinyrack-xs max-w-prose text-tinyrack-text-muted">
                {step.body}
              </p>
            </TRSteps.Item>
          ))}
        </TRSteps.Root>
      </Section>

      <Section description={copy.community.intro} title={copy.community.title}>
        <ul className="grid gap-tinyrack-lg sm:grid-cols-3">
          {copy.community.links.map((link) => {
            const Icon = COMMUNITY_ICONS[link.label];
            return (
              <li className="flex" key={link.href}>
                <TRCard.Root
                  className="group relative w-full"
                  padding="lg"
                  variant="outlined"
                >
                  {Icon ? (
                    <Icon
                      aria-hidden="true"
                      className="text-tinyrack-text-muted"
                    />
                  ) : null}
                  <TRCard.Title
                    className="mt-tinyrack-md text-tinyrack-lg font-bold"
                    // biome-ignore lint/a11y/useHeadingContent: Base UI injects the title content into this render slot.
                    render={<h3 />}
                  >
                    <a
                      className="text-tinyrack-text no-underline before:absolute before:inset-0 group-hover:underline"
                      href={link.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  </TRCard.Title>
                  <TRCard.Description className="mt-tinyrack-sm text-tinyrack-sm text-tinyrack-text-muted">
                    {link.description}
                  </TRCard.Description>
                </TRCard.Root>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title={copy.latest.title}>
        {posts.length === 0 ? (
          <p className="text-tinyrack-text-muted">{copy.latest.empty}</p>
        ) : (
          <ul className="grid gap-tinyrack-lg md:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} showExcerpt={false} />
            ))}
          </ul>
        )}
        <div>
          <TRLinkButton
            appearance="outline"
            render={<Link to={getBlogPath(lang)} />}
          >
            {copy.latest.linkLabel}
            <ArrowRight aria-hidden="true" />
          </TRLinkButton>
        </div>
      </Section>
    </div>
  );
}
