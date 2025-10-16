'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash, ShieldOff, ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteUser, blockUser, unblockUser } from '@/lib/actions/user-actions';
import type { UserData } from '@/lib/actions/user-actions';
import { useSession } from '@/hooks/use-session';
import { cn } from '@/lib/utils';

interface UserActionsProps {
  user: UserData;
}

export function UserActions({ user }: UserActionsProps) {
  const { toast } = useToast();
  const { session } = useSession();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isCurrentUser = session?.user?.id === user.id;

  const handleDelete = async () => {
    setIsProcessing(true);
    const result = await deleteUser(user.id);
    if (result.success) {
      toast({ title: 'User Deleted', description: `${user.email} has been deleted.` });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsProcessing(false);
    setIsDeleteDialogOpen(false);
  };

  const handleBlock = async () => {
    setIsProcessing(true);
    const result = await blockUser(user.id);
    if (result.success) {
      toast({ title: 'User Blocked', description: `${user.email} has been blocked.` });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsProcessing(false);
    setIsBlockDialogOpen(false);
  };
  
  const handleUnblock = async () => {
    setIsProcessing(true);
    const result = await unblockUser(user.id);
    if (result.success) {
      toast({ title: 'User Unblocked', description: `${user.email} has been unblocked.` });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsProcessing(false);
    setIsUnblockDialogOpen(false);
  };

  if (isCurrentUser) {
    return null; // Don't show actions for the current user
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {user.is_banned ? (
          <AlertDialog open={isUnblockDialogOpen} onOpenChange={setIsUnblockDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600 hover:bg-green-500/10">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Unblock
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to unblock this user?</AlertDialogTitle>
                <AlertDialogDescription>
                  Unblocking <strong>{user.email}</strong> will allow them to log in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                <Button variant="default" onClick={handleUnblock} disabled={isProcessing}>
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Unblock User
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
            <AlertDialogTrigger asChild>
               <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10">
                <ShieldOff className="mr-2 h-4 w-4" />
                Block
              </Button>
            </AlertDialogTrigger>
             <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to block this user?</AlertDialogTitle>
                <AlertDialogDescription>
                  Blocking <strong>{user.email}</strong> will prevent them from logging in. They will not be deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                 <Button variant="destructive" onClick={handleBlock} disabled={isProcessing}>
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Block User
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete <strong>{user.email}</strong> and all of their associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                <Button variant="destructive" onClick={handleDelete} disabled={isProcessing}>
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete User
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
