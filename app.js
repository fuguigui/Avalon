// app.js
// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "avalon-c2f49.firebaseapp.com",
  projectId: "avalon-c2f49",
  // ... other config
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const authContainer = document.getElementById('auth-container');
const adminContainer = document.getElementById('admin-container');
const playerContainer = document.getElementById('player-container');
const loginBtn = document.getElementById('login-btn');
const authError = document.getElementById('auth-error');
const gameForm = document.getElementById('game-form');
const gameError = document.getElementById('game-error');
const gameInfo = document.getElementById('game-info');
const joinForm = document.getElementById('join-form');
const joinError = document.getElementById('join-error');
const playerInfo = document.getElementById('player-info');

let currentUser = null;
let currentGameId = null;

// Auth
loginBtn.onclick = async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  authError.textContent = '';
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (e) {
    if (e.code === 'auth/user-not-found') {
      try {
        await auth.createUserWithEmailAndPassword(email, password);
      } catch (err) {
        authError.textContent = err.message;
        return;
      }
    } else {
      authError.textContent = e.message;
      return;
    }
  }
};

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    authContainer.classList.add('hidden');
    adminContainer.classList.remove('hidden');
    playerContainer.classList.remove('hidden');
  } else {
    currentUser = null;
    authContainer.classList.remove('hidden');
    adminContainer.classList.add('hidden');
    playerContainer.classList.add('hidden');
  }
});

// Game creation
gameForm.onsubmit = async (e) => {
  e.preventDefault();
  gameError.textContent = '';
  const numPlayers = parseInt(document.getElementById('num-players').value, 10);
  const numAI = parseInt(document.getElementById('num-ai').value, 10);
  const roleCheckboxes = document.querySelectorAll('input[name="roles"]:checked');
  const roles = Array.from(roleCheckboxes).map(cb => cb.value);

  if (numPlayers < 5 || numPlayers > 10) {
    gameError.textContent = "Players must be 5–10.";
    return;
  }
  if (numAI < 0 || numAI > numPlayers) {
    gameError.textContent = "AI players must be between 0 and total players.";
    return;
  }
  if (roles.length < numPlayers) {
    gameError.textContent = "Not enough roles selected for all players.";
    return;
  }

  // Generate a game code
  const gameCode = Math.random().toString(36).substr(2, 6).toUpperCase();

  // Create game in Firestore
  const gameDoc = await db.collection('games').add({
    admin: currentUser.uid,
    gameCode,
    numPlayers,
    numAI,
    roles,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    state: 'waiting',
    players: [],
    assignments: {},
    quest: null,
    votes: [],
  });

  currentGameId = gameDoc.id;
  gameInfo.classList.remove('hidden');
  gameInfo.innerHTML = `
    <strong>Game Created!</strong><br>
    Game Code: <b>${gameCode}</b><br>
    Waiting for players to join...
  `;

  // Listen for players joining
  db.collection('games').doc(currentGameId)
    .onSnapshot(doc => {
      const data = doc.data();
      if (data.players.length === numPlayers) {
        assignRoles(data);
      }
    });
};

