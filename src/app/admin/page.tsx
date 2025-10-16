import { getAdmins } from "@/lib/actions/settings-actions";
import { AdminManagement } from "../settings/components/AdminManagement";
import { SessionProvider } from "@/hooks/use-session";

export default async function AdminPage() {
  const admins = await getAdmins();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-muted-foreground">
          Manage administrator roles for the application.
        </p>
      </div>

      <SessionProvider>
        <AdminManagement initialAdmins={admins} />
      </SessionProvider>
    </div>
  );
}
