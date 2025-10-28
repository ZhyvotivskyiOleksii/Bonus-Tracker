'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Bell, Loader2, CheckCheck, X } from 'lucide-react';
import Link from 'next/link';
import { MainSidebarNav } from './MainSidebarNav';
import SweepDropLogo from '@/components/brand/SweepDropLogo';
import type { User } from '@supabase/supabase-js';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Profile } from '@/lib/types';
import { HeaderStats } from './HeaderStats';
import { HeaderMiniStats } from './HeaderMiniStats';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { UserMenuSheet } from '../settings/UserMenuSheet';
import { getNotificationsForUser, markNotificationsAsRead, dismissNotification } from '@/lib/actions/notification-actions';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Notification = {
  id: string;
  created_at: string;
  title: string;
  body: string;
  created_by: string | null;
};

export function Header({ user, profile, showStats = false }: { user: User, profile: Profile | null, showStats?: boolean }) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [lastReadTimestamp, setLastReadTimestamp] = useState<string | null>(profile?.notifications_last_read_at || null);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const isAdmin = profile?.role === 'site_manager_privilege';

  const fetchUserNotifications = async () => {
      const { notifications: fetchedNotifications } = await getNotificationsForUser();
      setNotifications(fetchedNotifications);
      setIsLoadingNotifications(false);
  };
  
  useEffect(() => {
    fetchUserNotifications();
    
    const supabase = createClient();
    const channel = supabase
      .channel('notifications')
      .on<Notification>(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications' }, 
        (payload) => {
           // We only add it if it's not already dismissed, which we can't know without a full refresh.
           // A full refresh is simpler and ensures consistency.
           fetchUserNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (isLoadingNotifications) return;
    const lastRead = lastReadTimestamp ? new Date(lastReadTimestamp) : new Date(0);
    const hasUnread = notifications.some(n => new Date(n.created_at) > lastRead);
    setHasNewNotification(hasUnread);

    // If there are no notifications, there can't be new ones.
    if (notifications.length === 0) {
      setHasNewNotification(false);
    }
  }, [notifications, lastReadTimestamp, isLoadingNotifications]);


  const getInitials = (email: string | undefined) => {
    if (!email) return 'U';
    return email.split('@')[0].substring(0, 2).toUpperCase();
  }
  
  const handleMarkAllAsRead = async () => {
    if (!hasNewNotification) return;
    setIsMarkingAsRead(true);
    const newTimestamp = new Date().toISOString();
    const result = await markNotificationsAsRead(user.id);
    if (result.success) {
        setLastReadTimestamp(newTimestamp);
        setHasNewNotification(false);
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not mark notifications as read.'
        })
    }
    setIsMarkingAsRead(false);
  }

  const handleDismissNotification = async (notificationId: string) => {
    // Optimistically update the UI
    const remainingNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(remainingNotifications);

    // After optimistic update, check if there are any unread notifications left
    const lastRead = lastReadTimestamp ? new Date(lastReadTimestamp) : new Date(0);
    const stillHasUnread = remainingNotifications.some(n => new Date(n.created_at) > lastRead);
    if (!stillHasUnread) {
        setHasNewNotification(false);
    }

    const result = await dismissNotification(notificationId);

    if (!result.success) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error || 'Could not dismiss notification.'
        });
        // Re-fetch to revert optimistic update on failure
        fetchUserNotifications();
    }
  }


  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b shadow-[0_5px_15px_-10px_hsl(var(--border))]">
      <div className="w-full px-5 h-14 flex items-center justify-between gap-4">
       <div className="flex items-center gap-4">
        {isAdmin && (
            <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <SheetHeader>
                  <VisuallyHidden>
                    <SheetTitle>Mobile Menu</SheetTitle>
                  </VisuallyHidden>
                </SheetHeader>
                <nav className="grid gap-6 text-sm font-medium pr-10 pt-1">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 self-start ml-2 mt-1 mr-4 px-1.5 py-1 rounded-md text-foreground/90 hover:text-foreground"
                    >
                        <SweepDropLogo size={16} coinSize={14} />
                    </Link>
                    <MainSidebarNav isAdmin={isAdmin} />
                </nav>
            </SheetContent>
            </Sheet>
        )}
        {/* Brand: hide on mobile, show logo + name on desktop */}
        <Link
          href="/dashboard"
          className="hidden md:flex h-9 shrink-0 items-center gap-2 self-start"
        >
          <SweepDropLogo size={20} coinSize={16} />
        </Link>
       </div>
      
      <div className="flex-1 flex items-center justify-center">
        {showStats && (
            <div className="hidden md:block w-full">
                <HeaderStats />
            </div>
        )}
        {showStats && <HeaderMiniStats />}
      </div>

      <div className="flex items-center gap-2">
         {/* Desktop/tablet: popover */}
         <div className="hidden md:block">
           <Popover>
              <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="overflow-hidden rounded-full relative">
                      <Bell className="h-5 w-5" />
                      {hasNewNotification && (
                        <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                      )}
                  </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[420px] p-0 bg-background/70 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-b from-white/5 to-transparent">
                    <h4 className="font-medium leading-none">Notifications</h4>
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleMarkAllAsRead} 
                        disabled={!hasNewNotification || isMarkingAsRead}
                        className="text-xs text-muted-foreground hover:text-primary"
                      >
                        {isMarkingAsRead ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CheckCheck className="h-3 w-3 mr-1" />}
                        Mark all as read
                      </Button>
                  </div>
                  <div className="flex flex-col gap-2 p-3 max-h-[420px] overflow-y-auto">
                      {isLoadingNotifications ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map(n => {
                          const isUnread = lastReadTimestamp ? new Date(n.created_at) > new Date(lastReadTimestamp) : true;
                          return (
                            <div key={n.id} className={cn(
                              "group relative flex items-start gap-3 p-3 rounded-xl transition-all bg-card/40 hover:bg-card/60 backdrop-blur-sm border",
                              isUnread ? "border-primary/30 ring-1 ring-primary/20" : "border-white/10"
                              )}>
                              <div className="w-8 h-8 rounded-full bg-primary/15 flex-shrink-0 flex items-center justify-center mt-1">
                                  <Bell className="h-4 w-4 text-primary"/>
                              </div>
                              <div className="flex-1">
                                  <p className="font-semibold text-sm">{n.title}</p>
                                  <p className="text-sm text-muted-foreground">{n.body}</p>
                                  <p className="text-xs text-muted-foreground/70 mt-1">
                                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                  </p>
                              </div>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 absolute top-2 right-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleDismissNotification(n.id)}
                              >
                                  <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                         })
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No notifications yet.</p>
                      )}
                  </div>
              </PopoverContent>
          </Popover>
         </div>

         {/* Mobile: fullscreen dialog */}
         <div className="md:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="overflow-hidden rounded-full relative">
                  <div className="relative">
                    <Bell className="h-5 w-5" />
                    {hasNewNotification && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                      </span>
                    )}
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 w-screen h-[100dvh] max-w-none bg-background/80 backdrop-blur-md flex flex-col border-l border-white/10">
                <DialogHeader className="p-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                  <DialogTitle>Notifications</DialogTitle>
                  <DialogDescription className="sr-only">Your recent alerts</DialogDescription>
                </DialogHeader>
                <div className="px-2 py-1 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleMarkAllAsRead} 
                    disabled={!hasNewNotification || isMarkingAsRead}
                    className="h-7 px-2.5 text-[11px] text-muted-foreground hover:text-primary"
                  >
                    {isMarkingAsRead ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CheckCheck className="h-3 w-3 mr-1" />}
                    Mark all as read
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {isLoadingNotifications ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map(n => {
                      const isUnread = lastReadTimestamp ? new Date(n.created_at) > new Date(lastReadTimestamp) : true;
                      return (
                        <div key={n.id} className={cn(
                          "group relative flex items-start gap-3 p-3 rounded-xl transition-all bg-card/40 hover:bg-card/60 backdrop-blur-sm border",
                          isUnread ? "border-primary/30 ring-1 ring-primary/20" : "border-white/10"
                        )}>
                          <div className="w-8 h-8 rounded-full bg-primary/15 flex-shrink-0 flex items-center justify-center mt-1">
                            <Bell className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{n.title}</p>
                            <p className="text-sm text-muted-foreground">{n.body}</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                              {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 absolute top-2 right-2 text-muted-foreground"
                            onClick={() => handleDismissNotification(n.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No notifications yet.</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
         </div>

        <UserMenuSheet user={user} profile={profile} />
      </div>
      </div>
    </header>
  );
}
