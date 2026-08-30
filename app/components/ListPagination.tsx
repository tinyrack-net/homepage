import { TRPagination } from "@tinyrack/ui/components/pagination";
import { Link } from "react-router";
import * as m from "@/i18n/paraglide/messages.js";
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
      label={m.pagination_label({}, { locale: lang })}
      nextLabel={m.pagination_next({}, { locale: lang })}
      pageLabel={(page) => m.pagination_page({ page }, { locale: lang })}
      previousLabel={m.pagination_previous({}, { locale: lang })}
      renderLink={(page) => <Link to={hrefForPage(page)} />}
      totalPages={totalPages}
    />
  );
}
