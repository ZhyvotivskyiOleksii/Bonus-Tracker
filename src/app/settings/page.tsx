import { getAdmins } from "@/lib/actions/settings-actions";
import { AdminManagement } from "./components/AdminManagement";
import { SessionProvider } from "@/hooks/use-session";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { columns } from "../admin/components/columns";
import { DataTable } from "../admin/components/data-table";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: casinos, error } = await supabase
    .from('casinos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching casinos:", error);
    // Handle error appropriately
    return <div>Error loading casino data.</div>;
  }

  return (
    <div className="w-full space-y-6">
       <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage casino offers and application settings.
        </p>
      </div>
       <DataTable columns={columns} data={casinos || []} />
    </div>
  )
}
