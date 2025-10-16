'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Casino, UserCasino, CasinoStatus } from "@/lib/types";
import { ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { openInBackground } from "@/lib/utils";

interface MassOpenButtonProps {
    casinos: Casino[];
    userCasinos: UserCasino[];
}

export function MassOpenButton({ casinos, userCasinos }: MassOpenButtonProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleMassOpen = async () => {
        setIsLoading(true);

        const eligible = casinos
            .filter(c => {
                const userCasino = userCasinos.find(uc => uc.casino_id === c.id);
                return userCasino?.status === CasinoStatus.Registered && c.casino_url;
            })
        const urlsToOpen = eligible.map(c => c.casino_url as string);

        if (urlsToOpen.length === 0) {
            toast({
                title: "No bonuses to collect",
                description: "You've either collected all bonuses or need to register at more casinos.",
            });
            setIsLoading(false);
            return;
        }

        toast({
            title: "Opening bonus tabs...",
            description: `Attempting to open ${urlsToOpen.length} tabs. Please enable pop-ups if prompted.`,
        });

        urlsToOpen.forEach((url, index) => {
            setTimeout(() => {
                openInBackground(url);
            }, index * 200); // Stagger opening to avoid aggressive pop-up blocking
        });
        
        // Optimistically mark these as collected today to refresh header stats
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            for (const c of eligible) {
              await supabase
                .from('user_casinos')
                .update({ status: CasinoStatus.CollectedToday, last_collected_at: new Date().toISOString() })
                .eq('user_id', user.id)
                .eq('casino_id', c.id);
            }
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('usercasinos:changed'));
            }
          }
        } catch (e) {
          console.warn('Local mass-update failed (non-fatal):', e);
        }
        
        setTimeout(() => setIsLoading(false), urlsToOpen.length * 200 + 500);
    };

    return (
        <Button onClick={handleMassOpen} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
            )}
            Collect All Bonuses
        </Button>
    );
}
