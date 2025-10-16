import React from 'react';

export function AppLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M16 8h.01" />
      <path d="M8 16h.01" />
      <path d="M9 9l-2.5 2.5" />
      <path d="M15 15l2.5-2.5" />
    </svg>
  );
}

export function CoinsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}

export function ScCoinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
      className={`${props.className || ''} sc-coin`}
    >
      <defs>
        <linearGradient id="sc-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--status-sc))" />
          <stop offset="100%" stopColor="hsl(140 80% 40%)" />
        </linearGradient>
        <clipPath id="sc-coin-clip">
          <circle cx="12" cy="12" r="9" />
        </clipPath>
         <linearGradient id="shine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="hsl(140 80% 20%)" stroke="none" />
      <circle cx="12" cy="12" r="9" fill="url(#sc-grad)" stroke="hsl(140 80% 30%)" strokeWidth="1" />
       <g clipPath="url(#sc-coin-clip)">
        <rect x="-12" y="0" width="12" height="24" fill="url(#shine-grad)" className="shine-effect" />
      </g>
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fill="hsl(var(--background))"
        fontSize="9"
        fontWeight="bold"
        stroke="black"
        strokeWidth="0.5"
        paintOrder="stroke"
      >
        SC
      </text>
    </svg>
  );
}

export function GcCoinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
      className={`${props.className || ''} gc-coin`}
    >
       <defs>
        <linearGradient id="gc-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--status-gc))" />
          <stop offset="100%" stopColor="hsl(45 100% 40%)" />
        </linearGradient>
         <clipPath id="gc-coin-clip">
          <circle cx="12" cy="12" r="9" />
        </clipPath>
         <linearGradient id="shine-grad-gc" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="hsl(45 100% 20%)" stroke="none" />
      <circle cx="12" cy="12" r="9" fill="url(#gc-grad)" stroke="hsl(45 100% 30%)" strokeWidth="1" />
       <g clipPath="url(#gc-coin-clip)">
        <rect x="-12" y="0" width="12" height="24" fill="url(#shine-grad-gc)" className="shine-effect" />
      </g>
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fill="hsl(var(--background))"
        fontSize="9"
        fontWeight="bold"
        stroke="black"
        strokeWidth="0.5"
        paintOrder="stroke"
      >
        GC
      </text>
    </svg>
  );
}
