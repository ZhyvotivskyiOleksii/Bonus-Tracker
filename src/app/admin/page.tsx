import { getAdmins } from "@/lib/actions/settings-actions";
import { AdminManagement } from "../settings/components/AdminManagement";
import { SessionProvider } from "@/hooks/use-session";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ShieldCheck } from "lucide-react";

export default async function AdminPage() {
  const admins = await getAdmins();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Admin"
        description="Manage administrator roles for the application."
        icon={<ShieldCheck className="h-4 w-4 text-primary" />}
        className="sticky-under-header"
      />

      <SessionProvider>
        <AdminManagement initialAdmins={admins} />
      </SessionProvider>
    </div>
  );
}
