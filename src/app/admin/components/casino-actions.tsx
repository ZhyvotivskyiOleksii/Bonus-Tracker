
'use client';

import { Button } from '@/components/ui/button';
import { Trash, Loader2, Copy, Pencil } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import { deleteCasino, duplicateCasino } from '@/lib/actions/casino-actions';
import { useToast } from '@/hooks/use-toast';
import type { Casino } from '@/lib/types';
import { CasinoFormDialog } from './casino-form-dialog';
import { useState } from 'react';

export function CasinoActions({ casino }: { casino: Casino }) {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteCasino(casino.id, casino.logo_url);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Casino deleted successfully.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to delete casino.',
      });
    }
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    const result = await duplicateCasino(casino.id);
     if (result.success) {
      toast({
        title: 'Success',
        description: 'Casino duplicated successfully.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to duplicate casino.',
      });
    }
    setIsDuplicating(false);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <CasinoFormDialog casino={casino} onOpenChange={setIsEditDialogOpen}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CasinoFormDialog>
        
        <Button variant="outline" size="icon" onClick={handleDuplicate} disabled={isDuplicating}>
            {isDuplicating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
        </Button>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the casino and its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
