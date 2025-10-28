'use client';

import { useState, useEffect } from 'react';
import type { Game, GamePhase, Player } from '@/lib/types';
import GameLobby from './game-lobby';
import GameBoard from './game-board';
import RoleReveal from './role-reveal';
import TeamSelection from './team-selection';
import Voting from './voting';
import GameOver from './game-over';
import { KnightIcon } from '../icons/knight-icon';

interface GameClientProps {
  initialGame: Game;
  currentUser: Player;
}

const gameFlow: GamePhase[] = [
  'lobby',
  'role-reveal',
  'team-selection',
  'team-vote',
  'quest-vote',
  'team-selection', // round 2
  'end',
];
let flowIndex = 0;

export default function GameClient({ initialGame, currentUser }: GameClientProps) {
  const [game, setGame] = useState<Game>(initialGame);

  // Simulate game flow for demonstration purposes
  useEffect(() => {
    if (game.state.phase === 'end') return;

    const transition = () => {
      flowIndex = (flowIndex + 1) % gameFlow.length;
      const nextPhase = gameFlow[flowIndex];

      setGame((prevGame) => ({
        ...prevGame,
        state: { ...prevGame.state, phase: nextPhase },
      }));
    };

    let delay = 5000;
    if (game.state.phase === 'lobby' && game.players.length < game.settings.playerCount) {
        // Wait in lobby
        return;
    }
    if(game.state.phase === 'role-reveal') {
        delay = 7000;
    }

    const timer = setTimeout(transition, delay);
    return () => clearTimeout(timer);
  }, [game.state.phase, game.players.length, game.settings.playerCount]);

  const renderPhase = () => {
    switch (game.state.phase) {
      case 'lobby':
        return <GameLobby players={game.players} requiredPlayers={game.settings.playerCount} gameId={game.gameId} />;
      case 'role-reveal':
        return <RoleReveal player={currentUser} />;
      case 'team-selection':
        return <TeamSelection players={game.players} leader={game.players[game.state.leaderIndex]} quest={game.quests[game.state.currentQuest - 1]} />;
      case 'team-vote':
        return <Voting type="team" />;
      case 'quest-vote':
        return <Voting type="quest" playerRole={currentUser.role || 'Loyal Servant of Arthur'} />;
      case 'end':
        return <GameOver players={game.players} quests={game.quests} winner="good" />;
      default:
        return <div>Unknown game phase...</div>;
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
            <KnightIcon className="h-8 w-8 text-accent" />
            <h1 className="font-headline text-3xl font-bold">AVALON</h1>
        </div>
        <div className="text-right">
            <p className="text-sm text-muted-foreground">Game ID</p>
            <p className="font-mono text-lg tracking-widest">{game.gameId}</p>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        {game.state.phase !== 'lobby' && game.state.phase !== 'role-reveal' && game.state.phase !== 'end' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-full">
            <div className="lg:col-span-2">{renderPhase()}</div>
            <div className="lg:col-span-1">
              <GameBoard game={game} />
            </div>
          </div>
        ) : (
          renderPhase()
        )}
      </main>
    </div>
  );
}
