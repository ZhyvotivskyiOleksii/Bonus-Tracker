import { getUsersData } from "@/lib/actions/user-actions";
import { EmailTable } from "./components/EmailTable";

export default async function AdminEmailsPage() {
  const users = await getUsersData();
  const emails = users.map(u => ({ email: u.email || 'No email' })).sort((a, b) => a.email.localeCompare(b.email));

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Emails</h1>
        <p className="text-muted-foreground">
          List of all registered user emails.
        </p>
      </div>
      <EmailTable emails={emails} />
    </div>
  )
}
