import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is in the viewport so entrance choreography can
 * start on scroll and replay when the element returns.
 *
 * The initial value is `true` on purpose: the prerendered HTML and any
 * environment without IntersectionObserver must always show the finished
 * artwork. The hook only arms (flips to `false`) inside the effect, after
 * mount, right before the observer takes over — so no-JS never sees a
 * half-drawn illustration.
 */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }
    setInView(false);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { inView, ref };
}
