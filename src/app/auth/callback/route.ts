
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { brevoUpsertContact } from '@/lib/integrations/brevo'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';
  // Referral can arrive via OAuth query param, cookie (set by middleware), or user_metadata
  const referralCodeFromQuery = requestUrl.searchParams.get('referral_code');
  const referralCodeFromCookie = request.cookies.get('referral_code')?.value || null;

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      const user = data.user as any;
      let wasNewProfile = false;

      // Ensure a profile row exists for the user (some projects miss the DB trigger)
      try {
        const supabaseAdmin = createAdminClient();
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
        if (!existingProfile) {
          await supabaseAdmin
            .from('profiles')
            .insert({ id: user.id, username: user.email, role: 'user' });
          wasNewProfile = true;
        }
      } catch (e) {
        console.error('Profile ensure failed', e);
      }
      const referralCode = referralCodeFromQuery || referralCodeFromCookie || user?.user_metadata?.referred_by || null;
      if (referralCode) {
        const supabaseAdmin = createAdminClient();
        // Find the referrer by their short_id (admin client to bypass RLS)
        const { data: referrerProfile, error: referrerErr } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('short_id', referralCode)
          .single();
        if (referrerErr) {
          console.error('Referral: failed to find referrer by short_id', referrerErr);
        }

        if (referrerProfile && referrerProfile.id !== user.id) {
          // Avoid duplicates: one referral per referred user
          const { data: existing, error: existErr } = await supabaseAdmin
            .from('referrals')
            .select('id')
            .eq('referred_id', user.id)
            .maybeSingle();
          if (existErr) {
            console.error('Referral: check existing failed', existErr);
          }

          if (!existing) {
            const { error: insertErr } = await supabaseAdmin
              .from('referrals')
              .insert({ referrer_id: referrerProfile.id, referred_id: user.id });
            if (insertErr) {
              console.error('Referral: insert failed', insertErr);
            }
            // Clear the cookie after successful link
            try {
              // Upsert contact to Brevo even on the referral early-return path
              try {
                if (user?.email) {
                  await brevoUpsertContact(user.email, { attributes: { USER_ID: user.id } });
                }
              } catch (e) {
                console.warn('Brevo upsert (referral branch) failed:', e);
              }

              const res = NextResponse.redirect(new URL(next, requestUrl.origin));
              res.cookies.set({ name: 'referral_code', value: '', maxAge: 0, path: '/' });
              // Signal GTM about auth result (login vs signup). Short-lived cookie read on client.
              res.cookies.set({
                name: 'gtm_evt',
                value: wasNewProfile ? 'signup' : 'login',
                maxAge: 60,
                path: '/',
                domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
              });
              return res;
            } catch {}
          }
        }
      }
    }

    if (!error) {
      // Best-effort: upsert contact into Brevo for email comms
      try {
        if (data?.user?.email) {
          await brevoUpsertContact(data.user.email, {
            attributes: { USER_ID: data.user.id },
          });
        }
      } catch (e) {
        console.warn('Brevo upsert (auth callback) failed:', e);
      }
      // Prefer explicit site URL when provided (production). Fallback to request origin (dev).
      const envBase = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || undefined;
      const base = envBase || requestUrl.origin;
      const target = new URL(next, base).toString();
      const res = NextResponse.redirect(target);
      // Signal GTM about auth result (login vs signup). Short-lived cookie read on client.
      res.cookies.set({
        name: 'gtm_evt',
        value: (typeof wasNewProfile !== 'undefined' && wasNewProfile) ? 'signup' : 'login',
        maxAge: 60,
        path: '/',
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
      });
      return res;
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(requestUrl.origin + '/login?error=Could not authenticate user')
}
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
