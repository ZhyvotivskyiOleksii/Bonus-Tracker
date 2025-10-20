import type { Metadata } from 'next'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service | Sweep-Drop',
  description: 'Terms of Service for Sweep-Drop',
}

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        <div className="container max-w-3xl py-10 px-4 space-y-8">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: Oct 2025</p>

      <section className="space-y-3">
        <p>Welcome to Sweep-Drop. By accessing or using our service you agree to these Terms.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Use of Service</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>You must be at least 18 and comply with applicable laws.</li>
          <li>You are responsible for your account and keeping credentials secure.</li>
          <li>Do not misuse the service (e.g., automate abuse, attempt to breach security).</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Accounts</h2>
        <p>
          Creating an account requires a valid email or social login. We may suspend or terminate accounts
          for violations of these Terms or misuse.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Content and IP</h2>
        <p>
          The service, including logos and UI, is owned by us or our licensors. You receive a limited license
          to use the service for personal purposes.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Disclaimers</h2>
        <p>
          The service is provided “as is” without warranties. We are not responsible for third‑party sites
          you visit through the app.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, we shall not be liable for indirect or consequential damages
          arising from your use of the service.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Termination</h2>
        <p>
          You may stop using the service at any time. We may suspend or terminate access if you breach these Terms.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Changes</h2>
        <p>
          We may update these Terms. Continued use after changes means you accept the updated Terms.
        </p>
      </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Contact</h2>
            <p>
              Contact: <a className="underline" href="mailto:contact@sweep-drop.com">contact@sweep-drop.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
