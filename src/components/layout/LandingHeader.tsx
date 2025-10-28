import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import SweepDropLogo from '@/components/brand/SweepDropLogo';

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 lg:px-6 h-14 flex items-center bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <Link href="/" className="flex items-center justify-center gap-2" aria-label="Sweep Drop home">
        <span className="inline-block scale-90 sm:scale-100 origin-left">
          <SweepDropLogo size={22} coinSize={18} />
        </span>
      </Link>
      <nav className="ml-auto flex gap-2 sm:gap-3">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 h-9 rounded-full border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25"
        >
          <Link href="/login" aria-label="Log in">
            <UserCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Log in</span>
          </Link>
        </Button>
      </nav>
    </header>
  );
}
