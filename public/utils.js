export function nameStorageDocId(gameCode) {
    return `gm_id:${gameCode}:docid`;
}

export function nameStorageState(gameCode) {
    return `gm_id:${gameCode}:state`;
}

export function fetchRole(username, gameData) {
    if (gameData.players_to_roles && gameData.players_to_roles[username]) {
        return gameData.players_to_roles[username];
    } else {
        throw new Error("Player not found in the game.");
    }
}

export const KNOWLEDGE_MAP = {
    "Merlin": ["Morgana", "Assassin", "Oberon", "Minion"],
    "Percival": ["Merlin", "Morgana"],
    "Morgana": ["Assassin", "Mordred", "Minion"],
    "Assassin": ["Morgana", "Mordred", "Minion"],
    "Mordred": ["Morgana", "Assassin", "Minion"],
};

export function fetchKnownRoles(playerRole, gameData) {
    const knownRoles = [];
    const rolesToPlayers = gameData.roles_to_players || {};
    const rolesToKnow = KNOWLEDGE_MAP[playerRole] || [];
    rolesToKnow.forEach(role => {
        if (rolesToPlayers[role]) {
            knownRoles.push(...rolesToPlayers[role]);
        }
    });
    return knownRoles;
}