import { TRLinkButton } from "@tinyrack/ui/components/link-button";
import { TRText } from "@tinyrack/ui/components/text";
import { ArrowRight, Code2 } from "lucide-react";
import type { ComponentType } from "react";
import { Link, useLocation } from "react-router";
import { HomeArticleTeaser } from "@/components/HomeArticleTeaser.tsx";
import {
  CircuitVisual,
  OpenSourceVisual,
  RackVisual,
  SelfHostVisual,
  SimplicityVisual,
} from "@/components/HomeVisuals.tsx";
import { landingCopy } from "@/content/landing-copy.ts";
import { LINKS } from "@/lib/constants.ts";
import { getAllArticles } from "@/lib/content.ts";
import {
  getBlogPath,
  getContentPath,
  getOpenSourcePath,
} from "@/lib/routes.ts";
import { langFromPath } from "@/lib/site-page.ts";

const TEASER_COUNT = 3;

/** One illustration per authored principle, in copy order. */
const PRINCIPLE_VISUALS: readonly ComponentType<{ className?: string }>[] = [
  OpenSourceVisual,
  SelfHostVisual,
  SimplicityVisual,
];

function SectionHeader({
  description,
  link,
  title,
}: {
  description?: string;
  link?: { href: string; label: string };
  title: string;
}) {
  return (
    <div className="flex items-end justify-between gap-tinyrack-lg">
      <div className="min-w-0">
        <TRText as="h2" className="m-0" variant="headingLg" weight="heading">
          {title}
        </TRText>
        {description ? (
          <TRText
            as="p"
            className="mt-tinyrack-sm mb-0 max-w-prose"
            color="muted"
            variant="body"
          >
            {description}
          </TRText>
        ) : null}
      </div>
      {link ? (
        <TRLinkButton
          appearance="ghost"
          className="max-md:hidden"
          render={<Link to={link.href} />}
        >
          {link.label}
          <ArrowRight aria-hidden="true" />
        </TRLinkButton>
      ) : null}
    </div>
  );
}

