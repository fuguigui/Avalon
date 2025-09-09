
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ROLES } from '@/lib/constants';
import type { Role } from '@/lib/types';
import { createGame } from '@/app/actions';
import { useTransition, useMemo, useEffect } from 'react';
import { Loader2, Shield, Swords } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


const allRoles = Object.values(ROLES).filter(role => role.name !== 'Loyal Servant of Arthur' && role.name !== 'Minion of Mordred');
const defaultRoles = ['Merlin', 'Percival', 'Morgana'];
const optionalRoles = allRoles.filter(role => !defaultRoles.includes(role.name));

const evilRoles = optionalRoles.filter(r => r.alignment === 'evil');
const goodRoles = optionalRoles.filter(r => r.alignment === 'good');

const evilRolesSorted = [
  evilRoles.find(r => r.name === 'Mordred'),
  evilRoles.find(r => r.name === 'Assassin'),
  evilRoles.find(r => r.name === 'Oberon'),
].filter(Boolean) as Role[];


const sortedOptionalRoles = [...goodRoles, ...evilRolesSorted];


const FormSchema = z.object({
  playerCount: z.number().min(6).max(10),
  aiCount: z.number().min(0).max(10),
  roles: z.array(z.string()),
  minionCount: z.number().min(0).max(4),
  gameId: z.string().max(20).optional(),
  chatEnabled: z.boolean(),
}).refine(data => (data.aiCount ?? 0) <= data.playerCount, {
  message: "AI count cannot be greater than player count.",
  path: ["aiCount"],
});

