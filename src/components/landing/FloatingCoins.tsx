"use client";

import React from 'react';

type Coin = {
  label: 'SC' | 'GC';
  top: string; // e.g. '12%'
  left: string; // e.g. '8%'
  size: number; // px
  depth: number; // parallax depth (0..1)
  delay?: number; // s
  palette: { from: string; to: string; ring: string };
  pulse?: boolean; // expanding ring pulse
  orbiter?: boolean; // tiny dot orbiting around coin
};

const COINS: Coin[] = [
  { label: 'SC', top: '12%', left: '8%', size: 42, depth: 0.6, delay: 0, palette: { from: '#7EE7B9', to: '#22C55E', ring: 'rgba(34,197,94,0.35)' }, pulse: true },
  { label: 'GC', top: '28%', left: '82%', size: 54, depth: 0.4, delay: 0.2, palette: { from: '#FDE68A', to: '#F59E0B', ring: 'rgba(245,158,11,0.35)' }, orbiter: true },
  { label: 'SC', top: '66%', left: '10%', size: 54, depth: 0.5, delay: 0.35, palette: { from: '#A7F3D0', to: '#10B981', ring: 'rgba(16,185,129,0.35)' } },
  { label: 'GC', top: '70%', left: '75%', size: 40, depth: 0.7, delay: 0.5, palette: { from: '#FCD34D', to: '#D97706', ring: 'rgba(217,119,6,0.35)' } },
  { label: 'SC', top: '40%', left: '35%', size: 48, depth: 0.8, delay: 0.15, palette: { from: '#BBF7D0', to: '#34D399', ring: 'rgba(52,211,153,0.35)' }, orbiter: true },
  // micro coins to add density but stay subtle
  { label: 'SC', top: '18%', left: '55%', size: 28, depth: 0.65, delay: 0.1, palette: { from: '#CFFAFE', to: '#22C55E', ring: 'rgba(34,197,94,0.28)' } },
  { label: 'GC', top: '54%', left: '88%', size: 26, depth: 0.5, delay: 0.25, palette: { from: '#FEF3C7', to: '#F59E0B', ring: 'rgba(245,158,11,0.28)' } },
];

export function FloatingCoins() {
  const [parallax, setParallax] = React.useState({ x: 0, y: 0 });
  const frame = React.useRef<number>();
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const { innerWidth: w, innerHeight: h } = window;
        const nx = (e.clientX / w - 0.5) * 18; // max px offset
        const ny = (e.clientY / h - 0.5) * 14;
        setParallax({ x: nx, y: ny });
      });
    };
    const onScroll = () => {
      // mild vertical parallax from scroll within viewport
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: -1 (above) .. 1 (below), focus around 0 when centered
      const center = (rect.top + rect.bottom) / 2 - vh / 2;
      const progress = Math.max(-1, Math.min(1, center / (vh / 2)));
      setParallax((p) => ({ x: p.x, y: p.y + progress * 2 }));
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block" style={{ zIndex: 0 }}>
      <style>{`
        @keyframes coinFloat { 0% { transform: translateY(0px) } 50% { transform: translateY(-12px) } 100% { transform: translateY(0px) } }
        @keyframes coinSpin { 0% { transform: rotateY(0deg) } 100% { transform: rotateY(360deg) } }
        @keyframes orbit { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes ringPulse { 0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.14 } 70% { opacity: 0.06 } 100% { transform: translate(-50%, -50%) scale(1.25); opacity: 0 } }
        @keyframes coinSway { 0% { transform: translateX(-8px) } 100% { transform: translateX(8px) } }
        @keyframes coinTilt { 0% { transform: rotate(-2deg) } 100% { transform: rotate(2deg) } }
        @media (prefers-reduced-motion: reduce) {
          .fc-wrap, .fc-sway, .fc-tilt { animation: none !important; }
        }
      `}</style>
      {COINS.map((c, i) => {
        const parX = parallax.x * c.depth;
        const parY = parallax.y * c.depth;
        const size = c.size;
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className="absolute" style={{ top: c.top, left: c.left, transform: `translate3d(${parX}px, ${parY}px, 0)` }}>
            {/* float wrapper (vertical) */}
            <div className="fc-wrap" style={{ willChange: 'transform', animation: `coinFloat ${6 + (i % 3)}s ease-in-out ${c.delay || 0}s infinite alternate` }}>
              {/* sway wrapper (horizontal) */}
              <div className="fc-sway" style={{ willChange: 'transform', animation: `coinSway ${7 + (i % 3)}s ease-in-out ${((c.delay || 0) + 0.1)}s infinite alternate` }}>
                {/* coin circle */}
                <div
                  className="fc-tilt relative rounded-full flex items-center justify-center shadow-xl"
                  style={{
                    width: size,
                    height: size,
                    background: `linear-gradient(145deg, ${c.palette.from}, ${c.palette.to})`,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.35), inset 0 2px 8px rgba(255,255,255,0.35), inset 0 -8px 16px rgba(0,0,0,0.25)`,
                    border: `1px solid ${c.palette.ring}`,
                    opacity: 0.22,
                    animation: `coinTilt ${3 + (i % 3) * 0.6}s ease-in-out ${((c.delay || 0) + 0.2)}s infinite alternate` ,
                  }}
                >
                  {/* subtle 3D spin on the inner disk */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), transparent 58%)',
                      animation: `coinSpin ${12 + i * 2}s linear infinite`,
                      transformStyle: 'preserve-3d',
                    }}
                  />
                  {/* label */}
                  <span className="relative z-10 text-[10px] font-extrabold tracking-wide text-black/70">
                    {c.label}
                  </span>
                  {/* Ring pulse (subtle) */}
                  {c.pulse && (
                    <span
                      className="absolute left-1/2 top-1/2 rounded-full"
                      style={{
                        width: size * 1.1,
                        height: size * 1.1,
                        border: `1px solid ${c.palette.ring}`,
                        boxShadow: `0 0 12px ${c.palette.ring}`,
                        animation: `ringPulse ${4.8 + (i % 3)}s ease-out ${(c.delay || 0) + 0.4}s infinite`,
                      }}
                    />
                  )}
                  {/* Tiny orbiter */}
                  {c.orbiter && (
                    <span
                      className="absolute"
                      style={{
                        width: size * 1.8,
                        height: size * 1.8,
                        left: `50%`,
                        top: `50%`,
                        transform: 'translate(-50%, -50%)',
                        animation: `orbit ${10 + i * 2}s linear infinite`,
                      }}
                    >
                      <span
                        className="absolute rounded-full"
                        style={{
                          width: 4,
                          height: 4,
                          left: '50%',
                          top: 0,
                          transform: 'translateX(-50%)',
                          background: 'rgba(255,255,255,0.7)',
                          boxShadow: '0 0 6px rgba(255,255,255,0.5)',
                        }}
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
