
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { grantAdminRights, revokeAdminRights } from "@/lib/actions/settings-actions";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/use-session";

const addAdminSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

type AdminUser = {
  id: string;
  email: string | undefined;
};

interface AdminManagementProps {
  initialAdmins: AdminUser[];
}

export function AdminManagement({ initialAdmins }: AdminManagementProps) {
  const { toast } = useToast();
  const { session } = useSession();
  const [admins, setAdmins] = useState(initialAdmins);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  
  const form = useForm({
    resolver: zodResolver(addAdminSchema),
    defaultValues: { email: "" },
  });

  const { isSubmitting } = useFormState({ control: form.control });

  const onSubmit = async (values: z.infer<typeof addAdminSchema>) => {
    if (values.email.toLowerCase() === session?.user?.email?.toLowerCase()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You cannot grant admin rights to yourself again.",
      });
      return;
    }
    
    const result = await grantAdminRights(values.email);
    if (result.success && result.user) {
      toast({
        title: "Success",
        description: `${values.email} has been granted admin rights.`,
      });
      if (!admins.some(admin => admin.id === result.user!.id)) {
        setAdmins((prev) => [...prev, { id: result.user!.id, email: result.user!.email }]);
      }
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  };

  const handleRevoke = async (userId: string, email?: string) => {
    setIsRevoking(userId);
    const result = await revokeAdminRights(userId);
    if (result.success) {
      toast({
        title: "Success",
        description: `Admin rights for ${email} have been revoked.`,
      });
      setAdmins((prev) => prev.filter((admin) => admin.id !== userId));
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
    setIsRevoking(null);
  };
  
  const getInitials = (email: string | undefined) => {
    if (!email) return '??';
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 overflow-x-hidden">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            Grant Admin Rights
          </CardTitle>
          <CardDescription>Enter the email of the user to grant admin privileges.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Grant
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            Current Administrators
          </CardTitle>
          <CardDescription>List of users with admin privileges.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {admins.length > 0 ? (
              admins.map((admin) => {
                const isCurrentUser = admin.id === session?.user?.id;
                return (
                  <div key={admin.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                          <AvatarFallback>{getInitials(admin.email)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{admin.email}</span>
                        {isCurrentUser && <Badge variant="success">You</Badge>}
                      </div>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" disabled={isRevoking === admin.id || isCurrentUser}>
                            {isRevoking === admin.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                         </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will revoke admin privileges for {admin.email}. They will no longer be able to access the admin panel or settings.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => handleRevoke(admin.id, admin.email)}
                          >
                            Revoke
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )
              })
            ) : (
              <p className="text-center text-muted-foreground py-4">No administrators found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
