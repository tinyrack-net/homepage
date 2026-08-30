import { act } from "react";
import { createRoot } from "react-dom/client";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router";
import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { NavigationProgress } from "./NavigationProgress.tsx";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mountedRoots: ReturnType<typeof createRoot>[] = [];

afterEach(async () => {
  await act(async () => {
    for (const root of mountedRoots.splice(0)) {
      root.unmount();
    }
  });
});

function TestLayout() {
  return (
    <>
      <NavigationProgress />
      <Outlet />
    </>
  );
}

test.each([
  { current: "/", label: "Loading page", next: "/next/" },
  { current: "/ja/", label: "ページを読み込み中", next: "/ja/next/" },
  { current: "/ko/", label: "페이지 로드 중", next: "/ko/next/" },
])("shows localized progress only while navigating from $current", async ({
  current,
  label,
  next,
}) => {
  let finishLoading = () => {};
  const loading = new Promise<void>((resolve) => {
    finishLoading = resolve;
  });
  const router = createMemoryRouter(
    [
      {
        Component: TestLayout,
        children: [
          { path: "*", Component: () => <p>Current page</p> },
          {
            path: next.replace(/^\//, ""),
            loader: () => loading,
            Component: () => <p>Next page</p>,
          },
        ],
      },
    ],
    { initialEntries: [current] },
  );
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  mountedRoots.push(root);

  await act(async () => {
    root.render(<RouterProvider router={router} />);
  });

  expect(document.querySelector('[role="progressbar"]')).toBeNull();

  await act(async () => {
    await router.navigate(`${current}#section`);
  });
  expect(document.querySelector('[role="progressbar"]')).toBeNull();

  let navigation!: Promise<void>;
  await act(async () => {
    navigation = router.navigate(next);
    await Promise.resolve();
  });

  expect(page.getByRole("progressbar", { name: label }).element()).toBe(
    document.querySelector(".site-navigation-progress"),
  );

  await act(async () => {
    finishLoading();
    await navigation;
  });
  expect(document.querySelector('[role="progressbar"]')).toBeNull();
});
