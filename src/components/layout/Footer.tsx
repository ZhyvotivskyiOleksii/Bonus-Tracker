import Link from "next/link"
import Image from "next/image"
import { AppLogo } from "../icons"

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full mt-16">
      {/* Outer gradient stripe in app styling, lifted up to blend into previous section */}
      <div className="-mt-24 md:-mt-32 bg-transparent px-4 sm:px-6 pt-28 md:pt-40 pb-8">
        {/* Inner rounded panel */}
        <div className="relative z-10 mx-auto w-full max-w-[1280px] rounded-3xl border border-white/10 bg-background/95 backdrop-blur p-6 sm:p-10">
          {/* Brand row */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/image/logo.png"
                alt="Sweep Drop logo"
                width={120}
                height={28}
                className="h-7 w-auto"
              />
              <span className="text-lg font-semibold tracking-tight text-white">Sweep Drop</span>
            </Link>
          </div>

          {/* Link columns */}
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="text-sm font-semibold mb-3 text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/#features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-primary">How it works</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 text-foreground">Stay connected</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:contact@sweep-drop.com" className="hover:text-primary">Contact support</a></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/data-deletion" className="hover:text-primary">Data Deletion</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 text-foreground">For users</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/settings" className="hover:text-primary">Settings</Link></li>
                <li><Link href="/analytics" className="hover:text-primary">Analytics</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom line */}
          <div className="mt-10 border-t border-white/10 pt-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>&copy; {year} Sweep-Drop. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <Link href="/terms" className="hover:text-primary">Terms</Link>
              <span className="opacity-40">•</span>
              <Link href="/privacy" className="hover:text-primary">Privacy</Link>
              <span className="opacity-40">•</span>
              <Link href="/data-deletion" className="hover:text-primary">Data Deletion</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
