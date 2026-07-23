import { useLocation } from "react-router";
import { ArticleCard } from "@/components/ArticleCard.tsx";
import { SITE_DESCRIPTIONS } from "@/lib/constants.ts";
import { getAllArticles, getAllTags } from "@/lib/content.ts";
import { resolveSitePage } from "@/lib/site-page.ts";

export default function TagPage() {
  const location = useLocation();
  const page = resolveSitePage(location.pathname);
  const lang = page.lang;
  const slug = page.kind === "tag" ? page.tagSlug : "";

  const tag = getAllTags().find((entry) => entry.slug === slug);
  const tagTitle = tag?.translations[lang]?.title || tag?.name || slug;
  const tagDescription =
    tag?.translations[lang]?.description || SITE_DESCRIPTIONS[lang];
  const posts = getAllArticles().filter(
    (post) => post.data.lang === lang && post.data.tags.includes(slug),
  );

  return (
    <div className="mx-auto flex w-full max-w-content flex-col px-tinyrack-lg py-page-y">
      <h1 className="text-tinyrack-3xl font-bold">{tagTitle}</h1>
      {tagDescription ? (
        <p className="mt-tinyrack-sm text-tinyrack-text-muted">
          {tagDescription}
        </p>
      ) : null}
      <ul className="mt-tinyrack-2xl grid gap-tinyrack-2xl md:grid-cols-2">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} showExcerpt={false} />
        ))}
      </ul>
    </div>
  );
}
