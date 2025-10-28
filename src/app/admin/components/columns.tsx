"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Casino } from "@/lib/types"
import { ArrowUpDown, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getLogoScaleFromUrl } from "@/lib/utils"
import { CasinoActions } from "./casino-actions"

const formatCoins = (amount: number | null) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat('en-US').format(amount);
};

const formatSC = (amount: number | null) => {
  if (amount === null || amount === undefined) return "N/A";
  // check if it's a whole number
  if (amount % 1 === 0) {
    return amount.toFixed(0);
  }
  return amount.toFixed(2);
}

export const columns: ColumnDef<Casino>[] = [
  {
    accessorKey: "logo_url",
    header: () => <div className="font-semibold">Logo</div>,
    cell: ({ row }) => {
        const casino = row.original;
        return (
            <div className="w-24 h-12 flex items-center justify-center bg-muted rounded-md p-1 min-w-[6rem]">
              {casino.logo_url ? (() => { const s = getLogoScaleFromUrl(casino.logo_url); return (
                  <Image src={casino.logo_url} alt={casino.name} width={Math.round(80 * s)} height={Math.round(40 * s)} className="object-contain" />
              ) })() : (
                <div className="text-xs text-muted-foreground">No Logo</div>
              )}
            </div>
        )
    }
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0 font-semibold"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-semibold whitespace-nowrap">{row.original.name}</div>
  },
  {
    accessorKey: "daily_sc",
    header: () => <div className="font-semibold">Daily Bonus</div>,
    cell: ({ row }) => {
        const casino = row.original;
        return <div className="whitespace-nowrap font-semibold">{formatSC(casino.daily_sc)} SC + {formatCoins(casino.daily_gc)} GC</div>
    }
  },
  {
    accessorKey: "welcome_sc",
    header: () => <div className="font-semibold">Welcome Bonus</div>,
    cell: ({ row }) => {
        const casino = row.original;
        return <div className="whitespace-nowrap font-semibold">{formatSC(casino.welcome_sc)} SC + {formatCoins(casino.welcome_gc)} GC</div>
    }
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">Actions</div>,
    cell: ({ row }) => {
      const casino = row.original
      return <div className="flex justify-center w-[120px]"><CasinoActions casino={casino} /></div>
    },
  },
]
