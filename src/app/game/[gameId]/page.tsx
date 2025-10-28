import GameClient from '@/components/game/game-client';
import { notFound } from 'next/navigation';
import type { Game, Player } from '@/lib/types';
import { ROLES } from '@/lib/constants';

// This is a mock function to simulate fetching game data from a database.
async function getGameData(gameId?: string, username?: string): Promise<Game | null> {
  gameId = '123456';

  const mockPlayers: Player[] = [
    { id: '1', username: 'Arthur', role: 'Merlin', isAi: false },
    { id: '2', username: 'Lancelot', role: 'Loyal Servant of Arthur', isAi: false },
    { id: '3', username: 'Percival', role: 'Percival', isAi: false },
    { id: '4', username: 'Galahad', role: 'Loyal Servant of Arthur', isAi: true },
    { id: '5', username: 'Mordred', role: 'Mordred', isAi: false },
  ];

  if (username && !mockPlayers.find(p => p.username === username)) {
      const newUser: Player = { id: (mockPlayers.length + 1).toString(), username, role: null, isAi: false };
      mockPlayers.push(newUser);
  }

  const mockGame: Game = {
    gameId: gameId,
    hostId: '1',
    players: mockPlayers,
    settings: {
      playerCount: 5,
      aiCount: 1,
      roles: ['Merlin', 'Percival', 'Loyal Servant of Arthur', 'Mordred', 'Assassin'],
      chatEnabled: true,
    },
    state: {
      phase: 'lobby',
      currentQuest: 1,
      leaderIndex: 0,
      failedVotes: 0,
    },
    quests: [
      { questNumber: 1, status: 'pending', requiredPlayers: 2, team: [], votes: {}, questVotes: {} },
      { questNumber: 2, status: 'pending', requiredPlayers: 3, team: [], votes: {}, questVotes: {} },
      { questNumber: 3, status: 'pending', requiredPlayers: 2, team: [], votes: {}, questVotes: {} },
      { questNumber: 4, status: 'pending', requiredPlayers: 3, team: [], votes: {}, questVotes: {} },
      { questNumber: 5, status: 'pending', requiredPlayers: 3, team: [], votes: {}, questVotes: {} },
    ],
  };

  return mockGame;
}

export default async function GamePage({
  params,
  searchParams,
}: {
  params: { gameId: string };
  searchParams: { username?: string };
}) {
  const game = await getGameData(params.gameId, searchParams.username);

  if (!game) {
    notFound();
  }

  const currentUser = game.players.find(p => p.username === searchParams.username) || game.players[0];

  return <GameClient initialGame={game} currentUser={currentUser} />;
}
