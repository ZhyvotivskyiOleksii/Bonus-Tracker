"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteLoader() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show brief loader on every route change
    setShow(true);
    const t = setTimeout(() => setShow(false), 700);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-background/70 backdrop-blur-sm">
      <div className="stack" role="status" aria-label="Loading">
        <div className="stack__card" />
        <div className="stack__card" />
        <div className="stack__card" />
      </div>
      <div className="mt-6 text-xs tracking-wider text-foreground/80 uppercase">sweep-drop</div>
    </div>
  );
}

