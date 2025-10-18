
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const MAX_COOKIE_HEADER_BYTES = 16 * 1024; // 16KB total for Cookie header

function byteLength(str: string): number {
  try { return new TextEncoder().encode(str).length } catch { return str.length }
}

function shouldKeepCookie(name: string) {
  // Keep essential auth cookies and our small helper cookie
  if (name.startsWith('sb-')) return true; // Supabase tokens
  if (name === 'referral_code') return true;
  return false;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Guard: if incoming Cookie header exceeds threshold, prune non-essential cookies
  const cookieHeader = request.headers.get('cookie') || '';
  if (byteLength(cookieHeader) > MAX_COOKIE_HEADER_BYTES) {

    const all = request.cookies.getAll();
    const keep = new Set<string>();
    const supabaseCookies: { name: string; value: string }[] = [];
    for (const c of all) {
      if (c.name.startsWith('sb-')) {
        supabaseCookies.push({ name: c.name, value: c.value });
        keep.add(c.name);
      } else if (c.name === 'referral_code') {
        keep.add(c.name);
      }
    }

    // If почему‑то накопилось больше 2 supabase‑кук, оставим самые длинные две
    if (supabaseCookies.length > 2) {
      supabaseCookies
        .sort((a, b) => b.value.length - a.value.length)
        .slice(2)
        .forEach((c) => keep.delete(c.name));
    }

    // Delete everything, что не попало в keep
    for (const c of all) {
      if (!keep.has(c.name)) {
        response.cookies.set({
          name: c.name,
          value: '',
          path: '/',
          maxAge: 0,
        });
      }
    }
  }

  // Capture referral code from URL (?ref=SHORTID) into a cookie for later use (OAuth/email flows)
  try {
    const url = new URL(request.url);
    const ref = url.searchParams.get('ref');
    if (ref && ref.length <= 32) {
      response.cookies.set({
        name: 'referral_code',
        value: ref,
        path: '/',
        sameSite: 'lax',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }
  } catch {}

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll().map((c) => ({ name: c.name, value: c.value }))
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          // mirror to both request and response to keep consistency during this middleware run
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({ request: { headers: request.headers } })
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - icons/ (PWA icons)
     * - images/ (public images)
     * - robots.txt (SEO)
     * - sitemap.xml (SEO)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|icons|images).*)',
  ],
}
