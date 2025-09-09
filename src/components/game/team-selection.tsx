'use client';

import type { Player, Quest } from '@/lib/types';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { User } from 'lucide-react';

interface TeamSelectionProps {
  players: Player[];
  leader: Player;
  quest: Quest;
}

export default function TeamSelection({ players, leader, quest }: TeamSelectionProps) {
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);

  const handleSelectPlayer = (playerId: string) => {
    setSelectedTeam(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : prev.length < quest.requiredPlayers
        ? [...prev, playerId]
        : prev
    );
  };

  const isLeader = true; // In real app, this would be based on currentUser
  const canSubmit = selectedTeam.length === quest.requiredPlayers;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Quest {quest.questNumber}: Team Selection</CardTitle>
        <CardDescription>
          {isLeader
            ? `You are the leader. Select ${quest.requiredPlayers} players for the quest.`
            : `Waiting for ${leader.username} (Leader) to select a team of ${quest.requiredPlayers}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {players.map(player => (
            <div
              key={player.id}
              className={cn(
                "relative text-center p-2 rounded-lg border-2 transition-all cursor-pointer",
                selectedTeam.includes(player.id)
                  ? 'border-accent scale-105 shadow-lg shadow-accent/20'
                  : 'border-transparent hover:border-muted',
                isLeader ? 'cursor-pointer' : 'cursor-default'
              )}
              onClick={() => isLeader && handleSelectPlayer(player.id)}
            >
              <Avatar className="w-20 h-20 mx-auto mb-2 border-4 border-secondary">
                 <Image src={`https://picsum.photos/seed/${player.username}/80/80`} width={80} height={80} alt={player.username} data-ai-hint="fantasy portrait" />
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
              <p className="font-semibold">{player.username}</p>
              {leader.id === player.id && <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full absolute top-1 right-1">Leader</span>}
            </div>
          ))}
        </div>
        {isLeader && (
          <Button className="w-full" disabled={!canSubmit}>
            Propose Team ({selectedTeam.length}/{quest.requiredPlayers})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
