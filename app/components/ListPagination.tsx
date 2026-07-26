import { TRPagination } from "@tinyrack/ui/components/pagination";
import { Link } from "react-router";
import { t } from "@/i18n/index.ts";
import type { SupportedLanguageCodes } from "@/lib/language.ts";

export type ListPaginationProps = {
  currentPage: number;
  hrefForPage: (page: number) => string;
  lang: SupportedLanguageCodes;
  totalPages: number;
};

/** Localized `TRPagination` wired to the router. Renders nothing for one page. */
export function ListPagination({
  currentPage,
  hrefForPage,
  lang,
  totalPages,
}: ListPaginationProps) {
  return (
    <TRPagination
      className="mt-tinyrack-2xl"
      currentPage={currentPage}
      hrefFor={hrefForPage}
      label={t(lang, "pagination.label")}
      nextLabel={t(lang, "pagination.next")}
      pageLabel={(page) => t(lang, "pagination.page", { page })}
      previousLabel={t(lang, "pagination.previous")}
      renderLink={(page) => <Link to={hrefForPage(page)} />}
      totalPages={totalPages}
    />
  );
}
