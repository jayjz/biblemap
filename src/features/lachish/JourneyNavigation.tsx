"use client";
import { useEffect, useRef, useState } from "react";
import { MOVEMENTS } from "@/content/lachish/narrative";

export function JourneyNavigation() {
  const [active, setActive] = useState<string>(MOVEMENTS[0].id);
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const entered = entries.find(entry => entry.isIntersecting);
      if (entered) setActive(entered.target.id);
    }, { rootMargin: "-15% 0px -65% 0px" });
    for (const movement of MOVEMENTS) {
      const element = document.getElementById(movement.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const nav = navigation.current;
    const link = nav?.querySelector<HTMLElement>("[aria-current]");
    if (nav && link) nav.scrollTo({ left: nav.scrollLeft + link.getBoundingClientRect().left - nav.getBoundingClientRect().left - (nav.clientWidth - link.clientWidth) / 2, behavior: "auto" });
  }, [active]);
  return <nav ref={navigation} className="lachish-journey-nav" aria-label="The six movements"><ol>{MOVEMENTS.map(movement => <li key={movement.id}><a href={`#${movement.id}`} aria-current={active === movement.id ? "step" : undefined}><span>{movement.numeral}</span>{movement.label}</a></li>)}</ol></nav>;
}
