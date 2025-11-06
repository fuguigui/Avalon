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

### TS version

1. in one terminal, run
```
firebase emulators:start --project avalon-c2f49
```
2. In a new terminal

```
npm i
npm run dev
```
3. in the browser, open the URL shown by the second termial

### Redis

Run to start Redis

```
brew services start redis
```

Inspect local redis

- Connect `redis-cli -h 127.0.0.1 -p 6379`
- See how many keys: `DBSIZE`
- List some keys: `SCAN 0 COUNT 100`
- Get a value:
   - strings: GET key, e.g. GET game:12345
- Delete a value:
   - specify key: DEL key, e.g. DEL game:OAIXD8

## Next JS

To get started, take a look at src/app/page.tsx.

npm ci && npm run build

## Referecnes

https://avalon.fun/

https://avalon-game.com/