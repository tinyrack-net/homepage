import { TRLinkButton } from "@tinyrack/ui/components/link-button";
import { TRText } from "@tinyrack/ui/components/text";
import { ArrowRight, Code2 } from "lucide-react";
import type { ComponentType } from "react";
import { Link, useLocation } from "react-router";
import { HomeArticleTeaser } from "@/components/HomeArticleTeaser.tsx";
import {
  DataCenterVisual,
  OpenSourceVisual,
  SelfHostVisual,
  SimplicityVisual,
} from "@/components/HomeVisuals.tsx";
import * as m from "@/i18n/paraglide/messages.js";
import { LINKS } from "@/lib/constants.ts";
import { getAllArticles } from "@/lib/content.ts";
import {
  getBlogPath,
  getContentPath,
  getOpenSourcePath,
} from "@/lib/routes.ts";
import { langFromPath } from "@/lib/site-page.ts";

const TEASER_COUNT = 3;

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
            className="mt-tinyrack-sm mb-0 max-w-tinyrack-measure-xl"
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
  const messageOptions = { locale: lang } as const;
  const posts = getAllArticles()
    .filter((post) => post.data.lang === lang)
    .slice(0, TEASER_COUNT);
  const heroHeadline = [
    m.home_hero_headline_first({}, messageOptions),
    m.home_hero_headline_second({}, messageOptions),
  ];
  const headlineLabel = heroHeadline
    .join(lang === "ja" ? "" : " ")
    .replace(/\s+/g, " ")
    .trim();
  const principles: readonly {
    title: string;
    description: string;
    Visual: ComponentType<{ className?: string }>;
  }[] = [
    {
      title: m.home_values_open_source_title({}, messageOptions),
      description: m.home_values_open_source_description({}, messageOptions),
      Visual: OpenSourceVisual,
    },
    {
      title: m.home_values_self_hosting_title({}, messageOptions),
      description: m.home_values_self_hosting_description({}, messageOptions),
      Visual: SelfHostVisual,
    },
    {
      title: m.home_values_simplicity_title({}, messageOptions),
      description: m.home_values_simplicity_description({}, messageOptions),
      Visual: SimplicityVisual,
    },
  ];

  return (
    <div className="wide-shell">
      <section className="py-tinyrack-3xl">
        <div className="home-hero-visual mb-tinyrack-3xl flex justify-center overflow-hidden">
          <DataCenterVisual className="home-hero-visual-stage w-full shrink-0" />
        </div>

        <div className="max-w-tinyrack-measure-xl">
          <TRText
            as="p"
            className="m-0 mb-tinyrack-xl flex flex-wrap items-center [&>span+span]:before:px-tinyrack-md [&>span+span]:before:text-tinyrack-border-strong [&>span+span]:before:content-['/']"
            color="muted"
            variant="label"
          >
            {[
              m.home_hero_eyebrow_open_infrastructure({}, messageOptions),
              m.home_hero_eyebrow_self_hosted({}, messageOptions),
            ].map((part) => (
              <TRText as="span" key={part} variant="label">
                {part}
              </TRText>
            ))}
          </TRText>

          <TRText
            aria-label={headlineLabel}
            as="h1"
            className="home-hero-title m-0 text-balance text-tinyrack-5xl leading-tinyrack-sm md:text-tinyrack-6xl md:leading-tinyrack-xs [&>span]:block"
            variant="displayLg"
            weight="bold"
          >
            {heroHeadline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </TRText>

          <TRText
            as="p"
            className="mt-tinyrack-2xl mb-0 max-w-tinyrack-measure-xl"
            color="muted"
            variant="body"
          >
            {m.home_hero_subhead({}, messageOptions)}
          </TRText>

          <div className="mt-tinyrack-2xl flex flex-wrap gap-tinyrack-md">
            <TRLinkButton
              intent="primary"
              render={<Link to={getOpenSourcePath(lang)} />}
              uiSize="lg"
            >
              {m.home_hero_primary_cta({}, messageOptions)}
            </TRLinkButton>
            <TRLinkButton
              appearance="outline"
              render={<Link to={getContentPath(lang, "about")} />}
              uiSize="lg"
            >
              {m.home_hero_secondary_cta({}, messageOptions)}
            </TRLinkButton>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-tinyrack-3xl border-t-tinyrack-default border-tinyrack-border py-tinyrack-3xl">
        <TRText as="h2" className="m-0 uppercase" color="muted" variant="label">
          {m.home_values_title({}, messageOptions)}
        </TRText>
        {principles.map(({ description, title, Visual }, index) => {
          return (
            <div
              className="grid items-center gap-tinyrack-2xl md:grid-cols-2 md:gap-tinyrack-3xl"
              data-home-principle
              key={title}
            >
              <div
                className={`overflow-hidden rounded-tinyrack-lg border border-tinyrack-border bg-tinyrack-surface-muted${
                  index % 2 === 1 ? " md:order-last" : ""
                }`}
              >
                <Visual className="block w-full" />
              </div>
              <div>
                <TRText
                  as="h3"
                  className="m-0 text-balance"
                  variant="display"
                  weight="bold"
                >
                  {title}
                </TRText>
                <TRText
                  as="p"
                  className="mt-tinyrack-lg mb-0 max-w-tinyrack-measure-xl"
                  color="muted"
                  variant="body"
                >
                  {description}
                </TRText>
              </div>
            </div>
          );
        })}
      </section>

      <section className="border-t-tinyrack-default border-tinyrack-border py-tinyrack-3xl">
        <div className="flex flex-col gap-tinyrack-2xl rounded-tinyrack-lg bg-tinyrack-surface-muted p-tinyrack-2xl md:p-tinyrack-3xl">
          <div className="flex flex-col gap-tinyrack-xl md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 max-w-tinyrack-measure-xl">
              <TRText
                as="h2"
                className="m-0"
                variant="headingLg"
                weight="heading"
              >
                {m.home_work_title({}, messageOptions)}
              </TRText>
              <TRText
                as="p"
                className="mt-tinyrack-sm mb-0 max-w-tinyrack-measure-xl"
                color="muted"
                variant="body"
              >
                {m.home_work_description({}, messageOptions)}
              </TRText>
            </div>
            <div className="flex shrink-0 flex-wrap gap-tinyrack-md">
              <TRLinkButton
                intent="primary"
                render={<Link to={getOpenSourcePath(lang)} />}
                uiSize="lg"
              >
                {m.home_work_cta({}, messageOptions)}
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
                {m.home_work_github_cta({}, messageOptions)}
              </TRLinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-tinyrack-2xl border-t-tinyrack-default border-tinyrack-border py-tinyrack-3xl">
        <SectionHeader
          description={m.home_blog_description({}, messageOptions)}
          link={{
            href: getBlogPath(lang),
            label: m.home_blog_link({}, messageOptions),
          }}
          title={m.home_blog_title({}, messageOptions)}
        />
        {posts.length === 0 ? (
          <TRText as="p" className="m-0" color="muted" variant="body">
            {m.home_blog_empty({}, messageOptions)}
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
            {m.home_blog_link({}, messageOptions)}
            <ArrowRight aria-hidden="true" />
          </TRLinkButton>
        </div>
      </section>
    </div>
  );
}
