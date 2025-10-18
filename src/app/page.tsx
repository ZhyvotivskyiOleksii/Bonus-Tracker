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
        <section className="w-full py-14 md:py-24 bg-card relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_0%_0%,hsl(var(--primary)/0.12),transparent_55%)]" />
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_480px] lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none">
                    Track daily casino bonuses and never miss rewards
                  </h1>
                  <p className="max-w-[650px] text-muted-foreground md:text-lg">
                    sweep-drop keeps your bonuses organized, reminds you when they reset, and shows your progress at a glance.
                    Simple, fast, and designed for everyday use.
                  </p>
                  <ul className="grid gap-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary inline-block"/> Daily SC/GC progress with reset timer</li>
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary inline-block"/> Smart ordering and priority casinos on top</li>
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary inline-block"/> Optional push alerts so you won’t forget</li>
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg">
                    <Link href="/login">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="#features">Explore Features</Link>
                  </Button>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt="App preview"
                  width={720}
                  height={540}
                  data-ai-hint={heroImage.imageHint}
                  className="mx-auto aspect-video overflow-hidden rounded-2xl ring-1 ring-border/60 object-cover sm:w-full lg:order-last lg:aspect-[4/3]"
                  priority
                />
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Features & How it works */}
        <section id="features" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
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
