
import { ManualNotificationForm } from "./components/ManualNotificationForm";
import { getUsersData } from "@/lib/actions/user-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const runtime = 'nodejs';

export default async function NotificationsPage() {
  const users = await getUsersData();
  const userList = users.map(u => ({ id: u.id, email: u.email || '' }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          Send a one-time message to all or specific users.
        </p>
      </div>
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
