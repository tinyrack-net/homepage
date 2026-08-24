import { useLocation } from "react-router";
import { ArticleList } from "@/components/ArticleList.tsx";
import { getAllArticles, getAllTags } from "@/lib/content.ts";
import { getPageCount, getPageItems } from "@/lib/pagination.ts";
import { getTagPagePath } from "@/lib/routes.ts";
import { resolveSitePage } from "@/lib/site-page.ts";

export default function TagPage() {
  const location = useLocation();
  const page = resolveSitePage(location.pathname);
  const lang = page.lang;
  const slug = page.kind === "tag" ? page.tagSlug : "";
  const currentPage = page.kind === "tag" ? page.page : 1;

  const tag = getAllTags().find((entry) => entry.slug === slug);
  const tagTitle = tag?.translations[lang]?.title || tag?.name || slug;
  const tagDescription = tag?.translations[lang]?.description;
  const posts = getAllArticles().filter(
    (post) => post.data.lang === lang && post.data.tags.includes(slug),
  );
  const totalPages = getPageCount(posts.length);

  return (
    <div className="page-shell flex flex-col gap-tinyrack-2xl py-tinyrack-3xl">
      <header>
        <h1 className="text-tinyrack-3xl font-tinyrack-bold">{tagTitle}</h1>
        {tagDescription ? (
          <p className="mt-tinyrack-lg max-w-tinyrack-measure-xl text-tinyrack-text-muted">
            {tagDescription}
          </p>
        ) : null}
      </header>
      <ArticleList
        articles={getPageItems(posts, currentPage)}
        currentPage={currentPage}
        hrefForPage={(target) => getTagPagePath(lang, slug, target)}
        lang={lang}
        showExcerpt={false}
        totalPages={totalPages}
      />
    </div>
  );
}
