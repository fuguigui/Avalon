import GameClient from '@/components/game/game-client';
import { notFound } from 'next/navigation';
import type { Game } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function getGameData(gameId: string): Promise<Game | null> {
  const gameRef = doc(db, 'games', gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    return null;
  }

  return gameSnap.data() as Game;
}

export default async function GamePage({
  params,
  searchParams,
}: {
  params: { gameId: string };
  searchParams: { username?: string };
}) {
  const game = await getGameData(params.gameId);

  if (!game) {
    notFound();
  }
  
  // Find the current user, or default to the first player if no username is in the URL.
  // This is useful for the host who creates the game and is redirected.
  const currentUser = game.players.find(p => p.username === searchParams.username) || game.players[0];
  
  if (!currentUser && game.players.length < game.settings.playerCount) {
    // This case handles when a user joins but isn't in the player list yet.
    // The GameClient will handle the real-time update.
    // We create a temporary user object.
    const tempUser = { id: 'temp', username: searchParams.username || 'Player', role: null, isAi: false };
    return <GameClient initialGame={game} currentUser={tempUser} />;
  }

  if (!currentUser) {
      // If the game is full and the user is not in it, they can't join.
      return <div>Game is full or you are not part of this game.</div>
  }


  return <GameClient initialGame={game} currentUser={currentUser} />;
}
