
import { ManualNotificationForm } from "./components/ManualNotificationForm";
import { getUsersData } from "@/lib/actions/user-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Bell } from "lucide-react";

export const runtime = 'nodejs';

export default async function NotificationsPage() {
  const users = await getUsersData();
  const userList = users.map(u => ({ id: u.id, email: u.email || '' }));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Notifications"
        description="Send a one-time message to all or specific users."
        icon={<Bell className="h-4 w-4 text-primary" />}
        className="sticky-under-header"
      />
       <Card>
        <CardHeader>
          <CardTitle>Compose Manual Message</CardTitle>
          <CardDescription>Send a one-time message to all or specific users.</CardDescription>
        </CardHeader>
        <CardContent>
          <ManualNotificationForm users={userList} />
        </CardContent>
      </Card>
    </div>
  );
}
