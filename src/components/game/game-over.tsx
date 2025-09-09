import type { Player, Quest } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Shield, Swords } from 'lucide-react';
import { ROLES } from '@/lib/constants';
import Image from 'next/image';
import { User } from 'lucide-react';

interface GameOverProps {
  players: Player[];
  quests: Quest[];
  winner: 'good' | 'evil';
}

export default function GameOver({ players, winner }: GameOverProps) {
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl text-center animate-in fade-in zoom-in-95">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Crown className="w-16 h-16 text-accent" />
          </div>
          <CardTitle className="font-headline text-4xl">
            {winner === 'good' ? 'Good Has Prevailed!' : 'Evil Has Triumphed!'}
          </CardTitle>
          <CardDescription className="text-lg">All roles have been revealed.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {players.map(player => {
              const role = ROLES[player.role || 'Loyal Servant of Arthur'];
              return (
                <div key={player.id} className="flex flex-col items-center gap-2 p-3 bg-secondary rounded-lg">
                  <Avatar className="w-16 h-16 border-2 border-border">
                    <Image src={`https://picsum.photos/seed/${player.username}/64/64`} width={64} height={64} alt={player.username} data-ai-hint="fantasy portrait" />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{player.username}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {role.alignment === 'good' ? <Shield className="h-3 w-3 text-blue-400" /> : <Swords className="h-3 w-3 text-red-400" />}
                    <span>{role.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
