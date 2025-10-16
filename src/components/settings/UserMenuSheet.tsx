
'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Casino, Profile } from '@/lib/types';
import { useState, useEffect, useMemo } from 'react';
import { BarChart, Copy, Loader2, LogOut, ShieldCheck, Bell, LinkIcon, Check, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import _ from 'lodash';
import { updateUserCasinoRegistrations } from '@/lib/actions/user-actions';
import { Switch } from '@/components/ui/switch';
import { useFcm } from '@/hooks/use-fcm';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';


export function UserMenuSheet({ user, profile }: { user: User, profile: Profile | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [casinos, setCasinos] = useState<Casino[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = profile?.role === 'site_manager_privilege';

  const [isSaving, setIsSaving] = useState(false);
  
  // State for casino selection
  const [selectedCasinos, setSelectedCasinos] = useState<Set<string>>(new Set());
  const [initialSelectedCasinos, setInitialSelectedCasinos] = useState<Set<string>>(new Set());

  // State for copy button
  const [isCopied, setIsCopied] = useState(false);

  // FCM / Notifications
  const { fcmToken, notificationPermission, getAndSaveToken, disableNotifications, isSupportedBrowser } = useFcm();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isTogglingNotifications, setIsTogglingNotifications] = useState(false);
  
  useEffect(() => {
    if (notificationPermission === 'granted' && fcmToken) {
      setNotificationsEnabled(true);
    } else {
      setNotificationsEnabled(false);
    }
  }, [notificationPermission, fcmToken]);

  const handleNotificationToggle = async (checked: boolean) => {
    setIsTogglingNotifications(true);
    if (checked) {
      await getAndSaveToken();
    } else {
      await disableNotifications();
    }
    setIsTogglingNotifications(false);
  };

  const hasCasinoChanges = useMemo(() => {
    if (isLoading) return false;
    return !_.isEqual(initialSelectedCasinos, selectedCasinos);
  }, [selectedCasinos, initialSelectedCasinos, isLoading]);


  useEffect(() => {
    if (!open) return;

    const supabase = createClient();
    const fetchInitialData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      };

      // Fetch casinos
      const { data: casinoData } = await supabase.from('casinos').select('*').order('name');
      setCasinos(casinoData || []);
      
      // Fetch user's registered casinos
      const { data: userCasinoData } = await supabase.from('user_casinos').select('casino_id');
      const registeredCasinoIds = new Set(userCasinoData?.map(uc => uc.casino_id) || []);
      
      setSelectedCasinos(registeredCasinoIds);
      setInitialSelectedCasinos(new Set(registeredCasinoIds));
      
      setIsLoading(false);
    };
    fetchInitialData();
  }, [open]);
  
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const referralLink = useMemo(() => {
    if (typeof window === 'undefined' || !profile?.short_id) return '';
    return `${window.location.origin}/login?ref=${profile.short_id}`;
  }, [profile?.short_id]);

  const copyReferralLink = () => {
    if (referralLink) {
        navigator.clipboard.writeText(referralLink);
        toast({
            title: "Copied!",
            description: "Your referral link has been copied to the clipboard.",
        });
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }
  }

  const getInitials = (email: string | undefined) => {
    if (!email) return 'U';
    return email.split('@')[0].substring(0, 2).toUpperCase();
  }

  const handleCheckboxChange = (casinoId: string, checked: boolean) => {
    setSelectedCasinos(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(casinoId);
      } else {
        newSet.delete(casinoId);
      }
      return newSet;
    });
  };

  const handleSaveSettings = async () => {
    if (!hasCasinoChanges) return;
    
    setIsSaving(true);
    
    const result = await updateUserCasinoRegistrations(Array.from(selectedCasinos));
    if (result.success) {
      setInitialSelectedCasinos(new Set(selectedCasinos));
      toast({ title: "Success", description: "Your settings have been saved." });
      setOpen(false); // Close sheet on successful save
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to update your casino list.' });
      // Revert selection on error
      setSelectedCasinos(initialSelectedCasinos);
    }
    
    setIsSaving(false);
  };
  
  return (
     <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="overflow-hidden rounded-full">
            <Avatar>
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name ?? 'User avatar'} />
            <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
            </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-sm w-full bg-card flex flex-col p-0">
        <SheetHeader className="p-6 pb-4">
          <VisuallyHidden>
            <SheetTitle>User Menu</SheetTitle>
          </VisuallyHidden>
            <div className="flex flex-col items-center text-center">
                 <Avatar className="h-16 w-16 mb-3">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name ?? 'User avatar'} />
                    <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-lg">{user?.email ?? 'My Account'}</p>
                {profile?.short_id && (
                     <div 
                        className="flex items-center gap-1.5 text-sm text-muted-foreground"
                        title="Your unique referral ID"
                    >
                        <span>ID: {profile.short_id}</span>
                    </div>
                )}
            </div>
        </SheetHeader>
        <Separator />
        
        {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <div className='flex-1 space-y-4 overflow-y-auto p-4 no-scrollbar'>
                {referralLink && (
                  <Card className="bg-background/50">
                    <CardContent className="p-4 space-y-2">
                       <Label htmlFor="referral-link" className="flex items-center gap-2 text-base font-semibold">
                          <LinkIcon className="h-4 w-4" />
                          Your Referral Link
                       </Label>
                       <div className="flex items-center gap-2">
                          <Input id="referral-link" value={referralLink} readOnly className="bg-muted text-muted-foreground" />
                           <Button variant="outline" size="icon" onClick={copyReferralLink}>
                              {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                           </Button>
                       </div>
                    </CardContent>
                  </Card>
                )}

                {isAdmin && (
                    <div className="space-y-2">
                        <Label className="px-2 text-xs text-muted-foreground">Admin Tools</Label>
                        <Button asChild variant="outline" className="justify-start w-full">
                            <Link href="/admin">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </Button>
                         <Button asChild variant="outline" className="justify-start w-full">
                            <Link href="/analytics">
                                <BarChart className="mr-2 h-4 w-4" />
                                Analytics
                            </Link>
                        </Button>
                    </div>
                )}

                 <Accordion type="multiple" className="w-full space-y-4">
                    <AccordionItem value="item-1" className="border-none">
                       <Card className="bg-background/50 overflow-hidden">
                         <AccordionTrigger className="p-4 hover:no-underline">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-left">My Casinos</p>
                                    <p className="text-xs text-muted-foreground text-left">Select your registered casinos.</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                             <div className="space-y-2 overflow-y-auto p-1 max-h-[30vh] no-scrollbar">
                                {casinos.map(casino => (
                                    <Label 
                                    key={casino.id}
                                    htmlFor={`sheet-casino-${casino.id}`}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                    <Checkbox 
                                        id={`sheet-casino-${casino.id}`} 
                                        checked={selectedCasinos.has(casino.id)}
                                        onCheckedChange={(checked) => handleCheckboxChange(casino.id, !!checked)}
                                    />
                                    <span className="font-medium">{casino.name}</span>
                                    </Label>
                                ))}
                            </div>
                        </AccordionContent>
                       </Card>
                    </AccordionItem>
                     {isSupportedBrowser && (
                      <AccordionItem value="item-2" className="border-none">
                         <Card className="bg-background/50 overflow-hidden">
                           <div className="p-4">
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                      <div className="p-2 bg-primary/10 rounded-md">
                                          <Bell className="h-5 w-5 text-primary" />
                                      </div>
                                      <div>
                                          <p className="text-base font-semibold text-left">Push Notifications</p>
                                          <p className="text-xs text-muted-foreground text-left">Enable or disable bonus alerts.</p>
                                      </div>
                                  </div>
                                  <Switch
                                    checked={notificationsEnabled}
                                    onCheckedChange={handleNotificationToggle}
                                    disabled={isTogglingNotifications || notificationPermission === 'denied'}
                                    aria-label="Toggle push notifications"
                                  />
                              </div>
                              {notificationPermission === 'denied' && (
                                <p className="text-xs text-destructive mt-2 text-center">You have blocked notifications. To enable them, you need to change your browser settings.</p>
                              )}
                           </div>
                         </Card>
                      </AccordionItem>
                    )}
                </Accordion>
            </div>
        )}

        <div className="p-4 border-t border-border mt-auto grid grid-cols-2 gap-2">
            <Button 
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Button 
                onClick={handleSaveSettings} 
                disabled={isSaving || isLoading || !hasCasinoChanges}
            >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Settings
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

    



    