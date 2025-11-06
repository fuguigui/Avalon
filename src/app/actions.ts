'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { checkRoleFairness } from '@/lib/utils';
import { ROLES, QUEST_CONFIGURATIONS } from '@/lib/constants';
import type { Role, Game } from '@/lib/types';
import { setJSON } from '@/lib/redis';

const joinGameSchema = z.object({
  username: z.string().min(2).max(20),
  gameId: z.string(),
});

const createGameSchema = z.object({
  playerCount: z.coerce.number().min(5).max(10),
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
  redirect('/admin');
}

export async function joinGame(data: unknown) {
  const validatedFields = joinGameSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return;
  }

  const { gameId, username } = validatedFields.data;

  // TODO: connect to Redis
  // 1. Check if gameId exists in Redis.
  // 2. Check if the game is not full.
  // 3. Add the user to the game document.
  // 4. Set a user session/cookie.

  redirect(`/game/${gameId}?username=${username}`);
}

export async function createGame(data: unknown) {
  const validatedFields = createGameSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Invalid form data.",
      fairness: null,
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
      fairness: null
    };
  }

  // Run the fairness check
  const fairnessResult = await checkRoleFairness({
    numPlayers: playerCount,
    numGoodRoles: goodRolesCount,
    numEvilRoles: evilRolesCount,
  });

  if (!fairnessResult.isFair) {
    return {
      error: 'Fairness check failed. Please adjust roles.',
      fairness: fairnessResult,
    }
  }

  const gameId = customGameId && customGameId.length === 6
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
  // In a real app, you would:
  // 1. Create a new game document in Firestore with the gameId.
  // 2. Store all the game settings.
  // 3. Set the user as the host.
  // 4. Set a user session/cookie.
  await setJSON('12345', newGame, undefined, 'game');
  return {
    redirect: `/game/${gameId}`,
  };
}
