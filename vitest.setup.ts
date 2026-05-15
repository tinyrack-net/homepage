import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

afterEach(() => {
  if (typeof document !== "undefined") {
    document.body.innerHTML = "";
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.scheme;
  }

  if (typeof window !== "undefined") {
    window.localStorage.clear();
  }

  vi.restoreAllMocks();
});
