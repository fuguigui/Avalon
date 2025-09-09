import type { Role } from './types';

export const ROLES: Record<Role['name'], Role> = {
  'Merlin': {
    name: 'Merlin',
    alignment: 'good',
    description: 'Knows the evil players, but must remain hidden.',
    knows: ['Morgana', 'Assassin', 'Minion of Mordred', 'Oberon'],
  },
  'Percival': {
    name: 'Percival',
    alignment: 'good',
    description: 'Knows Merlin and Morgana, but not who is who.',
    knows: ['Merlin', 'Morgana'],
  },
  'Loyal Servant of Arthur': {
    name: 'Loyal Servant of Arthur',
    alignment: 'good',
    description: 'A loyal servant of Arthur with no special powers.',
  },
  'Assassin': {
    name: 'Assassin',
    alignment: 'evil',
    description: 'If Good wins, the Assassin can kill Merlin to win the game for Evil.',
  },
  'Mordred': {
    name: 'Mordred',
    alignment: 'evil',
    description: 'Is unknown to Merlin.',
  },
  'Morgana': {
    name: 'Morgana',
    alignment: 'evil',
    description: 'Appears as Merlin to Percival.',
  },
  'Oberon': {
    name: 'Oberon',
    alignment: 'evil',
    description: 'Is unknown to other evil players.',
  },
  'Minion of Mordred': {
    name: 'Minion of Mordred',
    alignment: 'evil',
    description: 'A standard evil player.',
  },
};

export const QUEST_CONFIGURATIONS: Record<number, Record<number, number[]>> = {
  5: { 1: [2, 3, 2, 3, 3] },
  6: { 1: [2, 3, 4, 3, 4] },
  7: { 1: [2, 3, 3, 4, 4], 2: [2, 3, 3, 4, 4] }, // 2 means 4th quest needs 2 fails
  8: { 1: [3, 4, 4, 5, 5], 2: [3, 4, 4, 5, 5] },
  9: { 1: [3, 4, 4, 5, 5], 2: [3, 4, 4, 5, 5] },
  10: { 1: [3, 4, 4, 5, 5], 2: [3, 4, 4, 5, 5] },
};
