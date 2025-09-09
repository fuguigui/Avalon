import type { Game } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Swords, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { QUEST_CONFIGURATIONS } from '@/lib/constants';

interface GameBoardProps {
  game: Game;
}

export default function GameBoard({ game }: GameBoardProps) {
  const currentLeader = game.players[game.state.leaderIndex];
  const questConfig = QUEST_CONFIGURATIONS[game.settings.playerCount][1] || QUEST_CONFIGURATIONS[5][1];


  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Game State</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-bold mb-2">Quest Track</h3>
          <div className="flex justify-around items-center bg-secondary p-3 rounded-lg">
            {game.quests.map((quest, index) => (
              <div key={quest.questNumber} className="text-center">
                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center border-2 ${game.state.currentQuest === quest.questNumber ? 'border-accent shadow-lg shadow-accent/20' : 'border-border'}`}>
                  {quest.status === 'success' && <CheckCircle className="h-6 w-6 text-green-500" />}
                  {quest.status === 'fail' && <XCircle className="h-6 w-6 text-red-500" />}
                  {quest.status !== 'success' && quest.status !== 'fail' && <span className="font-bold text-lg">{questConfig[index]}</span>}
                </div>
                <p className="text-xs mt-1 text-muted-foreground">Quest {quest.questNumber}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Vote Track</h3>
          <div className="flex items-center gap-2 bg-secondary p-3 rounded-lg">
            {[1, 2, 3, 4, 5].map(num => (
              <div key={num} className={`flex-1 h-3 rounded-full ${num <= game.state.failedVotes ? 'bg-red-500' : 'bg-muted'}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {game.state.failedVotes} of 5 failed team votes. If 5 teams are rejected in a row, Evil wins.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Current Leader</h3>
          <div className="flex items-center gap-3 bg-secondary p-3 rounded-lg">
            <Avatar>
              <AvatarFallback>{currentLeader.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-lg">{currentLeader.username}</span>
            <UserCheck className="h-5 w-5 text-accent ml-auto" />
          </div>
        </div>
        
        <div>
            <h3 className="font-bold mb-2">Players</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
                {game.players.map(player => (
                    <div key={player.id} className="flex items-center gap-2">
                        {player.role?.startsWith('Loyal') ? <Shield className="h-4 w-4 text-blue-400" /> : <Swords className="h-4 w-4 text-red-400" />}
                        <span>{player.username}</span>
                    </div>
                ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">This is for demo purposes. Player alignments would not be visible.</p>
        </div>

      </CardContent>
    </Card>
  );
}
