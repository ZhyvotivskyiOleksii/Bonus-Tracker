import React from "react";
import { cn } from "@/lib/utils";

type IconType = React.ComponentType<{ className?: string }>;

type HexFeatureProps = {
  icon: IconType;
  title: string;
  text: string;
};

export function HexFeature({ icon: Icon, title, text }: HexFeatureProps) {
  const uid = React.useId();
  return (
    <div className={cn(
      "group flex flex-col items-center text-center gap-4",
      "transition-transform duration-300 hover:-translate-y-0.5"
    )}>
      {/* Hexagon using SVG for crisp stroke */}
      <div className="relative">
        <svg
          width="140"
          height="152"
          viewBox="0 0 128 140"
          className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          aria-hidden
        >
          <defs>
            {/* diagonal gradient for outer stroke */}
            <linearGradient id={`${uid}-outer`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.75" />
            </linearGradient>
            {/* subtle inner fill */}
            <radialGradient id={`${uid}-fill`} cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02" />
            </radialGradient>
          </defs>
          {/* fill glow */}
          <polygon points="64,5 120,37 120,103 64,135 8,103 8,37" fill={`url(#${uid}-fill)`} />
          {/* single border */}
          <polygon
            points="64,5 120,37 120,103 64,135 8,103 8,37"
            fill="none"
            stroke={`url(#${uid}-outer)`}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-opacity duration-300 group-hover:opacity-90"
          />
        </svg>
        <Icon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 text-primary" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-[36ch] mx-auto">{text}</p>
      </div>
    </div>
  );
}
