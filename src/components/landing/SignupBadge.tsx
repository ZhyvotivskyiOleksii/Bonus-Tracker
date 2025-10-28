"use client";
import React from 'react';

type Props = {
  size?: number; // diameter in px
  label?: string; // center label
  ringText?: string; // text around circle
  className?: string; // positioning from parent
};

export function SignupBadge({ size = 120, label = '40 SC+', ringText = 'JUST FOR SIGN UP • ', className }: Props) {
  const s = Math.max(60, size);
  // Make the ring text sit OUTSIDE the main circle
  const ringR = s * 1.8; // svg box size (larger than circle)
  const pathR = s * 0.62; // radius of the circular text path (outside > s/2)
  const txt = Array.from({ length: 8 }).map(() => ringText).join(' ');
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [count, setCount] = React.useState<number | null>(null);
  const target = React.useMemo(() => {
    const m = label.match(/(\d{1,3})\s*SC\+/i);
    return m ? Math.min(999, parseInt(m[1], 10)) : 40;
  }, [label]);

  // Play count-up when in view; reset when out of view so it replays when returning
  React.useEffect(() => {
    if (!rootRef.current) return;
    let raf = 0;
    let start = 0;
    const dur = 1400; // ms
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setCount(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (e.isIntersecting) {
          cancelAnimationFrame(raf);
          start = 0;
          setCount(0);
          raf = requestAnimationFrame(step);
        } else {
          cancelAnimationFrame(raf);
          setCount(null);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(rootRef.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [target]);

  return (
    <div ref={rootRef} className={`sb-root ${className || ''}`} style={{ width: s, height: s, position: 'relative' }} aria-hidden>
      {/* vibrant animated neon ring behind everything */}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: s * 1.7,
          height: s * 1.7,
          background:
            'conic-gradient(from 0deg, rgba(34,197,94,0.18), rgba(20,184,166,0.18), rgba(59,130,246,0.18), rgba(147,51,234,0.18), rgba(234,179,8,0.18), rgba(34,197,94,0.18))',
          filter: 'blur(10px)',
          animation: 'sbRotate 12s linear infinite',
        }}
      />
      {/* glow pulse ring */}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: s * 1.28,
          height: s * 1.28,
          border: '1px solid rgba(255,220,120,0.55)',
          boxShadow: '0 0 30px rgba(255,220,120,0.55), 0 0 70px rgba(255,200,80,0.35)',
          animation: 'signupPulse 3.2s ease-in-out infinite',
        }}
      />
      {/* soft outer halo */}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: s * 1.6,
          height: s * 1.6,
          background: 'radial-gradient(circle, rgba(255,214,90,0.35) 0%, rgba(98, 14, 242, 0.18) 36%, rgba(133, 15, 235, 0) 72%)',
          filter: 'blur(2px)'
        }}
      />

      {/* core circle (animated breathing + rich gradient) */}
      <div className="sb-core absolute inset-0 rounded-full" style={{ overflow: 'hidden' }}>
        {/* base gradient */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(120% 100% at 35% 22%, #FFF4BF 0%, #750ffaff 26%, #e71515ff 50%, #FFA623 70%, #07ed5bff 86%)',
            boxShadow:
              'inset 0 3px 10px rgba(255,255,255,0.6), inset 0 -12px 20px rgba(0,0,0,0.25), 0 20px 44px rgba(0,0,0,0.32), 0 0 34px rgba(255,210,90,0.45)',
          }}
        />
        {/* bottom shade to increase inner contrast */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 56%, rgba(0,0,0,0.18) 100%)'
          }}
        />
        {/* slow rotating warm sheen */}
        <div
          className="absolute inset-0 rounded-full mix-blend-overlay opacity-65"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(255,255,255,0.0) 0deg, rgba(255,255,255,0.12) 30deg, rgba(255,255,255,0.0) 120deg, rgba(0,0,0,0.12) 210deg, rgba(0,0,0,0.0) 360deg)',
            animation: 'signupHue 9s linear infinite',
          }}
        />
        {/* subtle edge ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.28)' }}
        />
      </div>
      {/* highlight */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(140% 100% at 30% 20%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 58%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* center label */}
      <div className="absolute inset-0 grid place-items-center">
        {(() => {
          const baseSize = Math.round(s * 0.24);
          const val = (count ?? target).toString();
          return (
            <span className="font-extrabold inline-flex items-baseline">
              <span
                style={{
                  fontSize: baseSize,
                  letterSpacing: 0.5,
                  color: '#0ee24aff',
                  textShadow:
                    '0 2px 8px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.4), 0 0 18px rgba(255,220,120,0.6)',
                  WebkitTextStroke: '0.4px rgba(0,0,0,0.25)'
                }}
              >
                {val + ' '}
              </span>
              <span
                style={{
                  fontSize: baseSize,
                  letterSpacing: 0.5,
                  color: '#03e455ff',
                  textShadow: '0 0 10px rgba(34,197,94,0.65), 0 2px 6px rgba(0,0,0,0.45)'
                }}
              >
                SC+
              </span>
            </span>
          );
        })()}
      </div>

      {/* circular text ring */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: ringR, height: ringR, overflow: 'visible' }}>
        <svg viewBox={`0 0 ${ringR} ${ringR}`} width={ringR} height={ringR} className="sb-spin">
          <defs>
            <path id={`${uid}-signup-circle-path`} d={`M ${ringR / 2},${ringR / 2} m -${pathR},0 a ${pathR},${pathR} 0 1,1 ${pathR * 2},0 a ${pathR},${pathR} 0 1,1 -${pathR * 2},0`} />
          </defs>
          <text fill="#FFE9A6" fontSize={Math.round(s * 0.12)} fontWeight={800} letterSpacing={2} textAnchor="middle">
            <textPath href={`#${uid}-signup-circle-path`} startOffset="50%">{txt}</textPath>
          </text>
        </svg>
      </div>

      {/* ambient drifting bubbles (subtle cloud-like dots left/right) */}
      <div className="sb-bubbles absolute inset-0 pointer-events-none">
        {/* left cluster */}
        <span className="absolute rounded-full" style={{ left: -s * 0.22, top: s * 0.12, width: s * 0.62, height: s * 0.62, background: 'radial-gradient(circle, rgba(250,250,250,0.15) 0%, rgba(255,255,255,0.0) 70%)', animation: 'sbFloatL 7.5s ease-in-out infinite alternate', filter: 'blur(2px)' }} />
        <span className="absolute rounded-full" style={{ left: -s * 0.06, top: s * 0.56, width: s * 0.36, height: s * 0.36, background: 'radial-gradient(circle, rgba(77,222,128,0.18) 0%, rgba(77,222,128,0.0) 70%)', animation: 'sbFloatL 9s ease-in-out infinite alternate-reverse', filter: 'blur(1px)' }} />
        {/* right cluster */}
        <span className="absolute rounded-full" style={{ right: -s * 0.2, top: s * 0.24, width: s * 0.54, height: s * 0.54, background: 'radial-gradient(circle, rgba(253,230,138,0.14) 0%, rgba(253,230,138,0.0) 70%)', animation: 'sbFloatR 8s ease-in-out infinite alternate', filter: 'blur(2px)' }} />
        <span className="absolute rounded-full" style={{ right: -s * 0.04, top: s * 0.66, width: s * 0.28, height: s * 0.28, background: 'radial-gradient(circle, rgba(96,165,250,0.18) 0%, rgba(96,165,250,0.0) 70%)', animation: 'sbFloatR 10s ease-in-out infinite alternate-reverse', filter: 'blur(1px)' }} />
      </div>

      {/* tiny sparkles orbiting (keep minimal) */}
      <div className="sb-orbit absolute inset-0 pointer-events-none">
        {[
          { size: 6, dist: 0.78, delay: 0 },
          { size: 4, dist: 0.92, delay: 1.2 },
          { size: 5, dist: 0.84, delay: 2.1 },
        ].map((p, i) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className="sb-orbit-item absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: s * p.dist,
              height: s * p.dist,
              animation: `sbOrbit 10s linear infinite ${p.delay}s`,
              transformOrigin: 'center',
              }}
          >
            <span
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                left: '50%',
                top: 0,
                transform: 'translateX(-50%)',
                background: 'white',
                boxShadow: '0 0 10px rgba(255,255,255,0.9)',
                animation: 'sbTwinkle 1.6s ease-in-out infinite',
              }}
            />
          </span>
        ))}
      </div>

      <style jsx global>{`
        @keyframes signupSpin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes signupPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.96); opacity: .55 }
          50% { transform: translate(-50%, -50%) scale(1.06); opacity: .35 }
        }
        @keyframes signupBreath {
          0%, 100% { transform: scale(0.985) }
          50% { transform: scale(1.045) }
        }
        @keyframes signupHue {
          from { transform: rotate(0deg) }
          to { transform: rotate(360deg) }
        }
        @keyframes sbRotate { from { transform: translate(-50%, -50%) rotate(0deg) } to { transform: translate(-50%, -50%) rotate(360deg) } }
        @keyframes sbOrbit { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes sbTwinkle { 0%,100% { opacity: .2; transform: scale(.9) } 50% { opacity: 1; transform: scale(1.25) } }
        @keyframes sbFloatL { from { transform: translate(-6px, 0) } to { transform: translate(6px, -4px) } }
        @keyframes sbFloatR { from { transform: translate(8px, 0) } to { transform: translate(-6px, -5px) } }
        .sb-spin { animation: signupSpin 12s linear infinite; transform-origin: center center; transform-box: fill-box; will-change: transform; }
        .sb-orbit-item { transform-origin: center center; will-change: transform; }
      `}</style>
      {/* apply breathing to the core group */}
      <style jsx>{`
        .sb-core { animation: signupBreath 4.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sb-core { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default SignupBadge;
