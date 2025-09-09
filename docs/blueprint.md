# **App Name**: Knights of the Round Web

## Core Features:

- Game Creation: Admins can create a new Avalon game and configure the number of players, AI players, and roles. They can optionally set a custom game ID, or allow the system to auto-generate one. The game configurations will be stored to the Firestore.
- Game Joining: Players can join an existing game by entering a Game ID and a username. They will then be added to the Firestore document representing the game instance.
- Role Assignment: Once the game starts, roles are randomly assigned to players based on the Admin's settings, by using the 'tool' ability of an LLM, the role distribution in the current game settings will be automatically checked for statistical fairness. Players will view their role on a private screen.
- Team Selection: The current Leader selects a team for the quest. The UI facilitates easy selection and deselection of team members.
- Team and Quest Voting: Players vote on the proposed team (Approve/Reject) and selected team members vote on the quest (Success/Fail). These actions will be saved in the database and used to affect the outcome of the game.
- Game State Tracking: A visual representation of the game state is displayed, showing the outcomes of past quests, the current quest round, and the current Leader.
- End Game and Role Reveal: Once the game concludes, all roles are revealed. If the good side wins, the Assassin attempts to assassinate Merlin. A summary screen shows the final outcome and all player roles.

## Style Guidelines:

- Primary color: Dark blue (#3F51B5) to evoke a sense of nobility and strategy.
- Background color: Very dark grey (#212121) for a dark theme that minimizes distractions.
- Accent color: Gold (#FFD700) for highlighting important elements and actions.
- Body and headline font: 'Alegreya', a humanist serif with an elegant, intellectual, contemporary feel; suitable for both headlines and body text.
- Use shield and sword icons to represent the good and evil sides.
- Responsive layout to ensure the game is playable on various devices.
- Subtle transitions and animations to indicate state changes during the game.