"use client";
import { useEffect } from "react";

/** Native links remain usable without JS; enhancement also unfolds their evidence. */
export function SourceNavigation() {
  useEffect(() => {
    function unfold(id: string) {
      const target = document.getElementById(id);
      if (!target?.closest(".lachish")) return;
      for (let current: HTMLElement | null = target; current; current = current.parentElement) {
        if (current instanceof HTMLDetailsElement) current.open = true;
      }
    }
    const restore = () => unfold(window.location.hash.slice(1));
    const follow = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (link?.closest(".lachish") && link.pathname === window.location.pathname && link.hash) unfold(link.hash.slice(1));
    };
    restore();
    document.addEventListener("click", follow);
    window.addEventListener("hashchange", restore);
    return () => { document.removeEventListener("click", follow); window.removeEventListener("hashchange", restore); };
  }, []);
  return null;
}
