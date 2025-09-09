'use client';

import { useState, useEffect } from 'react';
import type { Game, Player } from '@/lib/types';
import GameLobby from './game-lobby';
import GameBoard from './game-board';
import RoleReveal from './role-reveal';
import TeamSelection from './team-selection';
import Voting from './voting';
import GameOver from './game-over';
import { KnightIcon } from '../icons/knight-icon';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';

interface GameClientProps {
  initialGame: Game;
  currentUser: Player;
}

export default function GameClient({ initialGame, currentUser }: GameClientProps) {
  const [game, setGame] = useState<Game>(initialGame);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    const unsub = onSnapshot(doc(db, "games", initialGame.gameId), (doc) => {
      if (doc.exists()) {
        setGame(doc.data() as Game);
      }
    });

    return () => unsub();
  }, [initialGame.gameId]);
  
  // This effect simulates game progression for demo purposes.
  // In a real app, game state transitions would be driven by player actions
  // and server-side logic updating the Firestore document.
  useEffect(() => {
    if (game.state.phase === 'end' || process.env.NODE_ENV !== 'development') return;

    const autoProgress = async () => {
        // Only progress automatically from the lobby
        if (game.state.phase === 'lobby' && game.players.length === game.settings.playerCount) {
            // Here you would trigger a server action to start the game
            // which would change the phase to 'role-reveal' in Firestore.
            console.log("Game full, would now progress to role reveal.");
        }
    }
    
    autoProgress();

  }, [game.state.phase, game.players.length, game.settings.playerCount, game.gameId]);

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <h1 className="font-headline text-3xl font-bold">Joining Game...</h1>
                <Skeleton className="h-48 w-96" />
              </div>
          </div>
      )
  }

  const renderPhase = () => {
    const playerForRoleReveal = game.players.find(p => p.id === currentUser.id) || currentUser;

    switch (game.state.phase) {
      case 'lobby':
        return <GameLobby players={game.players} requiredPlayers={game.settings.playerCount} gameId={game.gameId} />;
      case 'role-reveal':
        return <RoleReveal player={playerForRoleReveal} />;
      case 'team-selection':
        return <TeamSelection players={game.players} leader={game.players[game.state.leaderIndex]} quest={game.quests[game.state.currentQuest - 1]} />;
      case 'team-vote':
        return <Voting type="team" />;
      case 'quest-vote':
        return <Voting type="quest" playerRole={currentUser.role || 'Loyal Servant of Arthur'} />;
      case 'end':
        return <GameOver players={game.players} quests={game.quests} winner="good" />;
      default:
        return <div>Unknown game phase: {game.state.phase}</div>;
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
