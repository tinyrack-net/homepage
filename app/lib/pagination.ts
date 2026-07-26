/** Articles shown on one listing page, for both `/blog/` and tag listings. */
export const ARTICLES_PER_PAGE = 9;

/**
 * Listing pages a collection needs. Always at least one, so an empty locale
 * still renders a reachable page carrying the empty-state message.
 */
export function getPageCount(
  total: number,
  perPage: number = ARTICLES_PER_PAGE,
): number {
  if (total <= 0) {
    return 1;
  }
  return Math.ceil(total / perPage);
}

/** The slice of `items` belonging to a 1-based page number. */
export function getPageItems<T>(
  items: readonly T[],
  page: number,
  perPage: number = ARTICLES_PER_PAGE,
): T[] {
  const start = (Math.max(page, 1) - 1) * perPage;
  return items.slice(start, start + perPage);
}
