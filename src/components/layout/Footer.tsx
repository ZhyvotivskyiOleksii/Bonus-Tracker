import Link from "next/link"
import SweepDropLogo from '@/components/brand/SweepDropLogo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-transparent mt-16">
      {/* Panel wrapper like the original design, but with our links */}
      <div className="px-4 sm:px-6 pt-10 pb-8">
        <div className="relative mx-auto w-full max-w-[1280px] rounded-3xl ring-1 ring-white/12 bg-background/95 backdrop-blur p-6 sm:p-10 overflow-hidden">
          {/* subtle glows */}
          <div aria-hidden className="pointer-events-none absolute -top-10 -left-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-12 -right-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          {/* Brand row */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" aria-label="Sweep Drop home">
              <SweepDropLogo size={22} coinSize={18} />
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-xs text-muted-foreground/90 max-w-3xl">
            18+ Only. Sweepstakes play is for entertainment. Please play responsibly. Sweep Drop is not a sweeps casino and does not offer real money gambling.
          </p>

          {/* Bottom line with links */}
          <div className="mt-8 border-t border-white/10 pt-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-center sm:text-left">© {year} Sweep Drop. All rights reserved.</p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <Link href="/terms" className="hover:text-primary">Terms &amp; Conditions</Link>
              <span className="hidden sm:inline opacity-40">•</span>
              <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
              <span className="hidden sm:inline opacity-40">•</span>
              <Link href="/responsible-gaming" className="hover:text-primary">Responsible Gaming</Link>
              <span className="hidden sm:inline opacity-40">•</span>
              <Link href="/data-deletion" className="hover:text-primary">Data Deletion</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
