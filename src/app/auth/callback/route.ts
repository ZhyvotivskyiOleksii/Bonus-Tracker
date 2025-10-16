
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';
  const referralCode = requestUrl.searchParams.get('referral_code');

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user && referralCode) {
      // Find the referrer by their short_id
      const { data: referrerProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('short_id', referralCode)
        .single();
      
      if (referrerProfile) {
        // Create a record in the referrals table
        await supabase
          .from('referrals')
          .insert({
            referrer_id: referrerProfile.id,
            referred_id: data.user.id
          });
      }
    }

    if (!error) {
      // Prefer explicit site URL when provided (production). Fallback to request origin (dev).
      const envBase = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || undefined;
      const base = envBase || requestUrl.origin;
      const target = new URL(next, base).toString();
      return NextResponse.redirect(target)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(requestUrl.origin + '/login?error=Could not authenticate user')
}
