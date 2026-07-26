import { describe, expect, it } from "vitest";
import { ARTICLES_PER_PAGE, getPageCount, getPageItems } from "./pagination.ts";

describe("getPageCount", () => {
  it("keeps one page for an empty collection so the route still exists", () => {
    expect(getPageCount(0)).toBe(1);
    expect(getPageCount(-2)).toBe(1);
  });

  it("does not split a collection that fits", () => {
    expect(getPageCount(1)).toBe(1);
    expect(getPageCount(ARTICLES_PER_PAGE)).toBe(1);
  });

  it("adds a page as soon as one item overflows", () => {
    expect(getPageCount(ARTICLES_PER_PAGE + 1)).toBe(2);
  });

  it("does not add an empty trailing page on an exact split", () => {
    expect(getPageCount(ARTICLES_PER_PAGE * 3)).toBe(3);
  });
});

describe("getPageItems", () => {
  const items = Array.from({ length: 25 }, (_, index) => index);

  it("slices the requested page", () => {
    expect(getPageItems(items, 1, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(getPageItems(items, 3, 10)).toEqual([20, 21, 22, 23, 24]);
  });

  it("treats a page below one as the first page", () => {
    expect(getPageItems(items, 0, 10)).toEqual(getPageItems(items, 1, 10));
  });

  it("returns nothing past the end rather than throwing", () => {
    expect(getPageItems(items, 99, 10)).toEqual([]);
  });

  it("covers every item exactly once across all pages", () => {
    const pages = getPageCount(items.length, 10);
    const seen = Array.from({ length: pages }, (_, index) =>
      getPageItems(items, index + 1, 10),
    ).flat();
    expect(seen).toEqual(items);
  });
});
