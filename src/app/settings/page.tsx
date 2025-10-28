import { getAdmins } from "@/lib/actions/settings-actions";
import { AdminManagement } from "./components/AdminManagement";
import { SessionProvider } from "@/hooks/use-session";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { columns } from "../admin/components/columns";
import { DataTable } from "../admin/components/data-table";
import { CasinosMobile } from "./components/CasinosMobile";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Settings as SettingsIcon } from "lucide-react";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: casinos, error } = await supabase
    .from('casinos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching casinos:", error);
    // Handle error appropriately
    return <div>Error loading sweeps casino data.</div>;
  }

  return (
    <div className="w-full space-y-6">
       <SectionHeader
         title="Settings"
         description="Manage sweeps casino offers and application settings."
         icon={<SettingsIcon className="h-4 w-4 text-primary" />}
         className="sticky-under-header"
       />
       <div className="md:hidden overflow-x-hidden">
         <CasinosMobile casinos={casinos || []} />
       </div>
       <div className="hidden md:block">
         <DataTable columns={columns} data={casinos || []} />
       </div>
    </div>
  )
}
export const dynamic = 'force-dynamic';
export const revalidate = 0;
