
'use client';

import { useState, useEffect } from 'react';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { app } from '@/lib/firebase/firebase';
import { createClient } from '@/lib/supabase/client';
import { useToast } from './use-toast';

export function useFcm() {
  const { toast } = useToast();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(false);

  useEffect(() => {
    isSupported().then((supported) => {
      setIsSupportedBrowser(supported);
      if (supported && typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationPermission(Notification.permission);
        // Foreground messages: show OS notification too
        try {
          const messaging = getMessaging(app);
          onMessage(messaging, async (payload) => {
            if (Notification.permission !== 'granted') return;
            const reg = await navigator.serviceWorker.getRegistration();
            if (!reg) return;
            const title = payload.notification?.title || 'Notification';
            const options: NotificationOptions = {
              body: payload.notification?.body,
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-192x192.png',
              data: { url: (payload?.fcmOptions?.link || '/dashboard') }
            };
            reg.showNotification(title, options);
          });
        } catch {}
        // Also check if we already have a token in the DB
        const checkToken = async () => {
            const supabase = createClient();
            const {data: {user}} = await supabase.auth.getUser();
            if (user) {
                const {data: profile} = await supabase.from('profiles').select('fcm_token').eq('id', user.id).single();
                if (profile?.fcm_token) {
                    setFcmToken(profile.fcm_token);
                }
            }
        }
        checkToken();
      }
    });
  }, []);

  const getAndSaveToken = async (): Promise<string | null> => {
    if (!isSupportedBrowser || typeof window === 'undefined') {
      toast({ variant: 'destructive', title: 'Unsupported Browser', description: 'Push notifications are not supported in this browser.' });
      return null;
    }
    
    const messaging = getMessaging(app);

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
          console.error('Firebase VAPID key is not set in environment variables.');
          toast({ variant: 'destructive', title: 'Configuration Error', description: 'Cannot request notification permission. VAPID key is missing.' });
          return null;
        }

        // Ensure an active service worker controls the page before subscribing
        let swRegistration: ServiceWorkerRegistration | undefined;
        try {
          swRegistration = await navigator.serviceWorker.ready;
        } catch {}
        if (!swRegistration) {
          throw new Error('Service worker is not ready');
        }

        const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: swRegistration });

        if (token) {
          setFcmToken(token);
          // Save token to Supabase
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { error } = await supabase.from('profiles').update({ fcm_token: token }).eq('id', user.id);
            if (error) {
              console.error('Error saving FCM token:', error);
              toast({ variant: 'destructive', title: 'Error', description: 'Could not save notification settings.' });
              return null; // Return null on failure
            } else {
              toast({ title: 'Success!', description: 'Push notifications have been enabled.' });
            }
          }
          return token;
        } else {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not get notification token.' });
          return null;
        }
      } else {
        toast({ title: 'Info', description: 'Notification permission was not granted.' });
        return null;
      }
    } catch (error: any) {
      console.error('Error getting FCM token:', error);
      toast({ variant: 'destructive', title: 'Error', description: `An error occurred while enabling notifications: ${error.message}` });
      return null;
    }
  };
  
  const disableNotifications = async (): Promise<boolean> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('profiles').update({ fcm_token: null }).eq('id', user.id);
      if (error) {
         toast({ variant: 'destructive', title: 'Error', description: 'Could not disable notifications.' });
         return false;
      } else {
         toast({ title: 'Success', description: 'Notifications have been disabled.' });
         setFcmToken(null);
         setNotificationPermission('default');
         return true;
      }
    }
    return false;
  }

  return { fcmToken, notificationPermission, getAndSaveToken, disableNotifications, isSupportedBrowser };
}
