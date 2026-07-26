import { TRLinkButton } from "@tinyrack/ui/components/link-button";
import { TRText } from "@tinyrack/ui/components/text";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { ArticleCard } from "@/components/ArticleCard.tsx";
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

  return (
    <div className="page-shell">
      {/* The statement is the visual. No mock, no illustration — the page
          should still stand when the product lineup changes. */}
      <section className="flex min-h-[max(24rem,68dvh)] flex-col justify-center py-[clamp(3rem,10vw,7rem)]">
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
          aria-label={copy.hero.headline.join(" ")}
          as="h1"
          // No `ch` max-width: it is calibrated to Latin figures and squeezes
          // CJK hard enough to break words mid-character. The line breaks are
          // authored per locale, so the container is the only bound needed.
          className="m-0 text-balance [&>span]:block"
          variant="display"
          weight="bold"
        >
          {copy.hero.headline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </TRText>

        <TRText
          as="p"
          className="mt-tinyrack-2xl mb-0 max-w-prose max-md:hidden"
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
      </section>

      <section className="flex flex-col gap-tinyrack-xl border-t border-tinyrack-border py-[clamp(3rem,7vw,5.5rem)]">
        <TRText as="h2" className="m-0" variant="headingLg" weight="heading">
          {copy.latest.title}
        </TRText>
        {posts.length === 0 ? (
          <TRText as="p" className="m-0" color="muted" variant="body">
            {copy.latest.empty}
          </TRText>
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
      </section>
    </div>
  );
}
