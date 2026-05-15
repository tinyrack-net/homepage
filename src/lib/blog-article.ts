export const GISCUS_ORIGIN = "https://giscus.app";

export function resolveGiscusTheme(theme: string | null | undefined) {
  return theme === "black" ? "dark" : "light";
}

export function syncGiscusTheme(documentObject: Document) {
  const iframe = documentObject.querySelector("iframe.giscus-frame");
  if (!(iframe instanceof HTMLIFrameElement) || !iframe.contentWindow) {
    return false;
  }

  iframe.contentWindow.postMessage(
    {
      giscus: {
        setConfig: {
          theme: resolveGiscusTheme(
            documentObject.documentElement.getAttribute("data-theme"),
          ),
        },
      },
    },
    GISCUS_ORIGIN,
  );

  return true;
}

type GiscusThemeSyncOptions = {
  document?: Document;
  window?: Window;
  mutationObserver?: typeof MutationObserver;
};

export function setupGiscusThemeSync({
  document: documentObject = document,
  window: windowObject = window,
  mutationObserver: MutationObserverCtor = MutationObserver,
}: GiscusThemeSyncOptions = {}) {
  const syncTheme = () => {
    syncGiscusTheme(documentObject);
  };

  const observer = new MutationObserverCtor((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-theme"
      ) {
        syncTheme();
      }
    }
  });

  observer.observe(documentObject.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== GISCUS_ORIGIN) {
      return;
    }

    if (
      !(typeof event.data === "object" && event.data && "giscus" in event.data)
    ) {
      return;
    }

    syncTheme();
  };

  windowObject.addEventListener("message", handleMessage);

  return () => {
    observer.disconnect();
    windowObject.removeEventListener("message", handleMessage);
  };
}
