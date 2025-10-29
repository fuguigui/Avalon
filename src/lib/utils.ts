import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { STANDARD_DISTRIBUTIONS } from '@/lib/constants';
import type { RoleFairnessInput, RoleFairnessOutput } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkRoleFairness(input: RoleFairnessInput): RoleFairnessOutput {
  const { numPlayers, numGoodRoles, numEvilRoles } = input;

  const expected = STANDARD_DISTRIBUTIONS[numPlayers];

  if (!expected) {
    return {
      isFair: false,
      explanation: `No standard distribution configured for ${numPlayers} players.`,
    };
  }

  const [expectedGood, expectedEvil] = expected;

  if (numGoodRoles === expectedGood && numEvilRoles === expectedEvil) {
    return {
      isFair: true,
      explanation: `Distribution matches standard for ${numPlayers} players: ${expectedGood} good, ${expectedEvil} evil.`,
    };
  }

  return {
    isFair: false,
    explanation: `Distribution mismatch for ${numPlayers} players. Expected ${expectedGood} good / ${expectedEvil} evil but got ${numGoodRoles} good / ${numEvilRoles} evil.`,
  };
}
