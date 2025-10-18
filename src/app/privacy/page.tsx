import type { Metadata } from 'next'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | sweep-drop',
  description: 'Privacy Policy for sweep-drop',
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        <div className="container max-w-3xl py-10 px-4 space-y-8">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: Oct 2025</p>

          <section className="space-y-3">
            <p>
              This Privacy Policy explains how sweep-drop ("we", "us", "our") collects, uses,
              and protects personal information when you use our website and services.
            </p>
            <p>
              If you have questions, contact us at <a className="underline" href="mailto:contact@sweep-drop.com">contact@sweep-drop.com</a>.
            </p>
          </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Account data: email address and basic profile from the authentication provider.</li>
          <li>Service data: your selected casinos and collection status (to operate the tracker).</li>
          <li>Notifications (optional): push token if you enable alerts in your browser.</li>
          <li>Technical data: cookies and basic device information used for security and session management.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">How We Use Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide authentication and maintain your session.</li>
          <li>Operate bonus tracking and display your daily progress.</li>
          <li>Send optional notifications if you opt in.</li>
          <li>Maintain security, prevent abuse, and comply with legal obligations.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Sharing and Processors</h2>
        <p>
          We use service providers to host and operate the product, such as Supabase (authentication,
          database, storage) and, if enabled, Firebase Cloud Messaging for push notifications.
          These providers process data on our behalf under appropriate safeguards.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Data Retention</h2>
        <p>
          We retain account and service data while your account is active. You may request deletion of
          your account at any time; see the Data Deletion instructions.
        </p>
      </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Your Rights</h2>
            <p>
              Where applicable, you may have rights to access, correct, or delete your information. Contact us at
              <a className="underline ml-1" href="mailto:contact@sweep-drop.com">contact@sweep-drop.com</a> to exercise these rights.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Contact</h2>
            <p>
              sweep-drop — Contact: <a className="underline" href="mailto:contact@sweep-drop.com">contact@sweep-drop.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
