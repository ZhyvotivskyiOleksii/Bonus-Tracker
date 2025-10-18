import { getUsersData } from "@/lib/actions/user-actions";
import { EmailTable } from "./components/EmailTable";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Mails } from "lucide-react";

export default async function AdminEmailsPage() {
  const users = await getUsersData();
  const emails = users.map(u => ({ email: u.email || 'No email' })).sort((a, b) => a.email.localeCompare(b.email));

  return (
    <div className="w-full space-y-6">
      <SectionHeader
        title="Emails"
        description="List of all registered user emails."
        icon={<Mails className="h-4 w-4 text-primary" />}
        className="sticky-under-header"
      />
      <EmailTable emails={emails} />
    </div>
  )
}
