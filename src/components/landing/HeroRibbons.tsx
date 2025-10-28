import React from 'react';

type LogoItem = { src: string; alt?: string } | string;

type Props = {
  placement?: 'bottom' | 'top';
  offset?: number; // px offset from edge (negative allowed)
  opacity?: number; // 0..1
  zIndex?: number; // wrapper z-index to sit above sections
  logos?: LogoItem[]; // if provided, shows a flowing logo marquee instead of text
  logosAlt?: LogoItem[]; // optional alternate order for the second (lower) stripe
  speedSec?: number; // marquee duration in seconds
  logoHeight?: number; // px height for logos
  gap?: number; // px gap between logos
  // Note: previously experimented with fixed cell widths/scales; reverted for natural sizing
  dirUpper?: 'ltr' | 'rtl';
  dirLower?: 'ltr' | 'rtl';
  tileCount?: number; // how many times to repeat the sequence in each half (to avoid empty space)
  // Optional per-logo scaling by filename number (e.g., { '3': 1.2, '11': 1.1 })
  scaleBy?: Record<string, number>;
};

export function HeroRibbons({ placement = 'bottom', offset = -8, opacity = 1, zIndex = 60, logos, logosAlt, speedSec = 120, logoHeight = 22, gap = 28, dirUpper = 'rtl', dirLower = 'ltr', tileCount = 3, scaleBy }: Props) {
  // Simplified base string for a continuous loop
  const text = 'SWEEP ✦ DROP ✦ BONUSES ✦ ';
  const baseStyle: React.CSSProperties = {
    // Solid brand blue for the marquee background
    background: '#5f20d3',
  };
  const shadowStyle: React.CSSProperties = {
    // Reinstated box-shadow for inner top/bottom lines, but softer
    boxShadow: '0 1px 0 rgba(5, 5, 5, 0.28) inset, 0 -1px 0 rgba(255,255,255,0.1) inset',
  };

  const rotate = (arr: LogoItem[], by: number) => {
    const n = arr.length;
    if (!n) return arr;
    const k = ((by % n) + n) % n;
    return [...arr.slice(k), ...arr.slice(0, k)];
  };

  const stripe = (
    key: string,
    rotateDeg: number,
    z: number,
    opacity: number = 1,
    containerClassName: string = '',
    widthVW?: number,
    leftVW?: number,
    logosArray?: LogoItem[],
    dir: 'ltr' | 'rtl' = 'rtl',
  ) => (
    <div
      key={key}
      className={`relative ${containerClassName}`}
      style={{
        width: `${widthVW ?? 200}vw`,
        left: `${leftVW ?? -50}vw`,
        transform: `rotate(${rotateDeg}deg)`,
        zIndex: z,
        transformOrigin: 'center'
      }}
    >
      <div
        // Animated marquee with seam‑mask to avoid double overlay
        className="w-full py-4 sm:py-5 px-6 text-[11px] sm:text-[16px] font-extrabold sm:tracking-widest uppercase text-white text-center whitespace-nowrap overflow-hidden"
        style={{
          ...baseStyle,
          ...shadowStyle,
          filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.35))',
          letterSpacing: '0.06em',
          WebkitMaskImage: 'none',
          maskImage: 'none',
          opacity,
        }}
      >
        {/* Rewritten marquee: two identical halves each consisting of N tiles */}
        <div
          className="flex"
          style={{
            width: 'max-content',
            animation: `${dir === 'rtl' ? 'marquee-rtl' : 'marquee-ltr'} ${speedSec}s linear infinite`,
            alignItems: 'center',
            willChange: 'transform',
          }}
        >
          {(() => {
            const baseSeq = (logosArray && logosArray.length > 0)
              ? logosArray
              : (text.repeat(1).split(' ').filter(Boolean) as LogoItem[]);

            // Build one half by repeating baseSeq tileCount times
            const half: LogoItem[] = [];
            for (let i = 0; i < Math.max(1, tileCount); i++) {
              half.push(...baseSeq);
            }

            const renderHalf = (key: string) => (
              <div key={key} className="flex items-center" style={{ gap }}>
                {half.map((item, i) => {
                  if (typeof item === 'string' && !item.startsWith('/')) {
                    return (
                      <span key={`t-${key}-${i}`} className="uppercase tracking-[0.2em] text-white/95">{item}</span>
                    );
                  }
                  const src = typeof item === 'string' ? item : item.src;
                  const alt = typeof item === 'string' ? 'brand' : item.alt || 'brand logo';
                  let scale = 1;
                  if (scaleBy) {
                    const m = src.match(/\/partner\/(\d+)\.(?:webp|png|jpg|jpeg|svg)/i);
                    const id = m?.[1];
                    if (id && scaleBy[id] != null) scale = scaleBy[id] as number;
                  }
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={`l-${key}-${i}`} src={src} alt={alt} height={logoHeight}
                      style={{ height: logoHeight, width: 'auto', display: 'block', transform: `scale(${scale})`, transformOrigin: 'center' }} />
                  );
                })}
              </div>
            );

            return [renderHalf('a'), renderHalf('b')];
          })()}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Keyframes updated for left-to-right movement */}
      <style>{`
        @keyframes marquee-rtl { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marquee-ltr { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
      <div
        className="pointer-events-none select-none absolute inset-x-0 overflow-hidden sm:overflow-visible"
        style={{ ...(placement === 'top' ? { top: offset } : { bottom: offset }), zIndex }}
      >
        {stripe('upper', 2.0, 2, opacity, 'hidden sm:block mt-[2px] sm:mt-[8px]', 200, -50, logos, dirUpper)}
        {/* Hides the second stripe on mobile */}
        {stripe('lower', -2.0, 1, opacity, 'hidden sm:block mt-[-10px] sm:mt-[-32px]', 200, -50, logosAlt && logosAlt.length ? logosAlt : logos, dirLower)}
        {/* Mobile single stripe with softer tilt and safe width */}
        {stripe('mobile', 1.2, 1, opacity, 'block sm:hidden mt-3', 200, -50, logos, dirUpper)}
      </div>
    </>
  );
}
