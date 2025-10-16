
'use server';

import { createClient } from '../supabase/server';
import { adminMessaging } from '../firebase/admin';
import { revalidatePath } from 'next/cache';

type ActionResponse = {
  success: boolean;
  error?: string;
  sentCount?: number;
};

// Helper function to verify admin
async function verifyIsAdmin(supabase: any): Promise<{isAdmin: boolean, userId?: string, error?: string}> {
  const { data: { user }, } = await supabase.auth.getUser();
  if (!user) {
    return { isAdmin: false, error: 'Not authenticated' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'site_manager_privilege') {
    return { isAdmin: false, error: 'Not authorized' };
  }
  
  return { isAdmin: true, userId: user.id };
}


export async function sendPushNotification(
  title: string,
  body: string,
  userId?: string
): Promise<ActionResponse> {
  
  if (!adminMessaging) {
    const errorMessage = 'Firebase Admin not initialized. Check server logs and FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 environment variable.';
    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }

  const supabase = createClient();
  const adminCheck = await verifyIsAdmin(supabase);
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }
  
  // Save notification to our DB
  const { data: newNotification, error: insertError } = await supabase
    .from('notifications')
    .insert({ title, body, created_by: adminCheck.userId })
    .select()
    .single();

  if (insertError) {
    console.error('Failed to save notification:', insertError);
    return { success: false, error: `Failed to save notification to database. ${insertError.message}` };
  }
  
  revalidatePath('/admin/notifications');
  revalidatePath('/dashboard');

  // Fetch FCM tokens
  const query = supabase
    .from('profiles')
    .select('fcm_token')
    .not('fcm_token', 'is', null);
  
  if (userId) {
    query.eq('id', userId);
  }

  const { data: profiles, error: profileError } = await query;

  if (profileError) {
    console.error('Error fetching profiles for notification:', profileError);
    return { success: false, error: 'Failed to fetch user tokens.' };
  }

  const tokens = profiles.map((p) => p.fcm_token).filter((t): t is string => t !== null);

  if (tokens.length === 0) {
    return { success: true, sentCount: 0 };
  }
  
  // Send notification via Firebase Admin SDK
  try {
     const message = {
        notification: {
            title,
            body,
        },
        tokens: tokens,
        webpush: {
            notification: {
                icon: '/icons/icon-192x192.png',
            },
            fcm_options: {
                link: '/dashboard',
            }
        },
     };
    
    const response = await adminMessaging.sendEachForMulticast(message);

    const sentCount = response.successCount;
    
    if (response.failureCount > 0) {
      console.warn(`Failed to send notification to ${response.failureCount} tokens.`);
    }
    
    return { success: true, sentCount };

  } catch (error: any) {
    console.error('Firebase messaging error:', error);
    return { success: false, error: `Failed to send notifications: ${error.message}` };
  }
}

export async function getNotificationsForUser() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { notifications: [], dismissed: [] };

    const { data: profile } = await supabase
        .from('profiles')
        .select('dismissed_notifications')
        .eq('id', user.id)
        .single();
    
    const dismissedIds = profile?.dismissed_notifications || [];
    
    const query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (dismissedIds.length > 0) {
        query.not('id', 'in', `(${dismissedIds.join(',')})`);
    }
    
    const { data, error } = await query.limit(20);
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return { notifications: [], dismissed: [] };
    }

    return { notifications: data || [], dismissed: dismissedIds };
}

export async function dismissNotification(notificationId: string): Promise<ActionResponse> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }
    
    // We use a stored procedure to safely append to the array
    const { error } = await supabase.rpc('append_to_dismissed_notifications', {
        user_id_input: user.id,
        notification_id_input: notificationId
    });

    if (error) {
        console.error('Error dismissing notification (RPC call):', error);
        return { success: false, error: `Could not dismiss notification. DB Error: ${error.message}` };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

export async function markNotificationsAsRead(userId: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from('profiles')
        .update({ notifications_last_read_at: new Date().toISOString() })
        .eq('id', userId);

    if (error) {
        console.error('Error marking notifications as read:', error);
        return { success: false, error: error.message };
    }
    revalidatePath('/dashboard');
    return { success: true };
}
