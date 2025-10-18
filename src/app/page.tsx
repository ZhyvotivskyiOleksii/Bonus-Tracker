import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/layout/LandingHeader';
import { Footer } from '@/components/layout/Footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Zap, ShieldCheck, BarChart } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'casino-1');

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        {/* Section 1: Hero */}
        <section className="w-full py-14 md:py-24 relative overflow-hidden">
          <div className="container max-w-[1280px] px-4 md:px-6 relative">
            <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(680px,1fr)_560px] xl:grid-cols-[minmax(760px,1fr)_600px] lg:gap-6 xl:gap-8">
              <div className="flex flex-col justify-center items-center space-y-6">
                <div className="space-y-4">
                  <h1 className="mx-auto max-w-[900px] xl:max-w-[980px] text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.02] text-center">
                    <span className="text-white/95">Track daily casino bonuses </span>
                    <span className="block bg-clip-text text-transparent bg-[linear-gradient(90deg,hsl(var(--primary))_0%,hsl(var(--primary)/0.8)_35%,hsl(0_0%_100%/_0.95)_100%)]">
                      and never miss rewards
                    </span>
                  </h1>
                  <p className="max-w-[700px] text-muted-foreground md:text-lg text-center">
                    sweep-drop keeps your bonuses organized, reminds you when they reset, and shows your progress at a glance.
                    Simple, fast, and designed for everyday use.
                  </p>
                  {/* feature bullets moved to floating cards below */}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link href="/login">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="#features">Explore Features</Link>
                  </Button>
                </div>
              </div>
              <div className="lg:order-last flex justify-center lg:justify-end lg:-ml-6 xl:-ml-8">
                <Image
                  src="/image/hero-img.png"
                  alt="sweep-drop hero"
                  width={1100}
                  height={740}
                  className="w-[96%] max-w-[600px] h-auto rounded-3xl object-contain drop-shadow-2xl mx-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick floating features just below hero */}
        <section className="relative -mt-12 sm:-mt-16 z-10">
          <div className="container max-w-[1280px] px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 place-items-center gap-4 md:gap-6">
              {[{
                icon: BarChart,
                title: 'Daily progress',
                desc: 'SC/GC with reset timer',
              }, {
                icon: Zap,
                title: 'Smart ordering',
                desc: 'Priority casinos on top',
              }, {
                icon: Bell,
                title: 'Push alerts',
                desc: 'So you won’t forget',
              }].map((f, i) => (
                <Card key={i} className="w-full max-w-[360px] bg-card/70 backdrop-blur-md rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.65)] hover:-translate-y-1 transition-all">
                  <CardContent className="p-6 flex items-center justify-between gap-4">
                    <div className="flex-1 text-center">
                      <div className="text-base md:text-lg font-semibold leading-tight">{f.title}</div>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                    <f.icon className="h-8 w-8 sm:h-9 sm:w-9 text-primary flex-shrink-0" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Features & How it works */}
        <section id="features" className="w-full py-16 md:py-24">
          <div className="container max-w-[1280px] px-4 md:px-6">
            <div className="text-center space-y-3">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-xs tracking-wide">Why sweep-drop</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need, zero clutter</h2>
              <p className="max-w-2xl mx-auto text-muted-foreground md:text-base">
                A clean dashboard with your casinos, live progress, and gentle reminders. Built to be fast and distraction‑free.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-10">
              {[{icon: Bell, title: 'Smart reminders', desc: 'Optional alerts when bonuses reset.'},
                {icon: Zap, title: 'Fast actions', desc: 'Open offers and collect in a tap.'},
                {icon: ShieldCheck, title: 'Private by design', desc: 'Only essential data for the tracker.'},
                {icon: BarChart, title: 'Clear progress', desc: 'Daily SC/GC with totals and timer.'}
              ].map((f, i) => (
                <Card key={i} className="bg-card/70 backdrop-blur border-border">
                  <CardContent className="p-5 space-y-2">
                    <f.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div id="how-it-works" className="grid gap-6 lg:grid-cols-3 mt-12">
              {[{step: '1', title: 'Sign in', text: 'Log in and pick your casinos.'},
                {step: '2', title: 'Track & collect', text: 'See daily SC/GC and collect bonuses.'},
                {step: '3', title: 'Stay on time', text: 'Watch the reset timer and never miss a day.'}
              ].map((s) => (
                <div key={s.step} className="rounded-xl border bg-card p-5">
                  <div className="text-primary text-sm font-semibold">Step {s.step}</div>
                  <div className="mt-1 font-bold">{s.title}</div>
                  <p className="text-sm text-muted-foreground mt-1">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
