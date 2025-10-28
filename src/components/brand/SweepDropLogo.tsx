"use client";
import React from 'react';

type Props = {
  className?: string;
  ariaLabel?: string;
  size?: number; // base font size in px for the wordmark
  coinSize?: number; // coin diameter in px
  left?: string; // left word
  right?: string; // right word
  showDot?: boolean; // between words
};

/**
 * SweepDropLogo
 * Animated wordmark with a glossy gradient, shine sweep, subtle glitter, and a spinning coin.
 * No interactivity, purely CSS animations. Designed to be lightweight for header use.
 */
export function SweepDropLogo({
  className,
  ariaLabel = 'Sweep Drop logo',
  size = 28,
  coinSize = 24,
  left = 'SWEEP',
  right = 'DROP',
  showDot = true,
}: Props) {
  const coinPx = Math.max(18, Math.min(64, coinSize));
  const fontPx = Math.max(18, Math.min(80, size));

  return (
    <div className={className} role="img" aria-label={ariaLabel} style={{ display: 'inline-block' }}>
      <div className="sd">
        <div className="sd__coin" aria-hidden style={{ width: coinPx, height: coinPx }} />
        <div className="sd__wordWrap">
          <span className="sd__word" style={{ fontSize: fontPx }}>
            {left}
            {showDot && <span className="sd__dot">·</span>}
            {right}
          </span>
          <span className="sd__glitter" aria-hidden />
        </div>
      </div>

      <style jsx>{`
        .sd{ position:relative; display:flex; align-items:center; gap:10px; user-select:none; }
        .sd__wordWrap{ position:relative; line-height:1; }

        /* coin */
        .sd__coin{
          position:relative; border-radius:999px;
          background:conic-gradient(from 0deg,#ffd54a,#ffb300,#ffce00,#ffe082,#ffd54a);
          box-shadow:0 0 14px rgba(255,214,64,.55), inset 0 0 6px rgba(0,0,0,.35);
          animation:spinY 2.6s linear infinite;
          flex:0 0 auto;
        }
        .sd__coin::after{
          content:""; position:absolute; inset:3px; border-radius:inherit;
          background:radial-gradient(120% 90% at 30% 25%,rgba(255,255,255,.55) 0,rgba(255,255,255,0) 55%);
        }
        .sd__coin::before{
          content:""; position:absolute; right:-5px; top:-5px; width:10px; height:10px; border-radius:50%;
          background:radial-gradient(circle,#fff 40%,rgba(255,255,255,0) 60%);
          filter:drop-shadow(0 0 6px #fff);
        }

        /* wordmark */
        .sd__word{
          position:relative; margin:0; font-weight:900; letter-spacing:-0.02em; display:inline-block;
          background-image:
            linear-gradient(90deg,#ff3cff 0%,#ffd54a 25%,#00ffd1 50%,#7aa2ff 75%,#ff3cff 100%),
            linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.14) 45%,rgba(255,255,255,0) 100%);
          background-repeat:no-repeat, no-repeat;
          background-size:100% 100%, 36% 100%;
          background-position:0 0, -120% 0;
          -webkit-background-clip:text; background-clip:text; color:transparent;
          text-shadow:0 0 16px rgba(255,48,255,.28), 0 0 34px rgba(0,255,188,.2);
          animation:glowPulse 3.2s ease-in-out infinite, shineText 2.8s cubic-bezier(.4,0,.2,1) infinite;
        }
        .sd__dot{ opacity:.7; display:inline-block; padding:0; margin:0 2px; }

        /* text-only shine: second background layer clipped to text */
        /* overlay sweep is removed to avoid affecting the background */

        /* glitter */
        .sd__glitter{
          position:absolute; inset:-4px; pointer-events:none;
          background:
            radial-gradient(6px 6px at 15% 35%,rgba(255,255,255,.6) 0,rgba(255,255,255,0) 60%),
            radial-gradient(6px 6px at 65% 20%,rgba(255,255,255,.6) 0,rgba(255,255,255,0) 60%),
            radial-gradient(6px 6px at 85% 70%,rgba(255,255,255,.5) 0,rgba(255,255,255,0) 60%),
            radial-gradient(6px 6px at 35% 80%,rgba(255,255,255,.45) 0,rgba(255,255,255,0) 60%);
          filter:drop-shadow(0 0 8px rgba(255,255,255,.35)); animation:twinkle 2.4s ease-in-out infinite;
        }

        /* keyframes */
        @keyframes spinY{ 0%{transform:rotateY(0)} 50%{transform:rotateY(180deg)} 100%{transform:rotateY(360deg)} }
        @keyframes shineText{
          0%{ background-position: 0 0, -120% 0 }
          10%{ background-position: 0 0, -60% 0 }
          35%{ background-position: 0 0, 20% 0 }
          60%{ background-position: 0 0, 160% 0 }
          100%{ background-position: 0 0, 320% 0 }
        }
        @keyframes glowPulse{
          0%,100%{ text-shadow:0 0 14px rgba(255,60,255,.25), 0 0 30px rgba(0,255,209,.18) }
          50%{ text-shadow:0 0 22px rgba(255,60,255,.45), 0 0 48px rgba(0,255,209,.32) }
        }
        @keyframes twinkle{
          0%,100%{ opacity:.35; filter:drop-shadow(0 0 6px rgba(255,255,255,.35)) }
          50%{ opacity:.85; filter:drop-shadow(0 0 12px rgba(255,255,255,.65)) }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .sd__coin, .sd__word, .sd__glitter { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default SweepDropLogo;
