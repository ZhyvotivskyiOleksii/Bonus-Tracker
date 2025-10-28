import Image from 'next/image';
import React from 'react';

type Props = {
  variant?: 'laptop' | 'tablet';
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  angle?: 'flat' | 'tiltLeft' | 'tiltRight';
  frameSrc?: string; // optional overlay PNG/SVG of a real device frame with transparent screen
  screenPadding?: number; // px padding from frame edge to screen content (default 8)
  screenScale?: number; // multiplicative scale for inner image (default varies by variant)
  screenFit?: 'cover' | 'contain'; // how the inner image should fit (default 'cover')
  screenShiftX?: number; // px shift for fine-tuning crop (default 0)
  screenShiftY?: number; // px shift for fine-tuning crop (default 0)
};

export function DeviceFrame({ variant = 'laptop', src, alt, sizes, className, angle = 'flat', frameSrc, screenPadding = 8, screenScale, screenFit = 'cover', screenShiftX = 0, screenShiftY = 0 }: Props) {
  if (variant === 'tablet') {
    const isTilt = angle !== 'flat';
    const rotateY = angle === 'tiltLeft' ? -18 : angle === 'tiltRight' ? 18 : 0;
    const rotateZ = angle === 'flat' ? 0 : -10;
    const rotateX = angle === 'flat' ? 0 : -4; // small pitch adds depth
    const scale = screenScale ?? 1.06;
    const fitClass = screenFit === 'contain' ? 'object-contain' : 'object-cover';
    return (
      <div className={className}>
        <div className="relative w-full" style={{ perspective: isTilt ? '1200px' : undefined }}>
          <div
            className="relative rounded-[28px] border border-white/10 bg-[#0B1224]/70 backdrop-blur shadow-[0_30px_90px_-20px_rgba(0,0,0,0.65)]"
            style={{
              aspectRatio: '16/10',
              transformStyle: 'preserve-3d',
              transform: isTilt ? `rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg)` : undefined,
            }}
          >
            {/* camera dot */}
            <div className="absolute left-1/2 top-1.5 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black/60 ring-2 ring-white/20" />
            {/* screen */}
            <div className="absolute rounded-[22px] overflow-hidden bg-black/60" style={{ inset: screenPadding }}>
              <div className="relative w-full h-full">
                <Image src={src} alt={alt} fill sizes={sizes} className={`${fitClass} origin-center will-change-transform`} style={{ transform: `translate(${screenShiftX}px, ${screenShiftY}px) scale(${scale})` }} />
              </div>
            </div>
            {frameSrc && (
              <Image src={frameSrc} alt="Device frame" fill sizes={sizes} className="pointer-events-none select-none object-contain" />
            )}
          </div>
        </div>
      </div>
    );
  }

  // laptop variant (default)
  const isTilt = angle !== 'flat';
  const rotateY = angle === 'tiltLeft' ? -20 : angle === 'tiltRight' ? 20 : 0;
  const rotateZ = angle === 'flat' ? 0 : -8; // light artistic tilt
  const lidRotateX = isTilt ? -22 : 0;
  const scale = screenScale ?? 1.0;
  const fitClass = screenFit === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <div className={className}>
      <div
        className="relative w-full"
        style={{
          perspective: isTilt ? '1200px' : undefined,
          transformStyle: isTilt ? 'preserve-3d' : undefined,
        }}
      >
        {/* base */}
        <div
          className="relative mx-auto"
          style={{
            width: '78%',
            height: isTilt ? '16px' : '8px',
            transform: isTilt ? `rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translateZ(0px)` : undefined,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="absolute inset-0 rounded-b-xl bg-gradient-to-b from-white/14 to-black/60 shadow-[0_8px_38px_rgba(0,0,0,0.55)]" />
          {/* keyboard deck */}
          {isTilt && (
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-[120px] w-[140%] h-[110px] rounded-xl hidden sm:block"
              style={{
                background:
                  'linear-gradient(180deg, rgba(20,24,35,0.85) 0%, rgba(7,10,18,0.9) 100%)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                transform: `rotateX(76deg)`,
              }}
            >
              {/* keys as repeating gradient */}
              <div
                className="absolute inset-3 rounded-lg"
                style={{
                  background:
                    'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 16px)',
                  filter: 'blur(0.2px)',
                }}
              />
              {/* touchpad */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-28 h-16 rounded-lg bg-white/[0.06]" />
            </div>
          )}
        </div>

        {/* lid */}
        <div
          className="relative rounded-[18px] border border-white/10 bg-[#0B1224]/70 backdrop-blur shadow-[0_20px_80px_-20px_rgba(0,0,0,0.6)]"
          style={{
            aspectRatio: '16/10',
            transformStyle: isTilt ? 'preserve-3d' : undefined,
            transform: isTilt
              ? `rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) rotateX(${lidRotateX}deg) translateZ(8px)`
              : undefined,
          }}
        >
          {/* webcam */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-1.5 h-1.5 rounded-full bg-black/70 ring-2 ring-white/20" />
          {/* screen */}
          <div className="absolute rounded-[14px] overflow-hidden bg-black/70" style={{ inset: screenPadding }}>
            <div className="relative w-full h-full">
              <Image src={src} alt={alt} fill sizes={sizes} className={`${fitClass} origin-center will-change-transform`} style={{ transform: `translate(${screenShiftX}px, ${screenShiftY}px) scale(${scale})` }} />
            </div>
          </div>
          {frameSrc && (
            <Image src={frameSrc} alt="Device frame" fill sizes={sizes} className="pointer-events-none select-none object-contain" />
          )}
        </div>
      </div>
    </div>
  );
}
