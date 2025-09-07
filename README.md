Each game document contains

```json
{
  "admin": "adminname",
  "gameCode": "ABC123",
  "numPlayers": 7,
  "numAI": 2,
  "roles": ["Merlin", "Assassin", ...],
  "createdAt": <timestamp>,
  "state": "waiting", // or "started", "finished"
  "assignments": { "user1": "Merlin", "user2": "Assassin", ... },
  "quest": null,
  "votes": []
}
```

## Local Test DB

```
npm install -g firebase-tools
firebase init emulators


firebase serve -p 5001 # if 5000 is taken
```
