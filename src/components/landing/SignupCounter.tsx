"use client";
import React from "react";

type Props = {
  target?: number; // target value, default 40
  size?: number;   // size hint to scale font
  className?: string;
  label?: string;  // trailing label text (default: 'SC+')
  labelColor?: string; // optional CSS color for label
  tight?: boolean; // if true, no space between number and label
  fluid?: boolean; // if true, don't fix width/height; render inline-size only
};

export default function SignupCounter({ target = 40, size = 110, className, label = 'SC+', labelColor, tight = false, fluid = false }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [val, setVal] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    let raf = 0;
    let start = 0;
    const duration = 1400;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setVal(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (e.isIntersecting) {
          cancelAnimationFrame(raf);
          start = 0;
          setVal(0);
          raf = requestAnimationFrame(step);
        } else {
          cancelAnimationFrame(raf);
          setVal(null);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(ref.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [target]);

  const base = Math.max(14, Math.round(size * 0.32));

  return (
    <div
      ref={ref}
      className={className}
      style={fluid ? undefined : { width: size, height: size }}
    >
      <div className={fluid ? "inline-flex" : "grid place-items-center w-full h-full"}>
        <span className="font-extrabold inline-flex items-baseline">
          <span
            className="tabular-nums"
            style={{
              fontSize: base,
              letterSpacing: 0.5,
              color: '#0ee24a',
              textShadow:
                '0 2px 8px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.4), 0 0 18px rgba(255,220,120,0.6)',
              WebkitTextStroke: '0.4px rgba(0,0,0,0.25)'
            }}
          >
            {(val ?? target).toString() + (tight ? '' : ' ')}
          </span>
          {label && (
            <span
              style={{
                fontSize: base,
                letterSpacing: 0.5,
                color: labelColor ?? '#03e455',
                textShadow: '0 0 10px rgba(34,197,94,0.65), 0 2px 6px rgba(0,0,0,0.45)'
              }}
            >
              {label}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
