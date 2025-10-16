import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/layout/LandingHeader';
import { Footer } from '@/components/layout/Footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'casino-1');

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt="Hero"
                  width={600}
                  height={400}
                  data-ai-hint={heroImage.imageHint}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                  priority
                />
              )}
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Never miss a daily bonus
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our tracker helps you keep track of all your daily casino bonuses so you can maximize your earnings.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">Get Started</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything you need to keep track
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From bonus tracking to mass opening - we've got you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
               <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Bonus Tracking</h3>
                      <p className="text-muted-foreground">
                        Keep track of daily bonuses from all your favorite casinos.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Mass Opening</h3>
                      <p className="text-muted-foreground">
                        Open all your bonus pages with a single click.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Personalized Notifications</h3>
                      <p className="text-muted-foreground">
                        Get notified when your bonuses are ready to be collected.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              {heroImage && (
                <Image
                  alt="Features"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                  height="310"
                  src={heroImage.imageUrl}
                  width="550"
                  data-ai-hint="features"
                />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
