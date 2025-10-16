import Link from 'next/link';
import { AppLogo } from '../icons';

export function MainSidebarUI({ children }: { children: React.ReactNode }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col bg-transparent sm:flex">
      <nav className="flex flex-col gap-4 px-4 sm:py-5">
        <Link
          href="/dashboard"
          className="group flex h-9 shrink-0 items-center gap-2 rounded-full bg-primary px-3 text-lg font-semibold text-primary-foreground md:h-8 md:text-base self-start"
        >
          <AppLogo className="h-4 w-4 transition-all group-hover:scale-110" />
          <span>sweep-drop</span>
        </Link>
        <div className="flex flex-col gap-y-2 mt-4">
          {children}
        </div>
      </nav>
    </aside>
  );
}
