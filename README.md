Each game document contains

```json
{
  "admin": "adminname",
  "gameCode": "ABC123",
  "numPlayers": 7,
  "numAI": 2,
  "roles": ["Merlin", "Assassin", ...],
  "createdAt": <timestamp>,
  "status": "waiting", // or "started", "finished"
  "assignments": { "user1": "Merlin", "user2": "Assassin", },
  "role_to_players": { "Merlin": "user1", "Assasin": "user3": },
  "quest": null,
  "votes": [],
  "current_phase": {
    "quest_number": 1, 
    "team_building": [{
      "leader": "player_a", 
      "proposal": ["player_a", "player_b", ], 
      "votes": {"player_a": "Approve", "player_b": "Reject"},
      "votes_status": "Collecting/Revealing/Passed/Failed"
    }],
    "quest": {
      "cards": [{"player_a": "Success"}, {"player_b": "Fail"}],
      "cards_revealed": ["Success", "Success", "Fail"],
      "quest_result": "Success/Fail"
    },
  },
  "assasin": null,
  "past_phases": [...],
  "winner": "Good/Evil"
}
```

## Local Test DB

```
npm install -g firebase-tools
firebase init emulators


firebase serve -p 5001 # if 5000 is taken
```


## Firebase deploy

```
firebase deploy
```

## Worklog

2025-09-18: some pages will jump out. Check the reason and fix them

## Function ideas

- In the start.html page: distinguish good and evil by icons
- Check the game setup: by the number of good and evil player number
- Build the GameBoard: shows the whole progress of the game
- Add avatar to roles
- Add the vote limit: good people can only quest success.

Quest:
- add the function: for good people, can only vote Success.

## Known bugs

- When questing, it can happen some member is still pending but there is one fail, the quest becomes completed.
- Deleting the current phase when game is over.
- once another member votes, the current member's unsubmitted vote disappears. Consider adding sessionStorage to store.
- for some unknown reason, players may be kicked out.



