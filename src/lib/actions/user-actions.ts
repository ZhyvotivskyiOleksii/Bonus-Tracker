'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { CasinoStatus } from '../types';
import { createAdminClient } from '../supabase/admin';

type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function updateUserCasinoRegistrations(registeredCasinoIds: string[]): Promise<ActionResponse> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    // 1. Get all casinos the user is currently tracking
    const { data: existingUserCasinos, error: fetchError } = await supabase
        .from('user_casinos')
        .select('casino_id')
        .eq('user_id', user.id);
    
    if (fetchError) throw fetchError;

    const existingCasinoIds = new Set(existingUserCasinos.map(uc => uc.casino_id));
    const newCasinoIds = new Set(registeredCasinoIds);

    // 2. Determine which casinos to add and which to remove
    const casinosToAdd = registeredCasinoIds.filter(id => !existingCasinoIds.has(id));
    const casinosToRemove = Array.from(existingCasinoIds).filter(id => !newCasinoIds.has(id));

    // 3. Add new casino registrations
    if (casinosToAdd.length > 0) {
      const newRelations = casinosToAdd.map(casino_id => ({
        user_id: user.id,
        casino_id: casino_id,
        status: CasinoStatus.Registered, // Start as 'Registered'
      }));
      const { error: insertError } = await supabase.from('user_casinos').insert(newRelations);
      if (insertError) throw insertError;
    }

    // 4. Remove casino registrations
    if (casinosToRemove.length > 0) {
      const { error: deleteError } = await supabase
        .from('user_casinos')
        .delete()
        .eq('user_id', user.id)
        .in('casino_id', casinosToRemove);
      if (deleteError) throw deleteError;
    }

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error: any) {
    console.error('Update User Registrations Error:', error);
    return { success: false, error: error.message };
  }
}

export async function registerCasinoForUser(casinoId: string): Promise<ActionResponse> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const { data: existing } = await supabase
      .from('user_casinos')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('casino_id', casinoId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('user_casinos')
        .update({ status: CasinoStatus.Registered, last_collected_at: null })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('user_casinos')
        .insert({ user_id: user.id, casino_id: casinoId, status: CasinoStatus.Registered, last_collected_at: null });
      if (error) throw error;
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('registerCasinoForUser error:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

export type UserData = {
  id: string;
  email: string | undefined;
  is_banned: boolean;
  short_id: string | null;
  referred_by_email: string | null; // Now showing referrer's email
  referrals: { email: string | undefined, short_id: string | null }[];
};

export async function getUsersData(): Promise<UserData[]> {
  const supabaseAdmin = createAdminClient();

  // 1. Verify current user is admin
  const supabase = createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) return [];
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', currentUser.id)
    .single();
  if (profileError || profile?.role !== 'site_manager_privilege') {
    console.error("Permission denied or error fetching profile:", profileError);
    return [];
  }

  // 2. Fetch all users and profiles
  const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
  if (usersError) {
    console.error("Error fetching users with admin client:", usersError);
    return [];
  }
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from('profiles')
    .select('id, short_id');
  if (profilesError) {
    console.error("Error fetching profiles with admin client:", profilesError);
    return [];
  }
  
  // 3. Fetch all referral relationships
  const { data: referrals, error: referralsError } = await supabaseAdmin
    .from('referrals')
    .select('referrer_id, referred_id');
  if (referralsError) {
    console.error("Error fetching referrals:", referralsError);
    return [];
  }
  
  // 4. Create maps for easy lookup
  const userMap = new Map(users.map(u => [u.id, u]));
  const profileMap = new Map(profiles.map(p => [p.id, p]));

  // 5. Build the final UserData array
  const userData = users.map(user => {
    const userProfile = profileMap.get(user.id);
    
    // Find who referred this user
    const referralRecord = referrals.find(r => r.referred_id === user.id);
    const referrerProfile = referralRecord ? profileMap.get(referralRecord.referrer_id) : null;
    const referrerUser = referrerProfile ? userMap.get(referrerProfile.id) : null;
    
    // Find who this user has referred
    const referredUsers = referrals
      .filter(r => r.referrer_id === user.id)
      .map(r => {
        const referredUser = userMap.get(r.referred_id);
        const referredUserProfile = referredUser ? profileMap.get(referredUser.id) : null;
        return {
          email: referredUser?.email,
          short_id: referredUserProfile?.short_id || null,
        };
      });

    return {
      id: user.id,
      email: user.email,
      is_banned: !!user.banned_until && new Date(user.banned_until) > new Date(),
      short_id: userProfile?.short_id || null,
      referred_by_email: referrerUser?.email || null,
      referrals: referredUsers,
    };
  });

  return userData;
}

export async function ensureShortId(): Promise<{ success: boolean; short_id?: string; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };
  try {
    const supabaseAdmin = createAdminClient();
    // if already exists, return
    const { data: profile } = await supabaseAdmin.from('profiles').select('short_id').eq('id', user.id).single();
    if (profile?.short_id) return { success: true, short_id: profile.short_id };
    // generate unique via DB function
    let attempts = 0;
    while (attempts < 5) {
      attempts++;
      const { data: gen } = await supabaseAdmin.rpc('generate_short_id');
      const candidate = (gen as string) || Math.random().toString(36).slice(2, 8);
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ short_id: candidate })
        .eq('id', user.id)
        .is('short_id', null);
      if (!error) return { success: true, short_id: candidate };
    }
    return { success: false, error: 'Could not assign short_id' };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Unknown error' };
  }
}


async function verifyCurrentUserIsAdmin(supabase: any): Promise<{isAdmin: boolean, error?: string}> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { isAdmin: false, error: 'Not authenticated' };
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    
    if (profile?.role !== 'site_manager_privilege') {
        return { isAdmin: false, error: 'Not authorized' };
    }
    return { isAdmin: true };
}


export async function deleteUser(userId: string): Promise<ActionResponse> {
    const supabase = createClient();
    const adminCheck = await verifyCurrentUserIsAdmin(supabase);
    if (!adminCheck.isAdmin) return { success: false, error: adminCheck.error };
    
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser?.id === userId) {
        return { success: false, error: "You cannot delete your own account." };
    }

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true };
}

export async function blockUser(userId: string): Promise<ActionResponse> {
    const supabase = createClient();
    const adminCheck = await verifyCurrentUserIsAdmin(supabase);
    if (!adminCheck.isAdmin) return { success: false, error: adminCheck.error };

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser?.id === userId) {
        return { success: false, error: "You cannot block yourself." };
    }

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: 'none' // 'none' means indefinite ban
    });

    if (error) {
        console.error("Error blocking user:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true };
}

export async function unblockUser(userId: string): Promise<ActionResponse> {
    const supabase = createClient();
    const adminCheck = await verifyCurrentUserIsAdmin(supabase);
    if (!adminCheck.isAdmin) return { success: false, error: adminCheck.error };
    
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: '0' // '0' unbans the user
    });

    if (error) {
        console.error("Error unblocking user:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true };
}
