
import { getUsersData } from "@/lib/actions/user-actions";
import { UserTable } from "./components/UserTable";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Users } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await getUsersData();

  return (
    <div className="w-full space-y-6">
      <SectionHeader
        title="Users"
        description="Manage and search registered users."
        icon={<Users className="h-4 w-4 text-primary" />}
        className="sticky-under-header"
      />
      <UserTable users={users || []} />
    </div>
  )
}