export default function Home() {
  const location = useLocation();
  const lang = langFromPath(location.pathname);
  const copy = landingCopy[lang];
  const posts = getAllArticles()
    .filter((post) => post.data.lang === lang)
    .slice(0, TEASER_COUNT);
  const headlineLabel = copy.hero.headline
    .map((line) => line.map((segment) => segment.text).join(""))
    .join(lang === "ja" ? "" : " ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="wide-shell">
      <section className="grid gap-tinyrack-3xl py-tinyrack-4xl md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center md:py-tinyrack-5xl">
        <div>
          <TRText
            as="p"
            className="m-0 mb-tinyrack-xl flex flex-wrap items-center gap-0 [&>span+span]:before:px-tinyrack-md [&>span+span]:before:text-tinyrack-border-strong [&>span+span]:before:content-['/']"
            color="muted"
            variant="label"
          >
            {copy.hero.eyebrow.map((part) => (
              <TRText as="span" key={part} variant="label">
                {part}
              </TRText>
            ))}
          </TRText>

          <TRText
            aria-label={headlineLabel}
            as="h1"
            className="m-0 text-balance text-tinyrack-5xl leading-tinyrack-sm md:text-tinyrack-6xl md:leading-tinyrack-xs [&>span]:block"
            variant="displayLg"
            weight="bold"
          >
            {copy.hero.headline.map((line) => (
              <span key={line.map(({ text }) => text).join("")}>
                {line.map((segment) => (
                  <span
                    className={
                      segment.tone === "inverse"
                        ? "inline-block whitespace-pre-wrap bg-tinyrack-surface-inverse px-tinyrack-sm text-tinyrack-text-inverse"
                        : segment.tone === "muted"
                          ? "inline-block whitespace-pre-wrap bg-tinyrack-surface-muted px-tinyrack-sm"
                          : "whitespace-pre-wrap"
                    }
                    key={`${segment.tone ?? "default"}-${segment.text}`}
                  >
                    {segment.text}
                  </span>
                ))}
              </span>
            ))}
          </TRText>

          <TRText
            as="p"
            className="mt-tinyrack-2xl mb-0 max-w-prose"
            color="muted"
            variant="body"
          >
            {copy.hero.subhead}
          </TRText>

          <div className="mt-tinyrack-2xl flex flex-wrap gap-tinyrack-md">
            <TRLinkButton
              intent="primary"
              render={<Link to={getOpenSourcePath(lang)} />}
              uiSize="lg"
            >
              {copy.hero.primaryCtaLabel}
            </TRLinkButton>
            <TRLinkButton
              appearance="outline"
              render={<Link to={getContentPath(lang, "about")} />}
              uiSize="lg"
            >
              {copy.hero.secondaryCtaLabel}
            </TRLinkButton>
          </div>
        </div>

        <div className="hidden justify-center md:flex">
          <RackVisual className="w-full max-w-tinyrack-measure-2xl" />
        </div>
      </section>

      <section className="flex flex-col gap-tinyrack-3xl border-t border-tinyrack-border py-tinyrack-3xl">
        <TRText as="h2" className="m-0 uppercase" color="muted" variant="label">
          {copy.values.title}
        </TRText>
        {copy.values.items.map((item, index) => {
          const Visual = PRINCIPLE_VISUALS[index % PRINCIPLE_VISUALS.length];

          return (
            <div
              className="grid items-center gap-tinyrack-2xl md:grid-cols-2 md:gap-tinyrack-3xl"
              data-home-principle
              key={item.title}
            >
              <div
                className={`overflow-hidden rounded-tinyrack-lg border border-tinyrack-border bg-tinyrack-surface-muted${
                  index % 2 === 1 ? " md:order-last" : ""
                }`}
              >
                {Visual ? <Visual className="block w-full" /> : null}
              </div>
              <div>
                <TRText
                  as="h3"
                  className="m-0 text-balance"
                  variant="display"
                  weight="bold"
                >
                  {item.title}
                </TRText>
                <TRText
                  as="p"
                  className="mt-tinyrack-lg mb-0 max-w-prose"
                  color="muted"
                  variant="body"
                >
                  {item.description}
                </TRText>
              </div>
            </div>
          );
        })}
      </section>

      <section className="border-t border-tinyrack-border py-tinyrack-3xl">
        <div className="flex flex-col gap-tinyrack-2xl rounded-tinyrack-lg bg-tinyrack-surface-muted p-tinyrack-2xl md:p-tinyrack-3xl">
          <div className="flex flex-col gap-tinyrack-xl md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 max-w-prose">
              <TRText
                as="h2"
                className="m-0"
                variant="headingLg"
                weight="heading"
              >
                {copy.work.title}
              </TRText>
              <TRText
                as="p"
                className="mt-tinyrack-sm mb-0 max-w-prose"
                color="muted"
                variant="body"
              >
                {copy.work.description}
              </TRText>
            </div>
            <div className="flex shrink-0 flex-wrap gap-tinyrack-md">
              <TRLinkButton
                intent="primary"
                render={<Link to={getOpenSourcePath(lang)} />}
                uiSize="lg"
              >
                {copy.work.ctaLabel}
                <ArrowRight aria-hidden="true" />
              </TRLinkButton>
              <TRLinkButton
                appearance="outline"
                href={LINKS.GITHUB}
                rel="noopener noreferrer"
                target="_blank"
                uiSize="lg"
              >
                <Code2 aria-hidden="true" />
                {copy.work.githubCtaLabel}
              </TRLinkButton>
            </div>
          </div>
          <CircuitVisual className="hidden w-full md:block" />
        </div>
      </section>

      <section className="flex flex-col gap-tinyrack-2xl border-t border-tinyrack-border py-tinyrack-3xl">
        <SectionHeader
          description={copy.blog.description}
          link={{ href: getBlogPath(lang), label: copy.blog.linkLabel }}
          title={copy.blog.title}
        />
        {posts.length === 0 ? (
          <TRText as="p" className="m-0" color="muted" variant="body">
            {copy.blog.empty}
          </TRText>
        ) : (
          <ul className="grid gap-x-tinyrack-xl gap-y-tinyrack-2xl md:grid-cols-3">
            {posts.map((post) => (
              <HomeArticleTeaser key={post.id} post={post} />
            ))}
          </ul>
        )}
        <div className="md:hidden">
          <TRLinkButton
            appearance="outline"
            render={<Link to={getBlogPath(lang)} />}
          >
            {copy.blog.linkLabel}
            <ArrowRight aria-hidden="true" />
          </TRLinkButton>
        </div>
      </section>
    </div>
  );
}
