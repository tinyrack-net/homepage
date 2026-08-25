import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element has entered the viewport so entrance choreography
 * starts on scroll once and stays in its completed state until unmount.
 *
 * The initial value is `false` so a JavaScript-enabled page can paint the
 * entrance state before hydration. CSS only arms that state after the head
 * bootstrap marks scripting as enabled, so no-JS still sees finished artwork.
 */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
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
