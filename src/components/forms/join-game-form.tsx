'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { joinGame } from '@/app/actions';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';

const FormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }).max(20, {
    message: 'Username must not exceed 20 characters.',
  }),
  gameId: z.string().regex(/^[A-Z0-9]+$/, {
    message: 'Game ID must be uppercase letters and numbers only.',
  }),
});

export function JoinGameForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      gameId: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(() => {
      joinGame(data);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Loyal Servant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gameId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game ID</FormLabel>
              <FormControl>
                <Input placeholder="ABC123" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Join Game
        </Button>
      </form>
    </Form>
  );
}