export function CreateGameForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      playerCount: 6,
      aiCount: 0,
      roles: [], // Optional roles start empty
      minionCount: 1,
      gameId: '',
      chatEnabled: true,
    },
  });

  const playerCount = form.watch('playerCount');
  const aiCount = form.watch('aiCount') || 0;
  const selectedRoles = form.watch('roles');
  const minionCount = form.watch('minionCount');

  // Total roles now includes the 3 default roles
  const loyalServantCount = playerCount - defaultRoles.length - selectedRoles.length - minionCount;

  const finalRolesForCount = useMemo(() => {
    return [
      ...defaultRoles,
      ...selectedRoles,
      ...Array(minionCount).fill('Minion of Mordred'),
      ...Array(loyalServantCount).fill('Loyal Servant of Arthur')
    ]
  }, [selectedRoles, minionCount, loyalServantCount]);

  const { goodRolesCount, evilRolesCount } = useMemo(() => {
    return finalRolesForCount.reduce((acc, roleName) => {
      const role = ROLES[roleName as Role['name']];
      if (role) {
        if (role.alignment === 'good') acc.goodRolesCount++;
        else acc.evilRolesCount++;
      }
      return acc;
    }, { goodRolesCount: 0, evilRolesCount: 0 });
  }, [finalRolesForCount]);

  // Total selected roles include the 3 default ones
  const canSelectMoreRoles = (defaultRoles.length + selectedRoles.length + minionCount) < playerCount;

  useEffect(() => {
    form.trigger('roles');
  }, [playerCount, form]);

  useEffect(() => {
    if (aiCount > 0) {
      form.setValue('chatEnabled', true);
    }
  }, [aiCount, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Manually add the default roles to the submission data
    const submissionData = {
      ...data,
      roles: [...defaultRoles, ...data.roles],
      gameId: data.gameId === '' ? undefined : data.gameId
    }
    startTransition(async () => {
      const result = await createGame(submissionData);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error Creating Game",
          description: result.error,
        })
      }
      if (result?.redirect) {
        router.push(result.redirect);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="playerCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player Count: {field.value}</FormLabel>
              <FormControl>
                <Controller
                  name="playerCount"
                  control={form.control}
                  render={({ field }) => (
                    <Slider
                      min={6}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => {
                        field.onChange(vals[0]);
                        if ((form.getValues('aiCount') || 0) > vals[0]) {
                          form.setValue('aiCount', vals[0]);
                        }
                        const currentRoles = form.getValues('roles');
                        const currentMinions = form.getValues('minionCount');
                        if (defaultRoles.length + currentRoles.length + currentMinions > vals[0]) {
                          form.setValue('roles', []);
                          form.setValue('minionCount', 0);
                        }
                      }}
                    />
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aiCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Count</FormLabel>
              <FormControl>
                <Input type="number" min="0" max={playerCount} {...field}
                  onChange={e => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : value);
                  }} />
              </FormControl>
              <FormDescription>
                {playerCount - aiCount} human players needed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roles"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Roles</FormLabel>
                <FormDescription>
                  Select special roles. Loyal Servants, Merlin, Percival, and Morgana are included automatically.
                </FormDescription>
              </div>

              {/* Default Roles */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-3 border rounded-md bg-secondary/30">
                {defaultRoles.map(roleName => {
                  const role = ROLES[roleName as Role['name']];
                  return (
                    <div key={role.name} className="flex flex-row items-start space-x-3 space-y-0">
                      <Checkbox checked={true} disabled />
                      <FormLabel className="font-normal flex items-center gap-2">
                        {role.alignment === 'good' ? <Shield className="h-4 w-4 text-blue-400" /> : <Swords className="h-4 w-4 text-red-400" />}
                        {role.name}
                      </FormLabel>
                    </div>
                  );
                })}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-row items-start space-x-3 space-y-0">
                  <Checkbox checked={loyalServantCount > 0} disabled />
                  <FormLabel className="font-normal flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                    Loyal Servant of Arthur {loyalServantCount > 0 ? `(${loyalServantCount})` : ''}
                  </FormLabel>
                </div>

                {sortedOptionalRoles.map((role) => (
                  <FormField
                    key={role.name}
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                      <FormItem
                        key={role.name}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(role.name)}
                            disabled={!canSelectMoreRoles && !field.value?.includes(role.name)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, role.name])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== role.name
                                  )
                                );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center gap-2">
                          {role.alignment === 'good' ? <Shield className="h-4 w-4 text-blue-400" /> : <Swords className="h-4 w-4 text-red-400" />}
                          {role.name}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}

                <div className="flex flex-row items-center space-x-3 space-y-0">
                   <Checkbox
                      checked={minionCount > 0}
                      onCheckedChange={(checked) => {
                        form.setValue('minionCount', checked ? 1 : 0)
                      }}
                      disabled={!canSelectMoreRoles && minionCount === 0}
                    />
                  <FormLabel className="font-normal flex items-center gap-2">
                    <Swords className="h-4 w-4 text-red-400" />
                    Minion of Mordred
                  </FormLabel>
                  {minionCount > 0 && (
                    <FormField
                      control={form.control}
                      name="minionCount"
                      render={({ field }) => (
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            max={playerCount - defaultRoles.length - selectedRoles.length}
                            className="h-7 w-14" 
                            {...field}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (!isNaN(value) && (defaultRoles.length + selectedRoles.length + value) <= playerCount) {
                                  field.onChange(value);
                                } else if (e.target.value === '') {
                                  field.onChange(0);
                                }
                              }}
                            />
                        </FormControl>
                      )}
                    />
                  )}
                </div>
              </div>

              <FormMessage />
              <div className={`mt-2 text-sm flex justify-end p-2 rounded-md`}>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><Shield className="h-4 w-4" /> Good: {goodRolesCount}</span>
                  <span className="flex items-center gap-1"><Swords className="h-4 w-4" /> Evil: {evilRolesCount}</span>
                </div>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="gameId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Game ID (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="ANY_ID" {...field} maxLength={20} />
              </FormControl>
              <FormDescription>
                Max 20 characters. Leave blank for a random 6-character ID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chatEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Enable Chat</FormLabel>
                <FormDescription>
                  In-game chat for players. Required if AI players are present.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={aiCount > 0}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Game
        </Button>
      </form>
    </Form>
  );
}
