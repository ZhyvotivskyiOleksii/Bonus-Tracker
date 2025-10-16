"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionResponse = {
  success: boolean;
  error?: string;
  user?: { id: string, email: string | undefined };
};

const ADMIN_ROLE = 'site_manager_privilege';

async function verifyCurrentUserIsAdmin(supabase: any): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    
    return profile?.role === ADMIN_ROLE;
}

export async function getAdmins(): Promise<{id: string, email: string | undefined}[]> {
  const supabaseAdmin = createAdminClient();
  const supabase = createClient();

  if (!await verifyCurrentUserIsAdmin(supabase)) {
    console.error("Attempt to get admins by non-admin user");
    return [];
  }
  
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error("Error fetching users:", error);
    // This could be a permissions error if the service role key is wrong
    if (error.name === 'AuthApiError') {
      throw new Error("AuthApiError: Failed to fetch users. Check your Supabase service role key.");
    }
    return [];
  }
  
  const userIds = users.map(u => u.id);
  // Use service role to bypass RLS when reading all profiles
  const { data: profiles, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, role')
    .in('id', userIds)
    .eq('role', ADMIN_ROLE);
    
  if (profileError) {
    console.error("Error fetching profiles:", profileError);
    return [];
  }

  const adminIds = new Set(profiles.map(p => p.id));
  
  return users
    .filter(u => adminIds.has(u.id))
    .map(u => ({ id: u.id, email: u.email }));
}


export async function grantAdminRights(email: string): Promise<ActionResponse> {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient();

  if (!await verifyCurrentUserIsAdmin(supabase)) {
      return { success: false, error: 'Not authorized' };
  }

  try {
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const targetUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!targetUser) {
      return { success: false, error: "User not found." };
    }
    
    // Use service role to bypass RLS when updating user role
    const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role: ADMIN_ROLE })
        .eq('id', targetUser.id);
    
    if (updateError) throw updateError;
    
    revalidatePath("/settings");
    return { success: true, user: { id: targetUser.id, email: targetUser.email } };

  } catch (error: any) {
    console.error("Grant Admin Error:", error);
    return { success: false, error: error.message };
  }
}

export async function revokeAdminRights(userId: string): Promise<ActionResponse> {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient();

  if (!await verifyCurrentUserIsAdmin(supabase)) {
      return { success: false, error: 'Not authorized' };
  }

  try {
     const { data: { user: currentUser } } = await supabase.auth.getUser();
     if(currentUser?.id === userId) {
         return { success: false, error: "Cannot revoke your own admin rights." };
     }

    // Use service role for role updates
    const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role: null }) // Set role to null or a default role
        .eq('id', userId);
        
    if (updateError) throw updateError;

    revalidatePath("/settings");
    return { success: true };

  } catch (error: any) {
    console.error("Revoke Admin Error:", error);
    return { success: false, error: error.message };
  }
}
