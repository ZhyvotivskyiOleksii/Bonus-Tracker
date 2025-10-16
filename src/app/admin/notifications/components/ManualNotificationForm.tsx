'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendPushNotification } from '@/lib/actions/notification-actions';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';


const notificationSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(50, { message: 'Title is too long' }),
  body: z.string().min(1, { message: 'Body is required' }).max(150, { message: 'Body is too long' }),
  sendTo: z.enum(['all', 'specific']),
  userId: z.string().optional(),
}).refine(data => {
    if (data.sendTo === 'specific') {
        return !!data.userId;
    }
    return true;
}, {
    message: 'Please select a user.',
    path: ['userId'],
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

interface ManualNotificationFormProps {
    users: { id: string, email: string }[];
}

export function ManualNotificationForm({ users }: ManualNotificationFormProps) {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      body: '',
      sendTo: 'all',
      userId: undefined,
    },
  });

  const watchSendTo = form.watch('sendTo');

  const onSubmit = async (values: NotificationFormValues) => {
    setIsSending(true);
    const result = await sendPushNotification(
        values.title, 
        values.body, 
        values.sendTo === 'specific' ? values.userId : undefined
    );
    setIsSending(false);

    if (result.success) {
      toast({
        title: 'Notification Sent!',
        description: `Your message was sent to ${result.sentCount || 0} user(s).`,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to send notification.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="sendTo"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Recipient</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="all" />
                    </FormControl>
                    <FormLabel className="font-normal">All Users</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="specific" />
                    </FormControl>
                    <FormLabel className="font-normal">Specific User</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchSendTo === 'specific' && (
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>User</FormLabel>
                 <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                            )}
                        >
                            {field.value
                            ? users.find(
                                (user) => user.id === field.value
                            )?.email
                            : "Select user..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Search user by email..." />
                            <CommandEmpty>No user found.</CommandEmpty>
                            <CommandGroup>
                            <ScrollArea className="h-48">
                            {users.map((user) => (
                                <CommandItem
                                value={user.email}
                                key={user.id}
                                onSelect={() => {
                                    form.setValue("userId", user.id)
                                    setPopoverOpen(false)
                                }}
                                >
                                <Check
                                    className={cn(
                                    "mr-2 h-4 w-4",
                                    user.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                />
                                {user.email}
                                </CommandItem>
                            ))}
                            </ScrollArea>
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Your Daily Bonuses Are Ready!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Click here to collect your bonuses now."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSending}>
          {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Notification
        </Button>
      </form>
    </Form>
  );
}
