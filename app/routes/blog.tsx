import { TRText } from "@tinyrack/ui/components/text";
import { useLocation } from "react-router";
import { ArticleList } from "@/components/ArticleList.tsx";
import * as m from "@/i18n/paraglide/messages.js";
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
    <div className="page-shell flex flex-col gap-tinyrack-2xl py-tinyrack-3xl">
      <header>
        <TRText as="h1" className="m-0" variant="display" weight="bold">
          {m.blog_title({}, { locale: lang })}
        </TRText>
        <TRText
          as="p"
          className="mt-tinyrack-lg mb-0 max-w-tinyrack-measure-xl"
          color="muted"
          variant="body"
        >
          {m.blog_description({}, { locale: lang })}
        </TRText>
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
