import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncAllUsersToBrevo } from '@/lib/actions/brevo-actions';

export async function POST() {
  try {
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

