import React from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/layout/LandingHeader';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bell,
  Zap,
  ShieldCheck,
  BarChart,
  ArrowRight,
  LayoutGrid,
  MousePointerClick,
  Coins,
  UserPlus,
  ListChecks,
  CalendarCheck,
  Gem,
  CheckCircle2,
  Star,
  Quote
} from 'lucide-react';
import { HeroRibbons } from '@/components/landing/HeroRibbons';
import { ValueCounter } from '@/components/landing/ValueCounter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FaqSplit } from '@/components/landing/FaqSplit';
import { DeviceFrame } from '@/components/landing/DeviceFrame';
import { FeatureCard, FeatureCardPanorama } from '@/components/landing/FeatureCard';
import { HexFeature } from '@/components/landing/HexFeature';
import SignupCounter from '@/components/landing/SignupCounter';
import { TestimonialCard } from '@/components/landing/TestimonialCard';
import { BeforeAfterSection } from '@/components/landing/BeforeAfter';

export default function Home() {
  // Build partner logos list from public/partner at render time
  let PARTNER_LOGOS: string[] = [];
  try {
    const dir = path.join(process.cwd(), 'public', 'partner');
    PARTNER_LOGOS = fs
      .readdirSync(dir)
      .filter((f) => /\.webp$/i.test(f))
      .sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0))
      .map((f) => `/partner/${f}`);
  } catch {}
  const shuffle = (arr: string[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const ORDER_TOP = shuffle(PARTNER_LOGOS);
  let ORDER_BOTTOM = shuffle(PARTNER_LOGOS);
  // Ensure different start to avoid same logos aligning
  if (ORDER_BOTTOM[0] === ORDER_TOP[0]) {
    ORDER_BOTTOM = [...ORDER_BOTTOM.slice(1), ORDER_BOTTOM[0]];
  }
  const SCALE_BY: Record<string, number> = {
    '12': 1.35,
    '4': 1.35,
    '6': 1.35,
    '8': 1.35,
    '13': 1.35,
    '14': 1.35,
  };
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="relative z-0 flex-1 pt-14">
        {/* Block 1: Hero */}
        <section className="relative overflow-visible">
          <div className="w-full min-h-[calc(100svh-56px)] sm:min-h-[80vh] flex items-start sm:items-start pt-0 pb-4 sm:pt-4 sm:pb-14">
            {/* hero background image aligned right, as a non-interactive layer */}
            {/* Mobile background image (own tuning) */}
            <div
              aria-hidden
              className="absolute inset-0 z-[1] pointer-events-none select-none sm:hidden"
              style={{
                backgroundImage: "url('/image/hero-img.webp')",
                backgroundRepeat: 'no-repeat',
                // Center horizontally; lift image above the ribbon (~56px)
                backgroundPosition: 'center bottom 60px',
                // Slightly smaller height so it doesn't intrude under the CTA on mobile
                backgroundSize: 'auto 30vh',
                bottom: 0,
              }}
            />
            {/* Desktop/Tablet background image */}
            <div
              aria-hidden
              className="absolute inset-0 z-[1] pointer-events-none select-none hidden sm:block"
              style={{
                backgroundImage: "url('/image/hero-img.webp')",
                backgroundRepeat: 'no-repeat',
                // keep 40px offset from the right edge
                backgroundPosition: 'right 40px bottom',
                // image height ~78vh, capped for very large screens
                backgroundSize: 'auto min(78vh, 820px)',
                // extend below to tuck under the ribbon (hide seam)
                bottom: -48,
              }}
            />
            <div className="container max-w-[1440px] px-4 md:px-6 relative z-10 pb-10 sm:pb-12">
              <div className="grid items-center gap-6 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_460px] xl:grid-cols-[minmax(0,1fr)_560px]">
                {/* Left: content */}
                <div className="space-y-4 sm:space-y-6 text-center lg:text-left relative">
                  <h1 className="font-extrabold text-white uppercase tracking-tight leading-[1.04] text-[clamp(28px,6vw,80px)] mx-auto lg:mx-0">
                    <span className="block sm:whitespace-nowrap">All&nbsp;Sweeps&nbsp;Casino</span>
                    <span className="block">Bonuses</span>
                    <span className="block whitespace-normal sm:whitespace-nowrap">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#9333EA]">In&nbsp;One&nbsp;Place</span>
                      <span className="ml-2 align-middle">💰</span>
                    </span>
                  </h1>
                  {/* Signup plaque between heading and paragraph: center on mobile, left on desktop */}
                  <div className="flex justify-center lg:justify-start mt-1 mb-1 sm:mb-2">
                    <div
                      className="rounded-[22px] p-[2px] block w-full sm:inline-block sm:w-auto"
                      style={{
                        background: 'linear-gradient(135deg,#5B4FE3,#A336EA)',
                        boxShadow: '0 18px 60px -22px rgba(0,0,0,0.8)'
                      }}
                    >
                      <div
                        className="relative overflow-hidden rounded-[inherit] border border-white/15 bg-[#1D1744] h-auto min-h-0 md:h-[125px] w-full md:w-auto lg:w-auto xl:w-auto md:max-w-[820px] px-2 py-1 md:px-3 md:py-4 flex flex-col items-center justify-center text-center"
                        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 1px rgba(255,255,255,0.04)' }}
                      >
                        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(220px_160px_at_20%_0%,rgba(147,51,234,.16),transparent_65%),radial-gradient(240px_180px_at_100%_100%,rgba(79,70,229,.14),transparent_65%)]" />
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-[1px] pt-0 md:pt-0">
                          {/* Mobile: stack in a column — 40+, SweepCoins, subcaption */}
                          <div className="md:hidden flex flex-col items-center justify-center gap-[2px] leading-none text-center">
                            <span className="inline-block min-w-[68px] text-center">
                              <SignupCounter target={40} size={90} label="+" tight fluid />
                            </span>
                            <span className="font-extrabold tracking-wide text-white leading-none text-[clamp(18px,6.6vw,28px)]">SweepCoins</span>
                            <span className="m-0 font-semibold tracking-wide text-white/90 text-[clamp(12px,4vw,15px)] leading-none">just for Sign Up</span>
                          </div>
                          {/* Desktop: 40+ and SweepCoins with a caption below (exact match) */}
                          <div className="hidden md:flex items-center justify-center gap-2 whitespace-nowrap leading-none">
                            <span className="inline-block md:min-w-[110px] text-left">
                              <SignupCounter target={40} size={187.5} label="+" tight fluid />
                            </span>
                            <span className="flex flex-col items-start text-left">
                              <span className="font-extrabold tracking-wide text-white text-[34px] lg:text-[38px] xl:text-[40px] leading-none">SweepCoins</span>
                              <span className="text-white/80 font-medium text-[14px] lg:text-[15px] leading-none">just for Sign Up</span>
                            </span>
                          </div>
                          {/* Caption now included in the mobile column above */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm sm:text-lg text-muted-foreground max-w-xl sm:max-w-2xl mx-auto lg:mx-0">
                    Get free Sweeps Coins and Gold Coins every day, just by visiting our site. One click—and you've collected all the bonuses from your favorite sweeps casinos.
                  </p>
                  <div className="relative flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                    <Link href="/login" className="cta-sweeps scale-[.95] sm:scale-100">
                      <span role="img" aria-label="gift">🎁</span>
                      <span>Get Bonuses</span>
                      <ArrowRight className="ml-1 h-4 w-4 icon" />
                    </Link>
                    {/* moved signup tile above, centered between heading and paragraph */}
                  </div>

                  {/* quick highlights */}
                  <div className="mt-2 hidden sm:flex flex-wrap gap-2 justify-center lg:justify-start">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-1 text-[11px] border border-white/10"><LayoutGrid className="h-3 w-3 text-primary" /> All bonuses in one place</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-1 text-[11px] border border-white/10"><MousePointerClick className="h-3 w-3 text-primary" /> 1‑click access</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-1 text-[11px] border border-white/10"><Bell className="h-3 w-3 text-primary" /> Daily updates</span>
                  </div>
                </div>

                {/* Right: keep space reserved for background image */}
                <div aria-hidden className="hidden lg:block" />
              </div>
            </div>
          </div>

          {/* animated floating coins */}
          {/* Mobile-only ribbons under the hero image */}
          <div className="sm:hidden">
            <HeroRibbons
              placement="bottom"
              offset={12}
              zIndex={10}
              logos={ORDER_TOP}
              logosAlt={ORDER_BOTTOM}
              dirUpper="rtl"
              dirLower="ltr"
              speedSec={200}
              logoHeight={26}
              gap={28}
              tileCount={4}
              scaleBy={SCALE_BY}
            />
          </div>
        </section>

        {/* Block 2 (moved): How-To under hero */}
        <section className="relative z-[1] pt-24 md:pt-32 lg:pt-48 xl:pt-56 pb-16 md:pb-24">
          {/* Ribbons as a top divider for this section */}
          <div className="hidden sm:block">
            <HeroRibbons
              placement="top"
              offset={-12}
              zIndex={60}
              logos={ORDER_TOP}
              logosAlt={ORDER_BOTTOM}
              dirUpper="rtl"
              dirLower="ltr"
              speedSec={240}
              logoHeight={30}
              gap={32}
              tileCount={4}
              scaleBy={SCALE_BY}
            />
          </div>
          <div className="container max-w-[1280px] px-4 md:px-6">
            <div className="relative rounded-3xl border border-white/10 bg-card/50 [background:linear-gradient(180deg,rgba(79,70,229,.08),rgba(147,51,234,.06))] backdrop-blur p-6 sm:p-10 overflow-hidden">
              {/* subtle hero-colored glows */}
              <div aria-hidden className="pointer-events-none absolute -top-10 -left-16 h-48 w-48 rounded-full bg-[radial-gradient(400px_220px_at_0%_0%,rgba(79,70,229,.16),transparent_60%)]" />
              <div aria-hidden className="pointer-events-none absolute -bottom-12 -right-16 h-48 w-48 rounded-full bg-[radial-gradient(420px_240px_at_100%_100%,rgba(147,51,234,.14),transparent_65%)]" />

              <div className="relative z-10 text-center space-y-3">
                <h2 className="text-3xl sm:text-4xl font-bold">How to start earning freebies 🪙</h2>
              </div>

              <div className="relative z-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
                {[
                  {icon: UserPlus, title: 'Register on Sweep Drop', text: 'Create an account—it takes 30 seconds.'},
                  {icon: ListChecks, title: 'Select Your Sweeps Casinos', text: 'Register via our links and activate daily bonuses.'},
                  {icon: CalendarCheck, title: 'Visit Every Day', text: 'Open Sweep Drop, click "Get Bonus", and get coins.'},
                  {icon: Coins, title: 'Collect the Max!', text: 'More sweeps casinos = more bonuses. New brands daily.'},
                ].map((s, idx) => (
                <div key={s.title} className="relative z-10">
                  {/* Gradient border wrapper with step-based colors */}
                  <div
                    className="rounded-xl sm:rounded-2xl p-[1.6px]"
                    style={{
                      background:
                        idx === 0
                          ? 'linear-gradient(135deg,#9333EA,#4F46E5)'
                          : idx === 1
                          ? 'linear-gradient(135deg,#9333EA,#22C55E)'
                          : idx === 2
                          ? 'linear-gradient(135deg,#22C55E,#F59E0B)'
                          : 'linear-gradient(135deg,#F59E0B,#FDE047)',
                    }}
                  >
                    <div
                      className="rounded-[inherit] border border-white/10 bg-card/70 backdrop-blur p-4 pl-16 sm:pl-6 sm:p-6 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
                    >
                  {/* Corner icon badge with same glass background + step gradient border */}
                  <div aria-hidden className="absolute top-2 left-2 sm:-top-3 sm:-left-3 z-10">
                    <div
                      className="rounded-xl p-[1.2px]"
                      style={{
                        background:
                          idx === 0
                            ? 'linear-gradient(135deg,#9333EA,#4F46E5)'
                            : idx === 1
                            ? 'linear-gradient(135deg,#9333EA,#22C55E)'
                            : idx === 2
                            ? 'linear-gradient(135deg,#22C55E,#F59E0B)'
                            : 'linear-gradient(135deg,#F59E0B,#FDE047)',
                      }}
                    >
                      <div className="h-10 w-10 sm:h-10 sm:w-10 rounded-[inherit] border border-white/10 bg-card/70 backdrop-blur flex items-center justify-center text-primary shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)]">
                        <s.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute top-1 right-2 sm:top-2 sm:right-3 block text-5xl sm:text-8xl font-extrabold leading-none text-white/[0.06] sm:text-white/[0.04] select-none z-0">
                    {(idx + 1).toString()}
                  </div>
                  <div className="relative z-10">
                    <h3 className="mt-0 sm:mt-3 font-semibold text-[15px] sm:text-base">{s.title}</h3>
                    <p className="mt-1 text-[13px] sm:text-sm text-muted-foreground">{s.text}</p>
                  </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
              <div className="mt-10 flex justify-center">
                <Link href="/login" className="cta-sweeps">
                  <span role="img" aria-label="rocket">🚀</span>
                  <span>Start Earning Freebies</span>
                  <ArrowRight className="ml-1 h-4 w-4 icon" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Block 3: Problem (Before/After) */}
        <BeforeAfterSection />

        {/* Block 4: Solution */}
        <section className="relative py-16 md:py-24">
          <div className="container max-w-[1280px] px-4 md:px-6">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_480px] xl:grid-cols-[minmax(0,1fr)_560px]">
              <div className="relative">
                {/* Organic swooshes behind copy (no boxes) */}
                <div aria-hidden className="pointer-events-none absolute -top-8 -left-20 w-[420px] h-[420px] bg-[radial-gradient(420px_300px_at_0%_0%,hsl(var(--primary)/0.18),transparent_65%)] blur-3xl" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-20 -left-10 w-[560px] h-[260px] opacity-80"
                  style={{
                    WebkitMaskImage:
                      'conic-gradient(from 210deg at 0% 100%, #000 0deg, #000 40deg, transparent 60deg)',
                    maskImage:
                      'conic-gradient(from 210deg at 0% 100%, #000 0deg, #000 40deg, transparent 60deg)',
                    background:
                      'linear-gradient(90deg, hsl(var(--primary)/0.22), rgba(34,197,94,0.18), rgba(245,158,11,0.16))'
                  }}
                />

                <div className="space-y-4 text-center sm:text-left relative z-10">
                  <h2 className="text-[32px] sm:text-[42px] md:text-[52px] leading-tight font-extrabold tracking-[-0.02em] text-white">One site to collect all bonuses 💎</h2>
                  <p className="text-white/70 max-w-2xl mx-auto sm:mx-0">
                    Sweep Drop is your personal free bonus tracker. We've combined dozens of licensed sweepstakes casinos into one dashboard where you can see:
                  </p>
                  <ul className="mt-2 space-y-2 text-sm mx-auto sm:mx-0 max-w-[28rem] text-left">
                    {[
                      "How much you've collected today.",
                      "What bonuses are available right now.",
                      "Where you haven't registered yet and are losing coins.",
                    ].map((text) => (
                      <li key={text} className="grid grid-cols-[1.5rem_1fr] items-start gap-2">
                        <span className="bullet-glow mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full overflow-hidden">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--status-not-registered))]" />
                          <span aria-hidden className="bullet-sheen-line" />
                        </span>
                        <span className="text-white/90 text-left">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative flex justify-center lg:justify-end">
                <Image
                  src="/image/hero-img.png"
                  alt="Sweep Drop hero illustration"
                  width={1200}
                  height={800}
                  sizes="(min-width: 1280px) 560px, (min-width: 1024px) 460px, (min-width: 640px) 380px, 80vw"
                  className="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[460px] xl:max-w-[560px] h-auto object-contain drop-shadow-2xl img-fade-bottom"
                />
                {/* Removed heavy overlay; dissolve is handled by mask on image + subtle fog */}
              </div>
            </div>
          </div>
          {/* removed extra fog overlay to avoid a visible band between sections */}
        </section>

        {/* FOMO counter section removed as requested */}

        {/* Block 6: Features (on-brand glass + step gradients) */}
        <section className="relative py-16 md:py-24">
          <div className="container max-w-[1280px] px-4 md:px-6">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-[28px] sm:text-[40px] md:text-[48px] leading-tight font-extrabold tracking-[-0.02em] text-white">
                Why Sweep Drop is the best way to farm bonuses
              </h2>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10">
              {[
                {icon: LayoutGrid, title: 'All brands. One place.', text: 'All sweeps casinos in one dashboard.'},
                {icon: MousePointerClick, title: '1‑click access', text: 'Open every daily reward directly.'},
                {icon: ShieldCheck, title: 'Safe & Transparent', text: 'Only trusted, licenced brands.'},
                {icon: BarChart, title: 'Progress tracking', text: 'See what you’ve collected and what’s left.'},
                {icon: Zap, title: 'Fast & lightweight', text: 'Minimal UI focused on action.'},
                {icon: Coins, title: 'Real value', text: 'More SC = more free games.'},
              ].map((f, idx) => (
                <div key={f.title} className="relative z-10">
                  {/* Gradient border wrapper with step-based colors (same as How‑To) */}
                  <div
                    className="rounded-xl sm:rounded-2xl p-[1.6px]"
                    style={{
                      background:
                        idx % 4 === 0
                          ? 'linear-gradient(135deg,#9333EA,#4F46E5)'
                          : idx % 4 === 1
                          ? 'linear-gradient(135deg,#9333EA,#22C55E)'
                          : idx % 4 === 2
                          ? 'linear-gradient(135deg,#22C55E,#F59E0B)'
                          : 'linear-gradient(135deg,#F59E0B,#FDE047)',
                    }}
                  >
                    <div className="rounded-[inherit] border border-white/10 bg-card/70 backdrop-blur p-6 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] relative">
                      {/* Corner badge (matches other sections) */}
                      <div aria-hidden className="absolute -top-3 -left-3 z-10">
                        <div
                          className="rounded-xl p-[1.2px]"
                          style={{
                            background:
                              idx % 4 === 0
                                ? 'linear-gradient(135deg,#9333EA,#4F46E5)'
                                : idx % 4 === 1
                                ? 'linear-gradient(135deg,#9333EA,#22C55E)'
                                : idx % 4 === 2
                                ? 'linear-gradient(135deg,#22C55E,#F59E0B)'
                                : 'linear-gradient(135deg,#F59E0B,#FDE047)',
                          }}
                        >
                          <div className="h-10 w-10 rounded-[inherit] border border-white/10 bg-card/70 backdrop-blur flex items-center justify-center text-primary">
                            <f.icon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>

                      <h3 className="mt-1 font-semibold text-[15px] sm:text-base">{f.title}</h3>
                      <p className="mt-1 text-[13px] sm:text-sm text-muted-foreground">{f.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Block 7: Social Proof (elevated cards) */}
        <section className="py-16 md:py-24">
          <div className="container max-w-[1280px] px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold">Chosen by thousands of players</h2>
              <p className="mt-3 text-muted-foreground">Over 100,000 players are already collecting bonuses with us daily. Join them — start from day one.</p>
            </div>

            {/* Mobile: horizontal swipe */}
            <div className="mt-10 -mx-4 sm:mx-0 block sm:hidden">
              <div
                className="flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory snap-always pl-0 pr-4 no-scrollbar"
                style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorX: 'contain' }}
              >
                {[
                  {keyId: 'mike-ohio', name: 'Mike S', place: 'Ohio', text: 'This app is a game-changer. I used to forget my bonuses all the time. Now I get 5+ SC every day.'},
                  {keyId: 'jenny-texas', name: 'Jenny L', place: 'Texas', text: 'Finally! One place for all my daily logins. Super simple and actually useful. Highly recommend.'},
                  {keyId: 'david-florida', name: 'David R', place: 'Florida', text: "I've found 3 new sweeps casinos through Sweep Drop I didn't even know about. My daily collection has doubled."},
                ].map((t) => (
                  <div key={t.keyId} className="snap-start shrink-0 w-[calc(100vw-2rem)] max-w-[520px]">
                    <TestimonialCard keyId={t.keyId} name={t.name} place={t.place} text={t.text} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop/Tablet: grid */}
            <div className="hidden sm:grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr mt-10">
              {[
                {keyId: 'mike-ohio', name: 'Mike S', place: 'Ohio', text: 'This app is a game-changer. I used to forget my bonuses all the time. Now I get 5+ SC every day.'},
                {keyId: 'jenny-texas', name: 'Jenny L', place: 'Texas', text: 'Finally! One place for all my daily logins. Super simple and actually useful. Highly recommend.'},
                {keyId: 'david-florida', name: 'David R', place: 'Florida', text: "I've found 3 new sweeps casinos through Sweep Drop I didn't even know about. My daily collection has doubled."},
              ].map((t) => (
                <TestimonialCard key={t.keyId} keyId={t.keyId} name={t.name} place={t.place} text={t.text} />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link href="/login" className="cta-sweeps">
                <span role="img" aria-label="rocket">🚀</span>
                <span>Join Thousands of Players</span>
                <ArrowRight className="ml-1 h-4 w-4 icon" />
              </Link>
            </div>
          </div>
        </section>

        {/* Block 8: FAQ (split) */}
        <FaqSplit />

        {/* Block 9: Final CTA */}
        <section id="cta" className="relative py-16 md:py-24">
          {/* soft brand glows around the final CTA */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-6 w-[800px] h-[360px] rounded-full bg-[radial-gradient(620px_300px_at_50%_0%,hsl(var(--primary)/0.16),transparent_60%)] blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-6 left-[8%] w-[360px] h-[240px] rounded-full bg-[radial-gradient(340px_220px_at_0%_100%,rgba(34,197,94,0.18),transparent_60%)] blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -top-10 right-[6%] w-[340px] h-[220px] rounded-full bg-[radial-gradient(320px_200px_at_100%_0%,rgba(245,158,11,0.16),transparent_60%)] blur-3xl" />

          <div className="container max-w-[900px] px-4 md:px-6 relative z-10 text-center">
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] leading-tight font-extrabold tracking-[-0.02em] text-white">Ready to collect your bonuses?</h2>
            <p className="mt-3 text-white/70">Join Sweep Drop — your central hub for all daily rewards.</p>
            <div className="mt-6">
              <Link href="/login" className="cta-sweeps">
                <span role="img" aria-label="rocket">🚀</span>
                <span>Get Bonuses Now</span>
                <ArrowRight className="ml-1 h-4 w-4 icon" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// ValueCounter moved to client component at src/components/landing/ValueCounter.tsx
