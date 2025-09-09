import type { Player } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, User } from 'lucide-react';

interface GameLobbyProps {
  players: Player[];
  requiredPlayers: number;
  gameId: string;
}

export default function GameLobby({ players, requiredPlayers, gameId }: GameLobbyProps) {
  const waitingFor = requiredPlayers - players.length;

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Game Lobby</CardTitle>
          <CardDescription>Share this Game ID with other players: <span className="font-bold text-accent font-mono">{gameId}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 text-lg">
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Waiting for {waitingFor} more player{waitingFor !== 1 ? 's' : ''}...</span>
            </div>
            <p className="text-muted-foreground text-sm">{players.length} / {requiredPlayers} players have joined.</p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-bold text-left">Joined Players:</h3>
            <ul className="space-y-2">
              {players.map((player) => (
                <li key={player.id} className="flex items-center gap-3 bg-secondary p-2 rounded-md">
                  <Avatar>
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{player.username}</span>
                  {player.isAi && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">AI</span>}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
