"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Sticky pill anchor nav for /docs with left/right scroll arrows. The arrows
// appear only when the pills overflow their container (checked on mount and
// on every resize); the bar itself keeps its hidden-scrollbar behaviour.
export function DocsToc({ items }: { items: { id: string; label: string; num: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setOverflow(el.scrollWidth > el.clientWidth + 4);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const scrollBy = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * Math.max(200, trackRef.current.clientWidth * 0.7), behavior: "smooth" });
  };

  const arrowCls =
    "absolute top-1/2 z-10 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900";

  return (
    <div className="relative">
      {overflow ? (
        <button type="button" aria-label="Scroll left" className={`${arrowCls} left-1`} onClick={() => scrollBy(-1)}>
          ‹
        </button>
      ) : null}
      <div ref={trackRef} className="no-scrollbar mx-auto flex max-w-4xl gap-1 overflow-x-auto px-6 py-2.5">
        {items.map((a) => (
          <a
            key={a.id}
            href={`#${a.id}`}
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <span className="mr-1.5 font-mono text-xs text-slate-400">{a.num}</span>
            {a.label}
          </a>
        ))}
      </div>
      {overflow ? (
        <button type="button" aria-label="Scroll right" className={`${arrowCls} right-1`} onClick={() => scrollBy(1)}>
          ›
        </button>
      ) : null}
    </div>
  );
}
