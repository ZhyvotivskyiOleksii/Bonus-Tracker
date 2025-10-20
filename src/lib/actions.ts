'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from './supabase/server';
import { createAdminClient } from './supabase/admin';
import { CasinoStatus } from './types';
import type { Profile } from './types';


async function getUserProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return profile;
}

export async function getAffiliateLink(casinoId: string, casinoUrl: string): Promise<string> {
  const supabase = createClient();
  const profile = await getUserProfile();
  if (!profile || !profile.short_id) {
    // Not logged in: return original URL. Do NOT update DB without user context.
    return casinoUrl;
  }
  const userId = profile.id;

  try {
    // Update user casino status
    const { data: userCasino, error: selectError } = await supabase
        .from('user_casinos')
        .select('*')
        .eq('user_id', userId)
        .eq('casino_id', casinoId)
        .single();
    
    if (selectError && selectError.code !== 'PGRST116') { // Ignore "no rows found"
        throw selectError;
    }

    // Registration click should mark as Registered (welcome collected today).
    // Subsequent clicks (already registered) count as daily -> CollectedToday.
    const newStatus = userCasino?.status === CasinoStatus.NotRegistered || !userCasino
      ? CasinoStatus.Registered
      : CasinoStatus.CollectedToday;

    if (userCasino) {
        if (userCasino.status !== newStatus) {
            const { error: updateError } = await supabase
                .from('user_casinos')
                .update({ status: newStatus, last_collected_at: new Date().toISOString() })
                .eq('id', userCasino.id);
            if (updateError) throw updateError;
        }
    } else {
        const { error: insertError } = await supabase
            .from('user_casinos')
            .insert({
                user_id: userId,
                casino_id: casinoId,
                status: newStatus,
                last_collected_at: new Date().toISOString(),
            });
        if (insertError) throw insertError;
    }
    
    // Generate simple trackable affiliate link
    const url = new URL(casinoUrl);
    url.searchParams.set('affiliate_id', profile.short_id);
    const affiliateLink = url.toString();
    
    revalidatePath('/dashboard');
    return affiliateLink;
  } catch (error) {
    console.error('Error in getAffiliateLink:', error);
    // Fallback to the original URL if anything fails
    return casinoUrl;
  }
}

// Force-mark a casino as collected for today for the current user (server-side, bypass RLS).
export async function markCollectedToday(casinoId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const profile = await getUserProfile();
  if (!profile) return { success: false, error: 'Not authenticated' };
  const userId = profile.id;
  try {
    // Figure out next status based on existing row
    const { data: existing } = await supabase
      .from('user_casinos')
      .select('id, status')
      .eq('user_id', userId)
      .eq('casino_id', casinoId)
      .maybeSingle();

    const nextStatus = existing?.status === CasinoStatus.NotRegistered || !existing
      ? CasinoStatus.Registered
      : CasinoStatus.CollectedToday;

    const supabaseAdmin = createAdminClient();
    const nowIso = new Date().toISOString();
    if (existing) {
      const { error } = await supabaseAdmin
        .from('user_casinos')
        .update({ status: nextStatus, last_collected_at: nowIso })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from('user_casinos')
        .insert({ user_id: userId, casino_id: casinoId, status: nextStatus, last_collected_at: nowIso });
      if (error) throw error;
    }
    return { success: true };
  } catch (e: any) {
    console.error('markCollectedToday failed:', e);
    return { success: false, error: e?.message || 'Unknown error' };
  }
}
