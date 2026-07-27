import { TRLinkButton } from "@tinyrack/ui/components/link-button";
import { TRText } from "@tinyrack/ui/components/text";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { HomeArticleTeaser } from "@/components/HomeArticleTeaser.tsx";
import { landingCopy } from "@/content/landing-copy.ts";
import { getAllArticles } from "@/lib/content.ts";
import { getBlogPath, getContentPath } from "@/lib/routes.ts";
import { langFromPath } from "@/lib/site-page.ts";

const TEASER_COUNT = 3;

export default function Home() {
  const location = useLocation();
  const lang = langFromPath(location.pathname);
  const copy = landingCopy[lang];
  const posts = getAllArticles()
    .filter((post) => post.data.lang === lang)
    .slice(0, TEASER_COUNT);
  const [featuredPost, ...recentPosts] = posts;
  const headlineLabel = copy.hero.headline
    .map((line) => line.map((segment) => segment.text).join(""))
    .join(lang === "ja" ? "" : " ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="wide-shell">
      <section className="grid gap-tinyrack-3xl py-tinyrack-4xl md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:py-tinyrack-5xl">
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
              render={<Link to={getBlogPath(lang)} />}
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

        {featuredPost ? (
          <ul className="grid min-w-0">
            <HomeArticleTeaser
              featured
              post={featuredPost}
              label={copy.featured.label}
            />
          </ul>
        ) : null}
      </section>

      <section className="flex flex-col gap-tinyrack-2xl border-t border-tinyrack-border py-tinyrack-3xl">
        <div className="flex items-end justify-between gap-tinyrack-lg">
          <TRText as="h2" className="m-0" variant="headingLg" weight="heading">
            {copy.recent.title}
          </TRText>
          <TRLinkButton
            appearance="ghost"
            className="max-md:hidden"
            render={<Link to={getBlogPath(lang)} />}
          >
            {copy.recent.linkLabel}
            <ArrowRight aria-hidden="true" />
          </TRLinkButton>
        </div>
        {recentPosts.length === 0 ? (
          <TRText as="p" className="m-0" color="muted" variant="body">
            {copy.recent.empty}
          </TRText>
        ) : (
          <ul className="grid gap-x-tinyrack-xl gap-y-tinyrack-3xl md:grid-cols-2">
            {recentPosts.map((post) => (
              <HomeArticleTeaser key={post.id} post={post} />
            ))}
          </ul>
        )}
        <div className="md:hidden">
          <TRLinkButton
            appearance="outline"
            render={<Link to={getBlogPath(lang)} />}
          >
            {copy.recent.linkLabel}
            <ArrowRight aria-hidden="true" />
          </TRLinkButton>
        </div>
      </section>
    </div>
  );
}
