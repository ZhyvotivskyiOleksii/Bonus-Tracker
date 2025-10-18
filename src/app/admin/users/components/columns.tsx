"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { UserData } from "@/lib/actions/user-actions"
import { ArrowUpDown, Copy, Users, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UserActions } from "./user-actions"
import { cn } from "@/lib/utils"


const CopyButton = ({ value }: { value: string | null }) => {
    const { toast } = useToast();
    const onCopy = () => {
        if (value) {
            navigator.clipboard.writeText(value);
            toast({ title: "Copied!", description: "ID copied to clipboard." });
        }
    }
    if (!value) return null;
    return (
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCopy}>
            <Copy className="h-3 w-3" />
        </Button>
    )
}


export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0 font-semibold"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className={cn("font-semibold whitespace-nowrap", user.is_banned && "text-muted-foreground line-through")}>
          {user.email}
          {user.is_banned && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ShieldOff className="inline-block ml-2 h-4 w-4 text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This user is banned.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "short_id",
    header: () => <div className="font-semibold">Referral ID</div>,
    cell: ({ row }) => (
        <div className="flex items-center gap-1">
            <Badge variant="outline">{row.original.short_id}</Badge>
            <CopyButton value={row.original.short_id} />
        </div>
    )
  },
  {
    accessorKey: "referred_by_email",
    header: () => <div className="font-semibold">Referred By</div>,
    cell: ({ row }) => (
        row.original.referred_by_email ? <Badge variant="secondary">{row.original.referred_by_email}</Badge> : <span className="text-muted-foreground">N/A</span>
    )
  },
  {
    accessorKey: "referrals",
    header: () => <div className="font-semibold">Referrals</div>,
    cell: ({ row }) => {
        const referrals = row.original.referrals;
        if (referrals.length === 0) {
            return <span>0</span>
        }
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-default">
                            <Users className="h-4 w-4 text-primary"/>
                            <span className="font-bold">{referrals.length}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="p-2 space-y-1">
                            <p className="font-bold text-sm mb-2">Referred Users:</p>
                            {referrals.map((r, i) => (
                                <div key={i} className="text-xs">{r.email}</div>
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }
  },
  {
    id: "actions",
    header: () => <div className="font-semibold text-right w-[120px] sm:w-[200px]">Actions</div>,
    cell: ({ row }) => {
      const user = row.original
      return <div className="flex justify-end"><UserActions user={user} /></div>
    },
  },
]
