import { useLocation } from "react-router";
import { ArticleList } from "@/components/ArticleList.tsx";
import { t } from "@/i18n/index.ts";
import { getAllArticles } from "@/lib/content.ts";
import { getPageCount, getPageItems } from "@/lib/pagination.ts";
import { getBlogPagePath } from "@/lib/routes.ts";
import { resolveSitePage } from "@/lib/site-page.ts";

export default function BlogIndex() {
  const location = useLocation();
  const page = resolveSitePage(location.pathname);
  const lang = page.lang;
  const currentPage = page.kind === "blog" ? page.page : 1;

  const posts = getAllArticles().filter((post) => post.data.lang === lang);
  const totalPages = getPageCount(posts.length);

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-tinyrack-2xl px-tinyrack-lg py-page-y">
      <header>
        <h1 className="text-tinyrack-4xl font-bold">{t(lang, "blog.title")}</h1>
        <p className="mt-tinyrack-md max-w-prose text-tinyrack-lg text-tinyrack-text-muted">
          {t(lang, "blog.description")}
        </p>
      </header>
      <ArticleList
        articles={getPageItems(posts, currentPage)}
        currentPage={currentPage}
        hrefForPage={(target) => getBlogPagePath(lang, target)}
        lang={lang}
        totalPages={totalPages}
      />
    </div>
  );
}
