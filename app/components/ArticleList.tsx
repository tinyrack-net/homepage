import * as m from "@/i18n/paraglide/messages.js";
import type { ArticleEntry } from "@/lib/content-types.ts";
import type { SupportedLanguageCodes } from "@/lib/language.ts";
import { ArticleCard } from "./ArticleCard.tsx";
import { ListPagination } from "./ListPagination.tsx";

export type ArticleListProps = {
  articles: ArticleEntry[];
  currentPage: number;
  hrefForPage: (page: number) => string;
  lang: SupportedLanguageCodes;
  showExcerpt?: boolean;
  totalPages: number;
};

/** The paginated card grid shared by the blog index and every tag listing. */
export function ArticleList({
  articles,
  currentPage,
  hrefForPage,
  lang,
  showExcerpt = true,
  totalPages,
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <p className="text-tinyrack-text-muted">
        {m.global_empty({}, { locale: lang })}
      </p>
    );
  }

  return (
    <>
      <ul className="grid gap-tinyrack-2xl md:grid-cols-2 lg:grid-cols-3">
        {articles.map((post) => (
          <ArticleCard key={post.id} post={post} showExcerpt={showExcerpt} />
        ))}
      </ul>
      <ListPagination
        currentPage={currentPage}
        hrefForPage={hrefForPage}
        lang={lang}
        totalPages={totalPages}
      />
    </>
  );
}
