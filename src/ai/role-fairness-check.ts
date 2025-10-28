'use server';

/**
 * @fileOverview Checks the statistical fairness of role distributions in Avalon games.
 *
 * - checkRoleFairness - A function that checks the statistical fairness of role distributions.
 * - RoleFairnessInput - The input type for the checkRoleFairness function.
 * - RoleFairnessOutput - The return type for the checkRoleFairness function.
 */

import {z} from 'genkit';

const RoleFairnessInputSchema = z.object({
  numPlayers: z.number().describe('The total number of players in the game.'),
  numGoodRoles: z.number().describe('The number of good roles in the game.'),
  numEvilRoles: z.number().describe('The number of evil roles in the game.'),
});
export type RoleFairnessInput = z.infer<typeof RoleFairnessInputSchema>;

const RoleFairnessOutputSchema = z.object({
  isFair: z.boolean().describe('Whether the role distribution is statistically fair.'),
  explanation: z.string().describe('Explanation of the fairness check result.'),
});
export type RoleFairnessOutput = z.infer<typeof RoleFairnessOutputSchema>;

/**
 * Standard distribution map: key = numPlayers, value = [numGoodRoles, numEvilRoles]
 * Adjust these values if you use a different balancing rule.
 */
const STANDARD_DISTRIBUTIONS: Record<number, [number, number]> = {
  5: [3, 2],
  6: [4, 2],
  7: [4, 3],
  8: [5, 3],
  9: [6, 3],
  10: [6, 4],
};

export async function checkRoleFairness(input: RoleFairnessInput): Promise<RoleFairnessOutput> {
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
