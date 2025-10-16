
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        // Explicit domain helps persistence across tabs/subdomains
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
      },
      cookies: {
        async getAll() {
          const store = await cookies()
          return store.getAll().map((c) => ({ name: c.name, value: c.value }))
        },
        async setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          const store = await cookies()
          for (const { name, value, options } of cookiesToSet) {
            try {
              store.set({ name, value, ...options })
            } catch {}
          }
        },
      },
    }
  )
}
