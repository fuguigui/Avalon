'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ROLES, QUEST_CONFIGURATIONS } from '@/lib/constants';
import type { Role, Game } from '@/lib/types';

const joinGameSchema = z.object({
  username: z.string().min(2).max(20),
  gameId: z.string().min(1).max(20),
});

const createGameSchema = z.object({
  playerCount: z.coerce.number().min(6).max(10),
  aiCount: z.coerce.number().min(0).max(10),
  roles: z.array(z.string()),
  minionCount: z.number().min(0).max(4),
  gameId: z.string().max(20).optional(),
  chatEnabled: z.boolean(),
});

const adminLoginSchema = z.object({
  adminId: z.string().min(1),
  password: z.string().min(1),
});

export async function adminLogin(data: unknown) {
  const validatedFields = adminLoginSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return;
  }
  
  // In a real app, you would validate admin credentials here.
}

export async function joinGame(data: unknown) {
  const validatedFields = joinGameSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid form data." };
  }
  
  const { gameId, username } = validatedFields.data;
  
  const gameRef = doc(db, 'games', gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    return { error: 'Game not found.' };
  }
  
  const gameData = gameSnap.data() as Game;

  if (gameData.players.length >= gameData.settings.playerCount) {
    return { error: 'Game is full.' };
  }

  if (gameData.players.some(p => p.username === username)) {
      return { error: 'Username is already taken.' };
  }

  const newPlayer = {
    id: (gameData.players.length + 1).toString(), // Simple ID for now
    username,
    role: null,
    isAi: false
  };

  await updateDoc(gameRef, {
      players: arrayUnion(newPlayer)
  });

  redirect(`/game/${gameId}?username=${username}`);
}

export async function createGame(data: unknown) {
  const validatedFields = createGameSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Invalid form data.",
    };
  }
  
  const { playerCount, roles: selectedRoles, gameId: customGameId, aiCount, chatEnabled, minionCount } = validatedFields.data;

  // Dynamically calculate loyal servant count and add to roles
  const loyalServantCount = playerCount - selectedRoles.length - minionCount;

  if (loyalServantCount < 0) {
    return {
      error: 'Too many roles selected for the number of players.',
    };
  }
  
  const finalRoles = [
    ...selectedRoles,
    ...Array(minionCount).fill('Minion of Mordred'),
    ...Array(loyalServantCount).fill('Loyal Servant of Arthur')
  ];
  
  const { goodRolesCount, evilRolesCount } = finalRoles.reduce((acc, roleName) => {
      const role = ROLES[roleName as Role['name']];
      if (role) {
        if (role.alignment === 'good') acc.goodRolesCount++;
        else acc.evilRolesCount++;
      }
      return acc;
    }, { goodRolesCount: 0, evilRolesCount: 0 });
    
  if (goodRolesCount + evilRolesCount !== playerCount) {
     return {
        error: 'The number of selected roles must match the player count.',
     };
  }
  
  const gameId = customGameId && customGameId.length > 0
    ? customGameId
    : Math.random().toString(36).substring(2, 8).toUpperCase();

  const questConfig = QUEST_CONFIGURATIONS[playerCount]?.[1] || QUEST_CONFIGURATIONS[5][1];

  const newGame: Game = {
    gameId,
    hostId: 'admin', // For now, admin is host
    players: [],
    settings: {
      playerCount,
      aiCount,
      roles: finalRoles as Role['name'][],
      chatEnabled,
    },
    state: {
      phase: 'lobby',
      currentQuest: 1,
      leaderIndex: 0,
      failedVotes: 0,
    },
    quests: questConfig.map((requiredPlayers, index) => ({
      questNumber: index + 1,
      status: 'pending',
      requiredPlayers,
      team: [],
      votes: {},
      questVotes: {},
    })),
  };

  await setDoc(doc(db, "games", gameId), newGame);

  return {
    redirect: `/game/${gameId}`,
  };
}
