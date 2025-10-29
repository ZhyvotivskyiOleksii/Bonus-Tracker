
import type { Metadata } from 'next';
import Script from 'next/script';
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
        {/* Google Tag Manager */}
        <Script id="gtm-base" strategy="afterInteractive">{`
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WXZMMCWK');
        `}</Script>
        {/* End Google Tag Manager */}
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased dark',
        )}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WXZMMCWK" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
          }}
        />
        {/* End Google Tag Manager (noscript) */}
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
