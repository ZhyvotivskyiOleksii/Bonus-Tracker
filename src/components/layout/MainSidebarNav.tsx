'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, ShieldCheck, Settings, BarChart, Bell, Users, Mails } from 'lucide-react';

const baseNavItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
];

const adminNavItems = [
    { href: '/admin', icon: ShieldCheck, label: 'Admin' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/emails', icon: Mails, label: 'Emails' },
    { href: '/analytics', icon: BarChart, label: 'Analytics' },
    { href: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { href: '/settings', icon: Settings, label: 'Settings' },
];

// This component is now purely for rendering navigation links on the client
export function MainSidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  let navItems = isAdmin ? [...adminNavItems] : [...baseNavItems];

  // Logic to ensure correct nav items are displayed for admins vs users
  if (isAdmin) {
    if (navItems.some(item => item.href === '/dashboard')) {
        navItems = navItems.filter(item => item.href !== '/dashboard');
    }
  }


  // Deduplicate items based on href, prioritizing admin items if duplicates exist
  const uniqueNavItems = navItems.reduce((acc, current) => {
    if (!acc.find(item => item.href === current.href)) {
      acc.push(current);
    }
    return acc;
  }, [] as typeof navItems);
  
  // Sort admin items to a specific order
  if (isAdmin) {
    const order = ['/admin', '/admin/users', '/admin/emails', '/analytics', '/admin/notifications', '/settings'];
    uniqueNavItems.sort((a, b) => order.indexOf(a.href) - order.indexOf(b.href));
  }


  return (
    <>
      {uniqueNavItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            pathname === item.href ? 'bg-muted text-primary' : ''
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </>
  );
}
