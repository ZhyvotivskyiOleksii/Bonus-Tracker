import type { Metadata } from 'next'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Data Deletion | Sweep-Drop',
  description: 'User data deletion instructions for Sweep-Drop',
}

export default function DataDeletionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        <div className="container max-w-3xl py-10 px-4 space-y-8">
          <h1 className="text-3xl font-bold">User Data Deletion</h1>
          <p className="text-sm text-muted-foreground">Required for Facebook Login</p>

      <section className="space-y-3">
        <p>
          Sweep-Drop stores minimal personal data to operate the service (account email, profile
          identifier, your casino selections and collection status, and optional push token).
        </p>
        <p>
          You can request deletion of your account and associated personal data at any time using
          the method below.
        </p>
      </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">How to request deletion</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Send an email to <a className="underline" href="mailto:contact@sweep-drop.com">contact@sweep-drop.com</a> with subject “Account Deletion”.</li>
              <li>From the email address linked to your account, include “Delete my Sweep-Drop account”.</li>
              <li>We will verify ownership and permanently delete account data within 30 days.</li>
            </ol>
          </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">What will be deleted</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Account profile and referral identifier.</li>
          <li>Your casino selections and collection history.</li>
          <li>Notification tokens (if any).</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Note: We do not control external casino websites you visit; deletion here does not affect their systems.
        </p>
      </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
