import type { Metadata } from 'next'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Responsible Gaming | Sweep Drop',
  description: 'Guidelines and resources for safe sweepstakes play on Sweep Drop.',
}

export default function ResponsibleGamingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1 pt-14">
        <div className="container max-w-3xl py-10 px-4 space-y-8">
          <h1 className="text-3xl font-bold">Responsible Gaming</h1>
          <p className="text-sm text-muted-foreground">Play for fun. Stay in control.</p>

          <section className="space-y-3">
            <p>
              Sweep Drop is not a sweeps casino and does not accept wagers. We curate daily bonuses from
              licensed sweepstakes operators in the United States. Even so, your time and attention are valuable.
              Please use Sweep Drop responsibly and keep play fun.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Helpful guidelines</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Set a daily time limit for checking bonuses.</li>
              <li>Take regular breaks. Do not play when stressed or tired.</li>
              <li>Do not chase losses on external sites. Bonuses are a perk, not income.</li>
              <li>Only use Sweep Drop if you are 18+ and legally allowed to access sweepstakes promotions in your state.</li>
              <li>Mute or disable notifications if you need time away.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Need support?</h2>
            <p>
              If you feel that gaming is impacting your wellbeing, consider these resources:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                National Council on Problem Gambling (NCPG):
                <a className="underline ml-1" href="https://www.ncpgambling.org/" target="_blank" rel="noreferrer">ncpgambling.org</a>
                {' '}| Helpline: <a className="underline" href="tel:1-800-522-4700">1‑800‑522‑4700</a>
              </li>
              <li>
                988 Suicide & Crisis Lifeline: <a className="underline" href="tel:988">Dial 988</a>
              </li>
              <li>
                Your state’s responsible gaming program (many list local helplines and self‑exclusion options).
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Contact us</h2>
            <p>
              Have questions about responsible play on Sweep Drop? Contact our support team at
              <a className="underline ml-1" href="mailto:contact@sweep-drop.com">contact@sweep-drop.com</a>.
            </p>
          </section>

          <section className="space-y-2 text-sm text-muted-foreground">
            <p>
              Disclaimer: Sweep Drop is a tool to discover and organize sweepstakes bonuses from licensed brands.
              We do not operate gambling and do not provide real‑money wagering.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
