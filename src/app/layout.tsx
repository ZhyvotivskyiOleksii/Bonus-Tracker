
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { AppInitializer } from '@/components/layout/AppInitializer';
import { RouteLoader } from '@/components/layout/RouteLoader';

export const metadata: Metadata = {
  title: 'Sweep-Drop',
  description: 'Track your daily sweeps casino bonuses.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased dark',
        )}
      >
        {/* Global background gradient to ensure seamless sections (hero -> footer) */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0A0F1A] to-[#1C2140]" />
        <AppInitializer />
        <RouteLoader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
