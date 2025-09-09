export type Role = {
  name: 'Merlin' | 'Percival' | 'Loyal Servant of Arthur' | 'Assassin' | 'Mordred' | 'Morgana' | 'Oberon' | 'Minion of Mordred';
  alignment: 'good' | 'evil';
  description: string;
  knows?: Role['name'][];
};

export type Player = {
  id: string;
  username: string;
  role: Role['name'] | null;
  isAi: boolean;
};

export type Quest = {
  questNumber: number;
  status: 'pending' | 'active' | 'success' | 'fail';
  requiredPlayers: number;
  team: Player['id'][];
  votes: Record<Player['id'], 'approve' | 'reject'>;
  questVotes: Record<Player['id'], 'success' | 'fail'>;
};

export type GamePhase = 'lobby' | 'role-reveal' | 'team-selection' | 'team-vote' | 'quest-vote' | 'assassination' | 'end';

export type Game = {
  gameId: string;
  hostId: string;
  players: Player[];
  settings: {
    playerCount: number;
    aiCount: number;
    roles: Role['name'][];
    chatEnabled: boolean;
  };
  state: {
    phase: GamePhase;
    currentQuest: number;
    leaderIndex: number;
    failedVotes: number;
  };
  quests: Quest[];
};
