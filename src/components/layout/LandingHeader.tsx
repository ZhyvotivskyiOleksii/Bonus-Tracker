import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '../icons';

export function LandingHeader() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-card border-b">
      <Link href="/" className="flex items-center justify-center gap-2">
        <AppLogo className="h-6 w-6 text-primary" />
        <span className="text-sm font-semibold tracking-tight text-foreground">sweep-drop</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </nav>
    </header>
  );
}
