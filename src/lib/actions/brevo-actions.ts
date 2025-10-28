"use server";

import { createAdminClient } from '@/lib/supabase/admin';
import { brevoUpsertContact } from '@/lib/integrations/brevo';

export async function syncAllUsersToBrevo(): Promise<{ success: boolean; synced: number; failed: number; error?: string }>
{
  try {
    const supabaseAdmin = createAdminClient();
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) return { success: false, synced: 0, failed: 0, error: error.message };
    let synced = 0;
    let failed = 0;
    for (const u of users) {
      const email = u.email;
      if (!email) continue;
      const res = await brevoUpsertContact(email, { attributes: { USER_ID: u.id } });
      if (res.success) synced++; else failed++;
      // Small throttle to avoid API rate limits
      await new Promise(r => setTimeout(r, 120));
    }
    return { success: true, synced, failed };
  } catch (e: any) {
    return { success: false, synced: 0, failed: 0, error: e?.message || 'Unknown error' };
  }
}

