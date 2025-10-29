import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncAllUsersToBrevo } from '@/lib/actions/brevo-actions';
import { brevoGetConfig } from '@/lib/integrations/brevo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Quick config sanity: ensure key exists
    const cfg = brevoGetConfig();
    if (!cfg.hasKey) {
      return NextResponse.json({ success: false, error: 'BREVO_API_KEY not configured on server', config: cfg }, { status: 500 });
    }
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'site_manager_privilege') {
      return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
    }

    const result = await syncAllUsersToBrevo();
    const status = result.success ? 200 : 500;
    return NextResponse.json(result, { status });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
