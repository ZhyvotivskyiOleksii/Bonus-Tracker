"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Casino } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CasinoFormDialog } from "@/app/admin/components/casino-form-dialog";
import { Copy, Loader2, Trash, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { duplicateCasino, deleteCasino } from "@/lib/actions/casino-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function formatCoins(amount: number | null) {
  if (amount === null || amount === undefined) return "0";
  return new Intl.NumberFormat("en-US").format(amount);
}

function formatSC(amount: number | null) {
  if (amount === null || amount === undefined) return "0.00";
  return (amount % 1 === 0 ? amount.toFixed(2) : amount.toFixed(2));
}

export function CasinosMobile({ casinos }: { casinos: Casino[] }) {
  const [query, setQuery] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return casinos;
    return casinos.filter((c) => c.name.toLowerCase().includes(q));
  }, [casinos, query]);

  return (
    <div className="md:hidden space-y-4 overflow-x-hidden">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Filter sweeps casinos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 h-9 text-sm"
        />
        <CasinoFormDialog>
          <Button size="sm" className="flex-shrink-0 h-9 px-3 text-sm">Add</Button>
        </CasinoFormDialog>
      </div>

      <div className="space-y-3 pb-8 overflow-x-hidden">
        {filtered.map((casino) => (
          <Card key={casino.id} className="bg-card/80 border overflow-hidden mx-0">
            <CardContent className="p-3">
              <div className="flex items-center gap-2.5">
                <div className="w-14 h-9 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                  {casino.logo_url ? (
                    <Image
                      src={casino.logo_url}
                      alt={casino.name}
                      width={64}
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">No Logo</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-[15px]">{casino.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {casino.casino_url || "—"}
                  </p>
                </div>
                {/* Inline mobile actions (compact) */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <CasinoFormDialog casino={casino}>
                    <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  </CasinoFormDialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={async () => {
                      const res = await duplicateCasino(casino.id);
                      if (res.success) {
                        toast({ title: "Duplicated", description: `${casino.name} copied.` });
                        router.refresh();
                      } else {
                        toast({ variant: "destructive", title: "Error", description: res.error || "Could not duplicate." });
                      }
                    }}
                    className="h-8 w-8"
                    aria-label="Duplicate"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" className="h-8 w-8" aria-label="Delete">
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {casino.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            const res = await deleteCasino(casino.id, casino.logo_url || undefined);
                            if (res.success) {
                              toast({ title: "Deleted", description: `${casino.name} removed.` });
                              router.refresh();
                            } else {
                              toast({ variant: "destructive", title: "Error", description: res.error || "Could not delete." });
                            }
                          }}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-background/40 p-1.5 border">
                  <p className="text-[11px] text-muted-foreground">Daily Bonus</p>
                  <p className="font-semibold">
                    {formatSC(casino.daily_sc)} SC + {formatCoins(casino.daily_gc)} GC
                  </p>
                </div>
                <div className="rounded-md bg-background/40 p-1.5 border">
                  <p className="text-[11px] text-muted-foreground">Welcome Bonus</p>
                  <p className="font-semibold">
                    {formatSC(casino.welcome_sc)} SC + {formatCoins(casino.welcome_gc)} GC
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No sweeps casinos match your filter.
          </p>
        )}
      </div>
    </div>
  );
}
