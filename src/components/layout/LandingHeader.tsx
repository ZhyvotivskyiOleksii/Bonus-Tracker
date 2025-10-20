import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 px-4 lg:px-6 h-14 flex items-center bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <Link href="/" className="flex items-center justify-center gap-2">
        <Image src="/image/logo.png" alt="Sweep Drop" width={130} height={28} className="h-7 w-auto" />
        <span className="text-sm font-semibold tracking-tight text-foreground">Sweep Drop</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </nav>
    </header>
  );
}
