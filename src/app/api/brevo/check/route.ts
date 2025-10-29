import { NextResponse } from 'next/server';
import { brevoGetConfig, getBrevoKey } from '@/lib/integrations/brevo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cfg = brevoGetConfig();
    // Basic sanity: do we have key and list ids?
    const result: any = { hasKey: cfg.hasKey, listIds: cfg.listIds };

    if (!cfg.hasKey) {
      return NextResponse.json({ ok: false, reason: 'BREVO_API_KEY missing', ...result }, { status: 500 });
    }

    // Try a lightweight account call to validate the key
    try {
      const apiKey = getBrevoKey();
      if (!apiKey) {
        return NextResponse.json({ ok: false, reason: 'BREVO_API_KEY missing (resolved)', ...result }, { status: 500 });
      }
      const res = await fetch('https://api.brevo.com/v3/account', {
        headers: { 'api-key': apiKey, 'accept': 'application/json' },
        cache: 'no-store',
      } as any);
      const text = await res.text();
      result.accountStatus = res.status;
      result.accountBody = text;
      if (!res.ok) {
        return NextResponse.json({ ok: false, reason: 'Account check failed', ...result }, { status: res.status || 500 });
      }
    } catch (e: any) {
      return NextResponse.json({ ok: false, reason: e?.message || 'Network error', ...result }, { status: 500 });
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ ok: false, reason: e?.message || 'Unknown error' }, { status: 500 });
  }
}
