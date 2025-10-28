"use client";

import React from 'react';

export function ValueCounter({ to = 40, duration = 1500 }: { to?: number; duration?: number }) {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const hasStarted = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted.current) {
            hasStarted.current = true;
            const start = performance.now();
            const from = 0;
            const animate = (t: number) => {
              const progress = Math.min(1, (t - start) / duration);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(Math.round(from + (to - from) * eased));
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return <span ref={ref} className="tabular-nums">{value}</span>;
}

