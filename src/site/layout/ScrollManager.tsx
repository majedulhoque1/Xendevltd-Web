import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** SPA scroll behaviour: new page → top; `#hash` → that section (scroll-padding in the CSS
 *  keeps it clear of the sticky header); Back/Forward → the position the visitor left. */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();
  const positions = useRef(new Map<string, number>());
  const lastKey = useRef(key);

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  useIsoLayoutEffect(() => {
    positions.current.set(lastKey.current, window.scrollY);
    lastKey.current = key;

    if (navType === "POP" && positions.current.has(key)) {
      const y = positions.current.get(key)!;
      requestAnimationFrame(() => window.scrollTo(0, y));
      return;
    }
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const go = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: tries === 0 ? "auto" : "smooth", block: "start" });
        else if (tries++ < 20) requestAnimationFrame(go);
      };
      requestAnimationFrame(go);
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, key]);

  return null;
}
