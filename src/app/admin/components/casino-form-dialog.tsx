'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import type { Casino } from '@/lib/types';
import { saveCasino } from '@/lib/actions/casino-actions';
import { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required' }),
  casino_url: z.string().url({ message: 'Must be a valid URL' }).optional().or(z.literal('')),
  logo_url: z.string().optional(),
  daily_sc: z.coerce.number().min(0).optional(),
  daily_gc: z.coerce.number().min(0).optional(),
  welcome_sc: z.coerce.number().min(0).optional(),
  welcome_gc: z.coerce.number().min(0).optional(),
});

type CasinoFormValues = z.infer<typeof formSchema>;

interface CasinoFormDialogProps {
  casino?: Casino;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function CasinoFormDialog({ casino, children, onOpenChange }: CasinoFormDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(casino?.logo_url ?? null);

  const defaultFormValues = useMemo(() => ({
    id: casino?.id || undefined,
    name: casino?.name || '',
    casino_url: casino?.casino_url || '',
    logo_url: casino?.logo_url || '',
    daily_sc: casino?.daily_sc ?? 0,
    daily_gc: casino?.daily_gc ?? 0,
    welcome_sc: casino?.welcome_sc ?? 0,
    welcome_gc: casino?.welcome_gc ?? 0,
  }), [casino]);

  const form = useForm<CasinoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const handleReset = () => {
    form.reset(defaultFormValues);
    setLogoFile(null);
    setPreviewUrl(casino?.logo_url ?? null);
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
    // Always sync form values with the latest casino data whenever dialog toggles
    // This prevents showing stale data after duplicating/renaming rows.
    handleReset();
  }

  // If the selected casino changes while dialog is open, keep the form in sync
  useEffect(() => {
    if (open) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultFormValues]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setPreviewUrl(null);
    form.setValue('logo_url', '');
  }


  const onSubmit = async (values: CasinoFormValues) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    const finalValues = {...values};
    if (!previewUrl) {
      finalValues.logo_url = '';
    }

    Object.entries(finalValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    if (logoFile) {
        formData.append('logo', logoFile);
    }
    
    const result = await saveCasino(formData);

    if (result.success) {
      toast({
        title: 'Success',
        description: `Casino ${casino ? 'updated' : 'created'} successfully.`,
      });
      handleOpenChange(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || `Failed to ${casino ? 'update' : 'create'} casino.`,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle>{casino ? 'Edit Casino' : 'Add New Casino'}</DialogTitle>
          <DialogDescription>
            {casino ? 'Update the details of the casino.' : 'Fill in the details to add a new casino.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Stake.us" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="casino_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Casino URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://stake.us" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormItem>
                <FormLabel>Logo</FormLabel>
                <FormControl>
                    <div className="w-full">
                        <Input id="logo-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        {previewUrl ? (
                            <div className="relative group w-48 h-24">
                                <Image src={previewUrl} alt="Logo Preview" fill className="object-contain rounded-md bg-muted p-1" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                    <Button type="button" variant="destructive" size="icon" onClick={removeLogo}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <label htmlFor="logo-upload" className={cn(
                                        "ml-2",
                                        buttonVariants({ variant: "outline", size: "icon" }),
                                        "cursor-pointer"
                                    )}>
                                       <UploadCloud className="h-4 w-4" />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label 
                                htmlFor="logo-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/50"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">Any image format (will be converted to PNG)</p>
                                </div>
                            </label>
                        )}
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <FormField
                control={form.control}
                name="daily_sc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily SC</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="daily_gc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily GC</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="welcome_sc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Welcome SC</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="welcome_gc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Welcome GC</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {casino ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
