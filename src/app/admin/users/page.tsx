
import { getUsersData } from "@/lib/actions/user-actions";
import { UserTable } from "./components/UserTable";

export default async function AdminUsersPage() {
  const users = await getUsersData();

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-muted-foreground">
          Manage administrator roles for the application.
        </p>
      </div>
      <UserTable users={users || []} />
    </div>
  )
}
