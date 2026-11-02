/* 8. MOTOR COMPLETO DO XADREZ & DAMAS DE MOSCOU (ONLINE + LOCAL COM FIRESTORE) */
    function getChessCheckersHtml(p1Nick, p2Nick, initialRole) {
      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Xadrez & Damas de Moscou ☭ Grande Escola Soviética Felina</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/games.css">
</head>
<body class="min-h-screen p-2 sm:p-4 flex flex-col items-center justify-between">
  <!-- Top Bar -->
  <header class="w-full max-w-4xl bg-[#fff8ed] p-3 rounded-2xl sketch-border flex flex-wrap items-center justify-between gap-3 mb-2 shadow">
    <div class="flex items-center gap-2">
      <span class="text-3xl">♟️☭</span>
      <div>
        <h1 class="font-bold text-xl sm:text-2xl text-red-950 font-['Caveat']">Xadrez & Damas de Moscou ☭</h1>
        <p class="text-[11px] text-stone-700 font-medium flex items-center gap-1.5">
          <span id="cloud-sync-status-dot" class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span id="cloud-sync-status-text">Sincronizado via Satélite Sputnik ☁️</span>
        </p>
      </div>
    </div>
    
    <div class="flex items-center gap-2 flex-wrap text-xs font-bold">
      <!-- Seletor de Modalidade: Xadrez ou Damas -->
      <div class="flex bg-stone-100 p-0.5 rounded-xl border border-stone-800">
        <button id="btn-mode-chess" onclick="setGameMode('chess')" class="px-2.5 py-1 rounded-lg bg-amber-300 text-stone-900 border border-stone-800 flex items-center gap-1">
          <span>Xadrez ♟️</span>
          <span id="badge-chess-lances" class="text-[9px] bg-stone-900/10 px-1.5 py-0.2 rounded-full">0</span>
        </button>
        <button id="btn-mode-checkers" onclick="setGameMode('checkers')" class="px-2.5 py-1 rounded-lg bg-transparent text-stone-700 flex items-center gap-1">
          <span>Damas ⚪</span>
          <span id="badge-checkers-lances" class="text-[9px] bg-stone-900/10 px-1.5 py-0.2 rounded-full">0</span>
        </button>
      </div>

      <!-- Seletor de Tipo de Partida: Online (2 Celulares) ou Local (Mesma Tela) -->
      <div class="flex bg-stone-100 p-0.5 rounded-xl border border-stone-800">
        <button id="btn-play-online" onclick="setPlayMode('online')" class="px-2.5 py-1 rounded-lg bg-amber-300 text-stone-900 border border-stone-800 flex items-center gap-1">
          <span>🌐 Online</span>
        </button>
        <button id="btn-play-local" onclick="setPlayMode('local')" class="px-2.5 py-1 rounded-lg bg-transparent text-stone-700 flex items-center gap-1">
          <span>👥 Local</span>
        </button>
      </div>

      <!-- Seletor de Cores / Donos das Peças -->
      <select id="color-assignment-selector" onchange="changeColorAssignment(this.value)" class="bg-white border-2 border-stone-800 rounded-xl px-2 py-1 text-xs font-bold">
        <option value="cat1_white" selected="selected">Brancas: ${p1Nick} ⭐ | Pretas: ${p2Nick} 🚩</option>
        <option value="cat2_white">Brancas: ${p2Nick} 🚩 | Pretas: ${p1Nick} ⭐</option>
      </select>

      <!-- Seletor de Tempo -->
      <select id="time-selector" onchange="changeTimeLimit(this.value)" class="bg-white border-2 border-stone-800 rounded-xl px-2 py-1 text-xs font-bold">
        <option value="none" selected="selected">Sem Tempo ⏳</option>
        <option value="180">3 Minutos ⚡</option>
        <option value="300">5 Minutos ⏱️</option>
        <option value="600">10 Minutos 🏆</option>
      </select>

      <!-- Botão de Iniciar Partida (Destrava o Tabuleiro) -->
      <button id="btn-start-match" onclick="toggleStartMatch()" class="sketch-btn bg-amber-400 hover:bg-amber-500 text-red-950 px-3 py-1 rounded-xl font-bold flex items-center gap-1 shadow">
        <span id="btn-start-icon">▶</span>
        <span id="btn-start-label">Iniciar Partida</span>
      </button>

      <button onclick="resetCurrentMatch()" title="Reinicia somente a modalidade atual" class="sketch-btn bg-red-100 hover:bg-red-200 text-red-950 px-2.5 py-1 rounded-xl">
        🔄 Reiniciar
      </button>
    </div>
  </header>

  <!-- Banner de Lobby Online (Presença Mútua) -->
  <div id="online-lobby-bar" class="w-full max-w-4xl bg-amber-50 border-2 border-pencil rounded-2xl p-2 px-3 mb-2 flex items-center justify-between text-xs font-bold shadow-sm">
    <div class="flex items-center gap-3">
      <span class="text-sm">📡 Salão de Moscou:</span>
      <div class="flex items-center gap-1.5">
        <span id="online-p1-dot" class="w-2.5 h-2.5 rounded-full bg-stone-300 inline-block"></span>
        <span id="online-p1-label">${p1Nick}</span>
      </div>
      <span class="text-stone-400">|</span>
      <div class="flex items-center gap-1.5">
        <span id="online-p2-dot" class="w-2.5 h-2.5 rounded-full bg-stone-300 inline-block"></span>
        <span id="online-p2-label">${p2Nick}</span>
      </div>
    </div>
    <div class="text-[11px] text-stone-700">
      Camarada: <b class="text-red-900" id="online-my-role-label">Você</b>
    </div>
  </div>

  <!-- Arena Principal -->
  <main class="w-full max-w-4xl flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
    <div class="lg:col-span-2 flex flex-col items-center">
      <!-- Placar & Relógios -->
      <div class="w-full max-w-[420px] bg-[#fff8ed] p-2 rounded-2xl sketch-border mb-2 flex items-center justify-between text-xs font-bold">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
          <span id="player-white-name">${p1Nick} (Brancas)</span>
          <span id="clock-white" class="bg-amber-100 px-2 py-0.5 rounded-lg border border-stone-800 font-mono text-xs">--:--</span>
        </div>
        <span class="text-stone-400">VS</span>
        <div class="flex items-center gap-2">
          <span id="clock-black" class="bg-red-100 px-2 py-0.5 rounded-lg border border-stone-800 font-mono text-xs">--:--</span>
          <span id="player-black-name">${p2Nick} (Pretas)</span>
          <span class="w-3 h-3 rounded-full bg-stone-800 inline-block"></span>
        </div>
      </div>

      <div id="turn-banner" class="w-full max-w-[420px] bg-stone-200 border-2 border-stone-800 rounded-xl py-1 px-3 text-center text-xs font-bold text-stone-700 shadow-sm">Partida Pausada: Clique em 'Iniciar Partida' para jogar! ☭</div>

      <div id="presence-timer-badge" class="w-full max-w-[420px] text-center text-[10px] font-bold text-stone-600 mb-2 bg-stone-100 py-0.5 rounded-lg border border-stone-300">⏸️ Partida pausada (Aguardando Start)</div>

      <!-- Tabuleiro 8x8 -->
      <div id="board-container" class="w-[96vw] max-w-[420px] h-[96vw] max-h-[420px] border-4 border-[#2b1111] rounded-2xl shadow-xl overflow-hidden grid grid-cols-8 grid-rows-8 bg-[#991b1b] relative"></div>
    </div>

    <!-- Coluna Lateral: Notação de Casas & Chat Sincronizado -->
    <div class="flex flex-col gap-2 w-full max-w-[420px] mx-auto h-full">
      <div class="bg-[#fff8ed] rounded-2xl sketch-border p-3 flex flex-col h-44 shadow">
        <div class="flex items-center justify-between border-b border-stone-300 pb-1 text-xs font-bold text-stone-800">
          <span id="move-history-title">📜 Atas do Comitê (Xadrez)</span>
          <span id="move-count-pill" class="bg-red-100 text-red-900 text-[10px] px-2 py-0.2 rounded-full border border-red-300">0 lances</span>
        </div>
        <div id="move-history-list" class="flex-1 overflow-y-auto chat-scroll py-1.5 space-y-1 text-xs font-mono text-stone-700">
          <div class="text-[11px] text-stone-400 italic text-center py-4">Nenhum movimento realizado ainda.</div>
        </div>
      </div>

      <div class="bg-[#fff8ed] rounded-2xl sketch-border p-3 flex flex-col h-60 shadow flex-1">
        <div class="flex items-center justify-between border-b border-stone-300 pb-1 text-xs font-bold text-stone-800">
          <span class="flex items-center gap-1">💬 Rádio da Partida</span>
          <span id="chat-mode-indicator" class="text-[10px] text-emerald-700 font-bold">Sputnik Online ☁️</span>
        </div>
        
        <div id="game-chat-box" class="flex-1 overflow-y-auto chat-scroll py-1.5 space-y-1.5 text-xs"></div>

        <div class="flex items-center gap-1 pt-1 border-t border-stone-200">
          <input type="text" id="game-chat-input" placeholder="Mensagem pro seu Camarada..." maxlength="100" class="flex-1 text-xs p-1.5 rounded-xl border border-stone-800 bg-[#fff8ed] focus:outline-none">
          <button onclick="sendGameChatMessage()" class="sketch-btn bg-red-700 hover:bg-red-800 text-amber-200 font-bold text-xs px-2.5 py-1.5 rounded-xl">
            Transmitir
          </button>
        </div>
      </div>
    </div>
  </main>

  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
    import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
    import { 
      initializeFirestore, 
      doc, 
      setDoc, 
      onSnapshot,
      setLogLevel
    } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

    try { setLogLevel('silent'); } catch(e) {}

    const firebaseConfig = {
      apiKey: "AIzaSyDQKozcgf4N70cxUiUGJekGcUTClU2Httg",
      authDomain: "jardim-gatos-teste.firebaseapp.com",
      projectId: "jardim-gatos-teste",
      storageBucket: "jardim-gatos-teste.firebasestorage.app",
      messagingSenderId: "257294626705",
      appId: "1:257294626705:web:130481b8778d8a9eceb430",
      measurementId: "G-87FZWZWHXX"
    };

    const appId = "jardim-dos-gatos-casal";
    const fixedRoomId = "ninho_de_amor_fixo";

    const defaultNickP1 = "${p1Nick}";
    const defaultNickP2 = "${p2Nick}";
    let myRole = localStorage.getItem('casal_meu_gatinho') || '${initialRole}' || 'cat1';

    let gameMode = 'chess';
    let playMode = 'online';
    let selectedSquare = null;
    let validMoves = [];
    let isWindowActive = true;
    let timerInterval = null;
    let db = null;
    let roomRef = null;

    const gameStores = {
      chess: {
        playMode: 'online',
        board: null,
        turn: 'white',
        moveHistory: [],
        timeLimit: null,
        whiteTime: 0,
        blackTime: 0,
        isMatchStarted: false,
        colorAssignment: 'cat1_white',
        whitePlayerName: defaultNickP1,
        blackPlayerName: defaultNickP2,
        chatMessages: [],
        p1InRoom: false,
        p2InRoom: false,
        lastUpdate: Date.now()
      },
      checkers: {
        playMode: 'online',
        board: null,
        turn: 'white',
        moveHistory: [],
        timeLimit: null,
        whiteTime: 0,
        blackTime: 0,
        isMatchStarted: false,
        colorAssignment: 'cat1_white',
        whitePlayerName: defaultNickP1,
        blackPlayerName: defaultNickP2,
        chatMessages: [],
        p1InRoom: false,
        p2InRoom: false,
        lastUpdate: Date.now()
      }
    };

    function createFreshChessBoard() {
      const b = Array(8).fill(null).map(() => Array(8).fill(null));
      const backRank = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
      for (let c = 0; c < 8; c++) {
        b[0][c] = { piece: backRank[c], color: 'black' };
        b[1][c] = { piece: 'p', color: 'black' };
        b[6][c] = { piece: 'p', color: 'white' };
        b[7][c] = { piece: backRank[c], color: 'white' };
      }
      return b;
    }

    function createFreshCheckersBoard() {
      const b = Array(8).fill(null).map(() => Array(8).fill(null));
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 8; c++) {
          if ((r + c) % 2 === 1) b[r][c] = { piece: 'M', color: 'black' };
        }
      }
      for (let r = 5; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if ((r + c) % 2 === 1) b[r][c] = { piece: 'M', color: 'white' };
        }
      }
      return b;
    }

    gameStores.chess.board = createFreshChessBoard();
    gameStores.checkers.board = createFreshCheckersBoard();

    window.addEventListener('focus', () => { isWindowActive = true; updatePresenceBadge(); });
    window.addEventListener('blur', () => { isWindowActive = false; updatePresenceBadge(); });
    document.addEventListener('visibilitychange', () => {
      isWindowActive = !document.hidden;
      updatePresenceBadge();
    });

    function updatePresenceBadge() {
      const badge = document.getElementById('presence-timer-badge');
      if (!badge) return;
      const current = gameStores[gameMode];
      if (!current.isMatchStarted) {
        badge.className = "w-full max-w-[420px] text-center text-[10px] font-bold text-stone-600 mb-2 bg-stone-100 py-0.5 rounded-lg border border-stone-300";
        badge.innerText = "⏸️ Partida pausada (Aguardando Start)";
      } else if (isWindowActive) {
        badge.className = "w-full max-w-[420px] text-center text-[10px] font-bold text-emerald-800 mb-2 bg-emerald-50 py-0.5 rounded-lg border border-emerald-300";
        badge.innerText = "🟢 Camarada Ativo na Tela (Tempo fluindo)";
      } else {
        badge.className = "w-full max-w-[420px] text-center text-[10px] font-bold text-amber-900 mb-2 bg-amber-100 py-0.5 rounded-lg border border-amber-300";
        badge.innerText = "⏸️ Tempo PAUSADO (Camarada ausente da tela)";
      }
    }

    async function initFirestoreConnection() {
      try {
        const app = initializeApp(firebaseConfig);
        db = initializeFirestore(app, {
          experimentalAutoDetectLongPolling: true,
          ignoreUndefinedProperties: true
        });

        try {
          const auth = getAuth(app);
          await signInAnonymously(auth);
        } catch(e) {}

        roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', fixedRoomId);

        sendPresencePing(true);

        onSnapshot(roomRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            const bgData = data.boardGames || {};

            if (bgData.chess) syncGameStoreFromCloud('chess', bgData.chess);
            if (bgData.checkers) syncGameStoreFromCloud('checkers', bgData.checkers);

            renderBoard();
            renderMoveHistory();
            renderChatMessages();
            updateClockDisplay();
            updateStartButtonUI();
            updatePresenceBadge();
            updateLobbyPresenceUI();
            updateBadgesLances();
          }
        }, () => {
          const statusText = document.getElementById('cloud-sync-status-text');
          const statusDot = document.getElementById('cloud-sync-status-dot');
          if (statusText) statusText.innerText = "Bunker Local Seguro 🛡️";
          if (statusDot) statusDot.className = "w-2 h-2 rounded-full bg-amber-500 inline-block";
        });

        window.addEventListener('beforeunload', () => {
          sendPresencePing(false);
        });
      } catch(e) {}
    }

    function syncGameStoreFromCloud(mode, cloudData) {
      const store = gameStores[mode];
      if (!cloudData) return;
      if (cloudData.boardJson) {
        try { store.board = JSON.parse(cloudData.boardJson); } catch(e) {}
      } else if (cloudData.boardFlat && Array.isArray(cloudData.boardFlat)) {
        const b = [];
        for (let r = 0; r < 8; r++) {
          b.push(cloudData.boardFlat.slice(r * 8, (r + 1) * 8));
        }
        store.board = b;
      } else if (cloudData.board && Array.isArray(cloudData.board) && Array.isArray(cloudData.board[0])) {
        store.board = cloudData.board;
      }
      if (cloudData.turn) store.turn = cloudData.turn;
      if (cloudData.moveHistory) store.moveHistory = cloudData.moveHistory;
      if (cloudData.timeLimit !== undefined) store.timeLimit = cloudData.timeLimit;
      if (cloudData.whiteTime !== undefined) store.whiteTime = cloudData.whiteTime;
      if (cloudData.blackTime !== undefined) store.blackTime = cloudData.blackTime;
      if (cloudData.isMatchStarted !== undefined) store.isMatchStarted = cloudData.isMatchStarted;
      if (cloudData.colorAssignment) store.colorAssignment = cloudData.colorAssignment;
      if (cloudData.whitePlayerName) store.whitePlayerName = cloudData.whitePlayerName;
      if (cloudData.blackPlayerName) store.blackPlayerName = cloudData.blackPlayerName;
      if (cloudData.chatMessages) store.chatMessages = cloudData.chatMessages;
      if (cloudData.playMode) store.playMode = cloudData.playMode;
      store.p1InRoom = !!cloudData.p1InRoom;
      store.p2InRoom = !!cloudData.p2InRoom;

      if (mode === gameMode && store.isMatchStarted && store.timeLimit) {
        startTimerLoop();
      }
    }

    let saveDebounceTimer = null;
    function broadcastMatchStateToServer(immediate = false) {
      try { saveMatchStateLocally(); } catch(e) {}
      if (!db || !roomRef) return;

      try {
        const store = gameStores[gameMode];
        const payload = {
          boardGames: {
            activeMode: gameMode,
            [gameMode]: {
              playMode: store.playMode,
              boardJson: JSON.stringify(store.board),
              boardFlat: store.board.flat(),
              turn: store.turn,
              moveHistory: store.moveHistory,
              timeLimit: store.timeLimit,
              whiteTime: store.whiteTime,
              blackTime: store.blackTime,
              isMatchStarted: store.isMatchStarted,
              colorAssignment: store.colorAssignment,
              whitePlayerName: store.whitePlayerName,
              blackPlayerName: store.blackPlayerName,
              chatMessages: store.chatMessages,
              p1InRoom: myRole === 'cat1' ? true : store.p1InRoom,
              p2InRoom: myRole === 'cat2' ? true : store.p2InRoom,
              lastUpdate: Date.now()
            }
          }
        };

        if (immediate) {
          if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
          setDoc(roomRef, payload, { merge: true }).catch(() => {});
        } else {
          if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
          saveDebounceTimer = setTimeout(() => {
            saveDebounceTimer = null;
            setDoc(roomRef, payload, { merge: true }).catch(() => {});
          }, 350);
        }
      } catch(err) {}
    }

    function sendPresencePing(inRoom) {
      if (!db || !roomRef) return;
      const field = myRole === 'cat1' ? 'p1InRoom' : 'p2InRoom';
      setDoc(roomRef, {
        boardGames: {
          [gameMode]: {
            [field]: inRoom,
            lastUpdate: Date.now()
          }
        }
      }, { merge: true }).catch(() => {});
    }

    function updateLobbyPresenceUI() {
      const store = gameStores[gameMode];
      const p1Dot = document.getElementById('online-p1-dot');
      const p2Dot = document.getElementById('online-p2-dot');
      const p1Label = document.getElementById('online-p1-label');
      const p2Label = document.getElementById('online-p2-label');
      const myRoleLabel = document.getElementById('online-my-role-label');

      if (myRoleLabel) myRoleLabel.innerText = myRole === 'cat1' ? defaultNickP1 : defaultNickP2;
      if (p1Label) p1Label.innerText = defaultNickP1;
      if (p2Label) p2Label.innerText = defaultNickP2;

      if (p1Dot) p1Dot.className = store.p1InRoom ? 'w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block' : 'w-2.5 h-2.5 rounded-full bg-stone-300 inline-block';
      if (p2Dot) p2Dot.className = store.p2InRoom ? 'w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block' : 'w-2.5 h-2.5 rounded-full bg-stone-300 inline-block';

      const lobbyBar = document.getElementById('online-lobby-bar');
      if (lobbyBar) lobbyBar.style.display = store.playMode === 'online' ? 'flex' : 'none';
    }

    function getCatPieceSvg(piece, color) {
      if (!piece) return '';
      const isWhite = color === 'white';
      const bodyColor = isWhite ? '#fffdfa' : '#3d3835';
      const earInner = isWhite ? '#f7b0b0' : '#8c6052';
      const stroke = '#2b1111';
      const crown = isWhite ? '#ffd166' : '#f59e0b';

      if (gameMode === 'checkers') {
        const isKing = piece === 'K';
        return '<svg viewBox="0 0 100 100" class="w-4/5 h-4/5 anim-idle drop-shadow-md select-none pointer-events-none">' +
          '<circle cx="50" cy="50" r="42" fill="' + bodyColor + '" stroke="' + stroke + '" stroke-width="5"/>' +
          '<circle cx="50" cy="50" r="30" fill="' + (isWhite ? '#fef3c7' : '#524b47') + '" stroke="' + stroke + '" stroke-width="2.5"/>' +
          '<ellipse cx="40" cy="45" rx="4" ry="6" fill="' + stroke + '"/>' +
          '<ellipse cx="60" cy="45" rx="4" ry="6" fill="' + stroke + '"/>' +
          '<polygon points="48,54 52,54 50,57" fill="#e76f51"/>' +
          '<path d="M 47,59 Q 50,63 53,59" stroke="' + stroke + '" stroke-width="2.5" fill="none"/>' +
          (isKing ? '<path d="M 36,26 L 42,34 L 50,22 L 58,34 L 64,26 L 62,38 L 38,38 Z" fill="' + crown + '" stroke="' + stroke + '" stroke-width="2.5"/>' : '') +
          '</svg>';
      }

      let detail = '';
      if (piece === 'p') detail = '<circle cx="50" cy="74" r="10" fill="#b91c1c" stroke="' + stroke + '" stroke-width="2.5"/>';
      else if (piece === 'r') detail = '<rect x="30" y="66" width="40" height="20" rx="3" fill="#c49a6c" stroke="' + stroke + '" stroke-width="3"/>';
      else if (piece === 'n') detail = '<path d="M 64,48 Q 78,56 70,74" fill="none" stroke="' + stroke + '" stroke-width="4.5" stroke-linecap="round"/>';
      else if (piece === 'b') detail = '<ellipse cx="50" cy="22" rx="10" ry="14" fill="' + (isWhite ? '#ef4444' : '#991b1b') + '" stroke="' + stroke + '" stroke-width="2.5"/>';
      else if (piece === 'q') detail = '<path d="M 32,24 L 40,32 L 50,18 L 60,32 L 68,24 L 64,36 L 36,36 Z" fill="' + crown + '" stroke="' + stroke + '" stroke-width="2.5"/><circle cx="50" cy="18" r="3.5" fill="#ef4444"/>';
      else if (piece === 'k') detail = '<path d="M 30,22 L 36,34 L 50,16 L 64,34 L 70,22 L 66,38 L 34,38 Z" fill="' + crown + '" stroke="' + stroke + '" stroke-width="2.5"/><path d="M 48,10 L 52,10 M 50,8 L 50,14" stroke="' + stroke + '" stroke-width="2.5"/>';

      return '<svg viewBox="0 0 100 100" class="w-full h-full anim-idle drop-shadow-md select-none pointer-events-none">' +
        '<g>' +
          '<path d="M 28,88 C 22,88 24,72 32,66 C 36,62 64,62 68,66 C 76,72 78,88 72,88 Z" fill="' + bodyColor + '" stroke="' + stroke + '" stroke-width="4"/>' +
          '<path d="M 28,46 C 24,28 32,16 38,20 C 44,24 50,34 50,34 C 50,34 56,24 62,20 C 68,16 76,28 72,46 C 78,64 68,72 50,72 C 32,72 22,64 28,46 Z" fill="' + bodyColor + '" stroke="' + stroke + '" stroke-width="4"/>' +
          '<polygon points="34,24 40,30 32,38" fill="' + earInner + '"/>' +
          '<polygon points="66,24 60,30 68,38" fill="' + earInner + '"/>' +
          '<ellipse cx="42" cy="46" rx="4.5" ry="6" fill="' + stroke + '"/>' +
          '<ellipse cx="58" cy="46" rx="4.5" ry="6" fill="' + stroke + '"/>' +
          '<polygon points="48,53 52,53 50,56" fill="#e76f51"/>' +
          '<path d="M 46,58 Q 50,62 54,58" stroke="' + stroke + '" stroke-width="2.2" fill="none"/>' +
          detail +
        '</g>' +
      '</svg>';
    }

    function isCurrentPlayerAllowedToMove(color) {
      const store = gameStores[gameMode];
      if (store.playMode === 'local') return true;
      const isCat1White = store.colorAssignment === 'cat1_white';
      const myColor = (myRole === 'cat1') ? (isCat1White ? 'white' : 'black') : (isCat1White ? 'black' : 'white');
      return myColor === color;
    }

    function handleSquareClick(r, c) {
      const store = gameStores[gameMode];
      if (!store.isMatchStarted) {
        const tb = document.getElementById('turn-banner');
        if (tb) tb.innerText = "⚠️ Pressione 'Iniciar Partida' para liberar os lances!";
        return;
      }

      const board = store.board;
      const clickedPiece = board[r][c];

      if (selectedSquare) {
        const move = validMoves.find(m => m.r === r && m.c === c);
        if (move) {
          const fromSquare = { r: selectedSquare.r, c: selectedSquare.c };
          selectedSquare = null;
          validMoves = [];
          executeMove(fromSquare, { r, c });
          return;
        }
      }

      if (clickedPiece && clickedPiece.color === store.turn) {
        if (!isCurrentPlayerAllowedToMove(clickedPiece.color)) {
          const expectedName = store.turn === 'white' ? store.whitePlayerName : store.blackPlayerName;
          const tb = document.getElementById('turn-banner');
          if (tb) tb.innerText = "Vez de " + expectedName + "! Aguarde seu Camarada jogar ☭";
          return;
        }
        selectedSquare = { r, c };
        validMoves = getValidMovesFor(r, c);
      } else {
        selectedSquare = null;
        validMoves = [];
      }

      renderBoard();
    }

    function getValidMovesFor(r, c) {
      const store = gameStores[gameMode];
      const board = store.board;
      const item = board[r][c];
      if (!item) return [];
      const moves = [];

      if (gameMode === 'chess') {
        const p = item.piece;
        const color = item.color;
        const dir = color === 'white' ? -1 : 1;

        if (p === 'p') {
          if (r + dir >= 0 && r + dir < 8 && !board[r + dir][c]) {
            moves.push({ r: r + dir, c });
            const startRank = color === 'white' ? 6 : 1;
            if (r === startRank && !board[r + 2 * dir][c]) moves.push({ r: r + 2 * dir, c });
          }
          [-1, 1].forEach(dc => {
            const tr = r + dir, tc = c + dc;
            if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8 && board[tr][tc] && board[tr][tc].color !== color) {
              moves.push({ r: tr, c: tc });
            }
          });
        } else if (p === 'n') {
          const jumps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
          jumps.forEach(([dr, dc]) => {
            const tr = r + dr, tc = c + dc;
            if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8 && (!board[tr][tc] || board[tr][tc].color !== color)) {
              moves.push({ r: tr, c: tc });
            }
          });
        } else {
          let dirs = [];
          if (p === 'r') dirs = [[-1,0],[1,0],[0,-1],[0,1]];
          if (p === 'b') dirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
          if (p === 'q' || p === 'k') dirs = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
          const maxSteps = p === 'k' ? 1 : 7;

          dirs.forEach(([dr, dc]) => {
            for (let step = 1; step <= maxSteps; step++) {
              const tr = r + dr * step, tc = c + dc * step;
              if (tr < 0 || tr >= 8 || tc < 0 || tc >= 8) break;
              if (!board[tr][tc]) moves.push({ r: tr, c: tc });
              else {
                if (board[tr][tc].color !== color) moves.push({ r: tr, c: tc });
                break;
              }
            }
          });
        }
      } else {
        const color = item.color;
        const isKing = item.piece === 'K';
        const dirs = isKing ? [[-1,-1],[-1,1],[1,-1],[1,1]] : (color === 'white' ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]]);

        dirs.forEach(([dr, dc]) => {
          const tr = r + dr, tc = c + dc;
          if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
            if (!board[tr][tc]) moves.push({ r: tr, c: tc });
            else if (board[tr][tc].color !== color) {
              const jr = tr + dr, jc = tc + dc;
              if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8 && !board[jr][jc]) {
                moves.push({ r: jr, c: jc, capture: { r: tr, c: tc } });
              }
            }
          }
        });
      }

      return moves;
    }

    function coordsToAlgebraic(r, c) {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      return files[c] + (8 - r);
    }

    function executeMove(from, to) {
      const store = gameStores[gameMode];
      const board = store.board;
      const piece = board[from.r][from.c];
      if (!piece) return;
      const target = board[to.r][to.c];
      const fromCoord = coordsToAlgebraic(from.r, from.c);
      const toCoord = coordsToAlgebraic(to.r, to.c);

      if (gameMode === 'checkers') {
        const dr = to.r - from.r;
        const dc = to.c - from.c;
        if (Math.abs(dr) === 2 && Math.abs(dc) === 2) {
          const capR = from.r + dr / 2;
          const capC = from.c + dc / 2;
          board[capR][capC] = null;
        }
        if (piece.color === 'white' && to.r === 0) piece.piece = 'K';
        if (piece.color === 'black' && to.r === 7) piece.piece = 'K';
      }

      if (gameMode === 'chess' && piece.piece === 'p' && (to.r === 0 || to.r === 7)) {
        piece.piece = 'q';
      }

      board[to.r][to.c] = piece;
      board[from.r][from.c] = null;

      const isWhite = store.turn === 'white';
      const actorName = isWhite ? store.whitePlayerName : store.blackPlayerName;
      const icon = isWhite ? '⭐' : '🚩';
      const moveStr = icon + ' ' + actorName + ': ' + fromCoord + ' ➔ ' + toCoord + (target ? ' 💥' : '');
      store.moveHistory.push(moveStr);
      renderMoveHistory();

      store.turn = store.turn === 'white' ? 'black' : 'white';
      renderBoard();
      saveMatchStateLocally();
      broadcastMatchStateToServer(true);
    }

    function renderBoard() {
      const container = document.getElementById('board-container');
      if (!container) return;
      container.innerHTML = '';
      const store = gameStores[gameMode];
      const board = store.board;

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const square = document.createElement('div');
          const isLight = (r + c) % 2 === 0;
          square.className = 'w-full h-full flex items-center justify-center relative cursor-pointer ' + (isLight ? 'square-light' : 'square-dark');
          square.dataset.row = r;
          square.dataset.col = c;

          if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
            square.classList.add('square-selected');
          }

          const isTarget = validMoves.some(m => m.r === r && m.c === c);
          if (isTarget) {
            if (board[r][c]) square.classList.add('square-valid-capture');
            else square.classList.add('square-valid-move');
          }

          const pieceObj = board[r][c];
          if (pieceObj) {
            const pieceWrap = document.createElement('div');
            pieceWrap.className = 'w-4/5 h-4/5 flex items-center justify-center transition-transform pointer-events-none select-none';
            pieceWrap.innerHTML = getCatPieceSvg(pieceObj.piece, pieceObj.color);
            square.appendChild(pieceWrap);
          }

          square.onclick = (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            handleSquareClick(r, c);
          };
          container.appendChild(square);
        }
      }

      updateTurnBanner();
      updatePresenceBadge();
      updateBadgesLances();
    }

    function renderMoveHistory() {
      const store = gameStores[gameMode];
      const list = document.getElementById('move-history-list');
      const countPill = document.getElementById('move-count-pill');
      if (countPill) countPill.innerText = store.moveHistory.length + ' lances';
      if (!list) return;

      if (store.moveHistory.length === 0) {
        list.innerHTML = '<div class="text-[11px] text-stone-400 italic text-center py-4">Nenhum movimento realizado ainda.</div>';
        return;
      }

      list.innerHTML = '';
      store.moveHistory.forEach((m, idx) => {
        const row = document.createElement('div');
        row.className = 'px-1.5 py-0.5 rounded hover:bg-stone-100 flex items-center justify-between text-[11px]';
        row.innerHTML = '<span class="text-stone-400 mr-1">' + (idx + 1) + '.</span> <span>' + m + '</span>';
        list.appendChild(row);
      });
      list.scrollTop = list.scrollHeight;
    }

    function updateTurnBanner() {
      const b = document.getElementById('turn-banner');
      if (!b) return;
      const store = gameStores[gameMode];
      if (!store.isMatchStarted) {
        b.className = "w-full max-w-[420px] bg-stone-200 border-2 border-stone-800 rounded-xl py-1 px-3 text-center text-xs font-bold text-stone-700 shadow-sm";
        b.innerText = "Partida Pausada: Clique em 'Iniciar Partida' para jogar! ☭";
        return;
      }
      const isWhite = store.turn === 'white';
      const activePlayer = isWhite ? store.whitePlayerName : store.blackPlayerName;
      b.className = 'w-full max-w-[420px] border-2 border-stone-800 rounded-xl py-1 px-3 text-center text-xs font-bold shadow-sm ' + (isWhite ? 'bg-amber-100 text-amber-950' : 'bg-red-100 text-red-950');
      b.innerText = 'Vez de ' + activePlayer + ' (' + (isWhite ? 'Brancas' : 'Pretas') + ') ☭';
    }

    function updateBadgesLances() {
      const bC = document.getElementById('badge-chess-lances');
      const bD = document.getElementById('badge-checkers-lances');
      if (bC) bC.innerText = gameStores.chess.moveHistory ? gameStores.chess.moveHistory.length : 0;
      if (bD) bD.innerText = gameStores.checkers.moveHistory ? gameStores.checkers.moveHistory.length : 0;
    }

    window.setGameMode = function(newMode) {
      if (gameMode === newMode) return;
      broadcastMatchStateToServer(true);
      clearInterval(timerInterval);
      gameMode = newMode;
      selectedSquare = null;
      validMoves = [];

      const bChess = document.getElementById('btn-mode-chess');
      const bCheckers = document.getElementById('btn-mode-checkers');
      if (bChess) bChess.className = gameMode === 'chess' ? 'px-2.5 py-1 rounded-lg bg-amber-300 text-stone-900 border border-stone-800 flex items-center gap-1 font-bold' : 'px-2.5 py-1 rounded-lg bg-transparent text-stone-700 flex items-center gap-1 font-normal';
      if (bCheckers) bCheckers.className = gameMode === 'checkers' ? 'px-2.5 py-1 rounded-lg bg-amber-300 text-stone-900 border border-stone-800 flex items-center gap-1 font-bold' : 'px-2.5 py-1 rounded-lg bg-transparent text-stone-700 flex items-center gap-1 font-normal';

      const titleHist = document.getElementById('move-history-title');
      if (titleHist) titleHist.innerText = gameMode === 'chess' ? '📜 Atas do Comitê (Xadrez)' : '📜 Atas do Comitê (Damas)';

      const store = gameStores[gameMode];
      document.getElementById('time-selector').value = store.timeLimit ? String(store.timeLimit) : 'none';
      document.getElementById('color-assignment-selector').value = store.colorAssignment || 'cat1_white';
      document.getElementById('player-white-name').innerText = store.whitePlayerName + ' (Brancas)';
      document.getElementById('player-black-name').innerText = store.blackPlayerName + ' (Pretas)';

      renderBoard();
      renderMoveHistory();
      renderChatMessages();
      updateClockDisplay();
      updateStartButtonUI();
      updatePresenceBadge();
      updateLobbyPresenceUI();

      if (store.isMatchStarted && store.timeLimit) startTimerLoop();
    };

    window.setPlayMode = function(mode) {
      playMode = mode;
      const store = gameStores[gameMode];
      store.playMode = mode;

      const btnOnline = document.getElementById('btn-play-online');
      const btnLocal = document.getElementById('btn-play-local');
      if (btnOnline) btnOnline.className = mode === 'online' ? 'px-2.5 py-1 rounded-lg bg-amber-300 text-stone-900 border border-stone-800 flex items-center gap-1 font-bold' : 'px-2.5 py-1 rounded-lg bg-transparent text-stone-700 flex items-center gap-1 font-normal';
      if (btnLocal) btnLocal.className = mode === 'local' ? 'px-2.5 py-1 rounded-lg bg-amber-300 text-stone-900 border border-stone-800 flex items-center gap-1 font-bold' : 'px-2.5 py-1 rounded-lg bg-transparent text-stone-700 flex items-center gap-1 font-normal';

      updateLobbyPresenceUI();
      broadcastMatchStateToServer(true);
    };

    window.changeColorAssignment = function(val) {
      const store = gameStores[gameMode];
      store.colorAssignment = val;
      if (val === 'cat1_white') {
        store.whitePlayerName = defaultNickP1;
        store.blackPlayerName = defaultNickP2;
      } else {
        store.whitePlayerName = defaultNickP2;
        store.blackPlayerName = defaultNickP1;
      }
      document.getElementById('player-white-name').innerText = store.whitePlayerName + ' (Brancas)';
      document.getElementById('player-black-name').innerText = store.blackPlayerName + ' (Pretas)';
      updateTurnBanner();
      broadcastMatchStateToServer(true);
    };

    window.toggleStartMatch = function() {
      const store = gameStores[gameMode];
      store.isMatchStarted = !store.isMatchStarted;
      updateStartButtonUI();
      if (store.isMatchStarted) startTimerLoop();
      else clearInterval(timerInterval);
      updatePresenceBadge();
      updateTurnBanner();
      broadcastMatchStateToServer(true);
    };

    function updateStartButtonUI() {
      const btn = document.getElementById('btn-start-match');
      const label = document.getElementById('btn-start-label');
      const icon = document.getElementById('btn-start-icon');
      if (!btn || !label || !icon) return;
      const store = gameStores[gameMode];
      if (store.isMatchStarted) {
        btn.className = "sketch-btn bg-amber-300 hover:bg-amber-400 text-stone-900 px-3 py-1 rounded-xl font-bold flex items-center gap-1 shadow";
        label.innerText = "Pausar";
        icon.innerText = "⏸";
      } else {
        btn.className = "sketch-btn bg-amber-400 hover:bg-amber-500 text-red-950 px-3 py-1 rounded-xl font-bold flex items-center gap-1 shadow";
        label.innerText = store.moveHistory.length > 0 ? "Continuar" : "Iniciar Partida";
        icon.innerText = "▶";
      }
    }

    window.changeTimeLimit = function(val) {
      const store = gameStores[gameMode];
      if (val === 'none') {
        store.timeLimit = null;
        clearInterval(timerInterval);
        document.getElementById('clock-white').innerText = '--:--';
        document.getElementById('clock-black').innerText = '--:--';
      } else {
        store.timeLimit = parseInt(val, 10);
        store.whiteTime = store.timeLimit;
        store.blackTime = store.timeLimit;
        updateClockDisplay();
        if (store.isMatchStarted) startTimerLoop();
      }
      broadcastMatchStateToServer(true);
    };

    function startTimerLoop() {
      clearInterval(timerInterval);
      const store = gameStores[gameMode];
      if (!store.timeLimit) return;

      timerInterval = setInterval(() => {
        if (!store.isMatchStarted || !isWindowActive) return;
        if (store.turn === 'white') store.whiteTime = Math.max(0, store.whiteTime - 1);
        else store.blackTime = Math.max(0, store.blackTime - 1);
        updateClockDisplay();
        if (store.whiteTime === 0 || store.blackTime === 0) {
          clearInterval(timerInterval);
          store.isMatchStarted = false;
          updateStartButtonUI();
          updatePresenceBadge();
          broadcastMatchStateToServer(true);
        }
      }, 1000);
    }

    function formatTime(s) {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
    }

    function updateClockDisplay() {
      const store = gameStores[gameMode];
      if (!store.timeLimit) {
        document.getElementById('clock-white').innerText = '--:--';
        document.getElementById('clock-black').innerText = '--:--';
        return;
      }
      document.getElementById('clock-white').innerText = formatTime(store.whiteTime);
      document.getElementById('clock-black').innerText = formatTime(store.blackTime);
    }

    window.sendGameChatMessage = function() {
      const input = document.getElementById('game-chat-input');
      const txt = input.value.trim();
      if (!txt) return;
      const store = gameStores[gameMode];
      const isWhite = store.turn === 'white';
      const mySenderName = myRole === 'cat1' ? defaultNickP1 : defaultNickP2;

      store.chatMessages.push({
        id: Date.now(),
        author: mySenderName,
        isWhite,
        text: txt,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      renderChatMessages();
      input.value = '';
      broadcastMatchStateToServer(true);
    };

    function renderChatMessages() {
      const box = document.getElementById('game-chat-box');
      if (!box) return;
      box.innerHTML = '';
      const store = gameStores[gameMode];
      store.chatMessages.forEach(m => {
        const item = document.createElement('div');
        const isMe = m.author === (myRole === 'cat1' ? defaultNickP1 : defaultNickP2);
        item.className = 'p-1.5 rounded-xl border text-xs max-w-[90%] ' + (isMe ? 'bg-amber-50 border-amber-300 ml-auto' : 'bg-red-50 border-red-300 mr-auto');
        item.innerHTML = '<span class="text-[9px] font-bold block text-stone-500">' + m.author + ' • ' + m.time + '</span><p class="font-medium">' + m.text + '</p>';
        box.appendChild(item);
      });
      box.scrollTop = box.scrollHeight;
    }

    function saveMatchStateLocally() {
      try {
        const store = gameStores[gameMode];
        const key = gameMode === 'chess' ? 'casal_chess_saved_match_v3' : 'casal_checkers_saved_match_v3';
        localStorage.setItem(key, JSON.stringify({
          playMode: store.playMode,
          board: store.board,
          boardJson: JSON.stringify(store.board),
          turn: store.turn,
          moveHistory: store.moveHistory,
          timeLimit: store.timeLimit,
          whiteTime: store.whiteTime,
          blackTime: store.blackTime,
          isMatchStarted: store.isMatchStarted,
          colorAssignment: store.colorAssignment,
          whitePlayerName: store.whitePlayerName,
          blackPlayerName: store.blackPlayerName,
          chatMessages: store.chatMessages
        }));
      } catch(e) {}
    }

    function loadLocalMatchCache(mode) {
      try {
        const key = mode === 'chess' ? 'casal_chess_saved_match_v3' : 'casal_checkers_saved_match_v3';
        const saved = localStorage.getItem(key);
        if (saved) syncGameStoreFromCloud(mode, JSON.parse(saved));
      } catch(e) {}
    }

    window.resetCurrentMatch = function() {
      clearInterval(timerInterval);
      const store = gameStores[gameMode];
      store.board = gameMode === 'chess' ? createFreshChessBoard() : createFreshCheckersBoard();
      store.turn = 'white';
      store.isMatchStarted = false;
      store.moveHistory = [];
      selectedSquare = null;
      validMoves = [];

      if (store.timeLimit) {
        store.whiteTime = store.timeLimit;
        store.blackTime = store.timeLimit;
      }

      updateStartButtonUI();
      renderBoard();
      renderMoveHistory();
      updateClockDisplay();
      updatePresenceBadge();
      broadcastMatchStateToServer(true);
    };

    window.addEventListener('DOMContentLoaded', () => {
      loadLocalMatchCache('chess');
      loadLocalMatchCache('checkers');
      initFirestoreConnection();
      renderBoard();
      renderMoveHistory();
      renderChatMessages();
      updateClockDisplay();
      updateStartButtonUI();
      updatePresenceBadge();
      updateLobbyPresenceUI();
      updateBadgesLances();

      const chatInput = document.getElementById('game-chat-input');
      if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') sendGameChatMessage();
        });
      }
    });
  <\/script>
</body>
</html>`;
    }

    function openChessCheckersGameWindow() {
      const p1Nick = (window.sharedState?.nicknames?.cat1) || 'Camarada 1';
      const p2Nick = (window.sharedState?.nicknames?.cat2) || 'Camarada 2';
      const initialRole = window.sharedState?.myRole || 'cat1';
      const newWin = window.open('', '_blank');
      if (!newWin) {
        showBannerToast("Permita pop-ups para abrir o Xadrez & Damas de Moscou! ♟️☭");
        return;
      }
      newWin.document.open();
      newWin.document.write(getChessCheckersHtml(p1Nick, p2Nick, initialRole));
      newWin.document.close();
    }
    window.openChessCheckersGameWindow = openChessCheckersGameWindow;

    /* 9. CENTRAL DE JOGOS & MULTIPLAYER CONTROLLERS */
    let currentGamesTab = 'online';

    function openGamesHubModal() {
      const modal = document.getElementById('games-hub-modal');
      if (modal) modal.classList.remove('hidden');
      switchGamesTab('online');
    }
    window.openGamesHubModal = openGamesHubModal;

    function closeGamesHubModal() {
      const modal = document.getElementById('games-hub-modal');
      if (modal) modal.classList.add('hidden');
    }
    window.closeGamesHubModal = closeGamesHubModal;

    function switchGamesTab(tab) {
      currentGamesTab = tab;
      const bOnline = document.getElementById('btn-tab-online');
      const bSolo = document.getElementById('btn-tab-solo');
      if (bOnline) bOnline.className = tab === 'online' ? 'px-3 py-1 rounded-xl bg-amber-300 border border-pencil font-bold text-red-950' : 'px-3 py-1 rounded-xl bg-white border border-pencil';
      if (bSolo) bSolo.className = tab === 'solo' ? 'px-3 py-1 rounded-xl bg-amber-300 border border-pencil font-bold text-red-950' : 'px-3 py-1 rounded-xl bg-white border border-pencil';

      const container = document.getElementById('games-list-container');
      if (!container) return;
      container.innerHTML = '';

      if (tab === 'online') {
        container.innerHTML = `
          <div class="bg-gradient-to-r from-red-100 to-amber-100 p-3 rounded-2xl border-2 border-pencil flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-2.5">
              <span class="text-3xl">♟️☭</span>
              <div>
                <h4 class="text-xs font-bold text-red-950">Xadrez & Damas de Moscou</h4>
                <p class="text-[11px] text-pencil/70">Estratégia soviética do casal em nova guia!</p>
              </div>
            </div>
            <button onclick="openChessCheckersGameWindow()" class="sketch-btn bg-red-700 hover:bg-red-800 text-amber-200 text-xs px-3 py-1.5 rounded-xl font-bold shadow">
              Abrir ↗️
            </button>
          </div>

          <div class="bg-gradient-to-r from-amber-50 to-red-50 p-3 rounded-2xl border-2 border-pencil flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-2.5">
              <span class="text-3xl">✊☭</span>
              <div>
                <h4 class="text-xs font-bold text-red-950">Jokenpô Proletário Online</h4>
                <p class="text-[11px] text-pencil/70">Pedra, papel ou tesoura em 2 aparelhos! (+6 🐾)</p>
              </div>
            </div>
            <button onclick="openJokenpoModal('online', false)" class="sketch-btn bg-amber-300 hover:bg-amber-400 text-xs px-3 py-1.5 rounded-xl font-bold text-red-950 shadow">
              Jogar Online 🌐
            </button>
          </div>

          <div class="bg-white p-3 rounded-2xl border-2 border-pencil flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-2.5">
              <span class="text-3xl">⚡🥣</span>
              <div>
                <h4 class="text-xs font-bold text-red-950">Pata Rápida Stakhanovista</h4>
                <p class="text-[11px] text-pencil/70">Reflexo operário em 2 aparelhos! (+6 🐾)</p>
              </div>
            </div>
            <button onclick="openReactionModal()" class="sketch-btn bg-amber-200 hover:bg-amber-300 text-xs px-3 py-1.5 rounded-xl font-bold text-red-950 shadow">
              Jogar Online 🌐
            </button>
          </div>

          <div class="bg-white p-3 rounded-2xl border-2 border-pencil flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-2.5">
              <span class="text-3xl">☭⭐</span>
              <div>
                <h4 class="text-xs font-bold text-red-950">Jogo da Velha Coletivo</h4>
                <p class="text-[11px] text-pencil/70">Turnos ao vivo em 2 aparelhos! (+8 🐾)</p>
              </div>
            </div>
            <button onclick="openTicTacToeModal()" class="sketch-btn bg-red-100 hover:bg-red-200 text-xs px-3 py-1.5 rounded-xl font-bold text-red-950">
              Jogar Online 🌐
            </button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="bg-white p-3 rounded-2xl border-2 border-pencil flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-2.5">
              <span class="text-3xl">🏒❄️</span>
              <div>
                <h4 class="text-xs font-bold text-red-950">Air Hockey Siberiano</h4>
                <p class="text-[11px] text-pencil/70">Disputa no gelo na mesma tela! (+10 🐾)</p>
              </div>
            </div>
            <button onclick="openAirHockeyModal('local')" class="sketch-btn bg-amber-300 hover:bg-amber-400 text-xs px-3 py-1.5 rounded-xl font-bold text-red-950 shadow">
              Mesma Tela 👥
            </button>
          </div>

          <div class="bg-white p-3 rounded-2xl border-2 border-pencil flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-2.5">
              <span class="text-3xl">🚀☁️</span>
              <div>
                <h4 class="text-xs font-bold text-red-950">Pula-Pula Sputnik nas Nuvens</h4>
                <p class="text-[11px] text-pencil/70">Salte alto rumo ao espaço! (+8 🐾)</p>
              </div>
            </div>
            <button onclick="openSkyHopModal()" class="sketch-btn bg-red-700 hover:bg-red-800 text-xs px-3 py-1.5 rounded-xl font-bold text-amber-200">
              Lançar 🚀
            </button>
          </div>
        `;
      }
    }
    window.switchGamesTab = switchGamesTab;

    /* 10. DIÁRIO DO PARTIDO & PLANOS QUINQUENAIS */
    function openPartnerProfileModal() {
      checkStreakProgress();
      const modal = document.getElementById('partner-profile-modal');
      if (modal) modal.classList.remove('hidden');
    }
    window.openPartnerProfileModal = openPartnerProfileModal;

    function closePartnerProfileModal() {
      const modal = document.getElementById('partner-profile-modal');
      if (modal) modal.classList.add('hidden');
    }
    window.closePartnerProfileModal = closePartnerProfileModal;

    function checkStreakProgress() {
      const today = getTodayDateString();
      const myRole = window.sharedState.myRole || 'cat1';
      const myCode = generateDailyCodeForRole(myRole, today);

      const codeBox = document.getElementById('daily-generated-code-box');
      if (codeBox) codeBox.innerText = myCode;

      const badgeIcon = document.getElementById('daily-lock-icon');
      const badgeText = document.getElementById('daily-lock-text');
      const isSynced = isPresenceSyncedToday();

      if (isSynced) {
        if (badgeIcon) badgeIcon.innerText = '🔓';
        if (badgeText) badgeText.innerText = 'Sindicato Ativo ☭';
        document.getElementById('cat1-locked-overlay')?.classList.add('hidden');
        document.getElementById('cat2-locked-overlay')?.classList.add('hidden');
      } else {
        if (badgeIcon) badgeIcon.innerText = '🔒';
        if (badgeText) badgeText.innerText = 'Ponto do Sindicato ☭';
        const partnerRole = (myRole === 'cat1') ? 'cat2' : 'cat1';
        if (partnerRole === 'cat1') {
          document.getElementById('cat1-locked-overlay')?.classList.remove('hidden');
        } else {
          document.getElementById('cat2-locked-overlay')?.classList.remove('hidden');
        }
      }

      const headerStreak = document.getElementById('header-streak-badge');
      if (headerStreak) headerStreak.innerText = `${window.sharedState.streak?.current || 1} Dias de Plano Quinquenal 🔥`;

      const curDisplay = document.getElementById('streak-current-display');
      if (curDisplay) curDisplay.innerText = window.sharedState.streak?.current || 1;

      const bestDisplay = document.getElementById('streak-best-display');
      if (bestDisplay) bestDisplay.innerText = window.sharedState.streak?.best || 1;

      const totDisplay = document.getElementById('streak-total-display');
      if (totDisplay) totDisplay.innerText = window.sharedState.streak?.totalDays || 1;

      const s1 = document.getElementById('score-cat1-wins');
      const s2 = document.getElementById('score-cat2-wins');
      const st = document.getElementById('score-ties');
      if (s1) s1.innerText = window.sharedState.scores?.cat1Wins || 0;
      if (s2) s2.innerText = window.sharedState.scores?.cat2Wins || 0;
      if (st) st.innerText = window.sharedState.scores?.ties || 0;

      const l1 = document.getElementById('score-cat1-name-label');
      const l2 = document.getElementById('score-cat2-name-label');
      if (l1 && window.sharedState.nicknames) l1.innerText = window.sharedState.nicknames.cat1 || 'Camarada 1';
      if (l2 && window.sharedState.nicknames) l2.innerText = window.sharedState.nicknames.cat2 || 'Camarada 2';
    }
    window.checkStreakProgress = checkStreakProgress;

    /* 11. VALIDAÇÃO DIÁRIA DE PRESENÇA (NFC & CÓDIGOS) */
    function generateDailyCodeForRole(role, dateStr) {
      let hash = 0;
      const seed = `${dateStr}_${role}_jardim_cat_v2`;
      for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
      }
      return String(100000 + (Math.abs(hash) % 900000));
    }

    function copyMyDailyCode() {
      const today = getTodayDateString();
      const myRole = window.sharedState.myRole || 'cat1';
      const myCode = generateDailyCodeForRole(myRole, today);
      try {
        const temp = document.createElement('input');
        temp.value = myCode;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showBannerToast(`Código Estatal ${myCode} copiado! Envie ao seu Camarada ☭`);
      } catch(e) {
        showBannerToast(`Seu Código Estatal é: ${myCode}`);
      }
    }
    window.copyMyDailyCode = copyMyDailyCode;

    function submitPartnerDailyCode() {
      const input = document.getElementById('partner-sync-input');
      const enteredCode = (input?.value || '').trim();
      const today = getTodayDateString();
      const myRole = window.sharedState.myRole || 'cat1';
      const partnerRole = (myRole === 'cat1') ? 'cat2' : 'cat1';
      const expectedCode = generateDailyCodeForRole(partnerRole, today);

      if (enteredCode === expectedCode) {
        window.sharedState.presence.syncedToday = true;
        window.sharedState.presence.lastSyncedDate = today;
        window.sharedState.streak.current += 1;
        window.sharedState.streak.totalDays += 1;
        if (window.sharedState.streak.current > window.sharedState.streak.best) {
          window.sharedState.streak.best = window.sharedState.streak.current;
        }
        window.sharedState.wallets.cat1.coupleCoins += 1;
        window.sharedState.wallets.cat2.coupleCoins += 1;
        window.saveStateToCloud(true);
        createHeartsParticles(window.innerWidth / 2, window.innerHeight / 2, 20);
        showBannerToast(`Ponto do Sindicato validado! +1 Medalha do Partido ☭💖`);
        closeSyncModal();
        if (input) input.value = '';
      } else {
        showBannerToast(`Código de 6 dígitos inválido! Confira com seu Camarada ☭`);
      }
    }
    window.submitPartnerDailyCode = submitPartnerDailyCode;

    async function triggerWebNfcSync() {
      if ('NDEFReader' in window) {
        try {
          const ndef = new NDEFReader();
          await ndef.scan();
          showBannerToast(`Aproxime do aparelho do seu Camarada... 📡`);

          ndef.addEventListener("reading", () => {
            const today = getTodayDateString();
            window.sharedState.presence.syncedToday = true;
            window.sharedState.presence.lastSyncedDate = today;
            window.sharedState.streak.current += 1;
            window.sharedState.streak.totalDays += 1;
            window.sharedState.wallets.cat1.coupleCoins += 1;
            window.sharedState.wallets.cat2.coupleCoins += 1;
            window.saveStateToCloud(true);
            createHeartsParticles(window.innerWidth / 2, window.innerHeight / 2, 20);
            showBannerToast(`Ponto do Sindicato validado via NFC! +1 Medalha ☭💖`);
            closeSyncModal();
          });
        } catch (error) {
          showBannerToast(`NFC não iniciado: ${error.message}. Use o código de 6 dígitos!`);
        }
      } else {
        showBannerToast(`Web NFC não suportado neste aparelho. Use o Código de 6 dígitos abaixo! ☭`);
      }
    }
    window.triggerWebNfcSync = triggerWebNfcSync;

    function openSyncModal() {
      checkStreakProgress();
      const modal = document.getElementById('sync-modal');
      if (modal) modal.classList.remove('hidden');
    }
    window.openSyncModal = openSyncModal;

    function closeSyncModal() {
      const modal = document.getElementById('sync-modal');
      if (modal) modal.classList.add('hidden');
    }
    window.closeSyncModal = closeSyncModal;

    /* 12. SISTEMA DE TELEGRAMAS & RÁDIO PRAVDA */
    function openLetterModal() {
      closeFloatingChat();
      const modal = document.getElementById('letter-modal');
      if (modal) modal.classList.remove('hidden');
      renderLetterHistory();
    }
    window.openLetterModal = openLetterModal;

    function closeLetterModal() {
      const modal = document.getElementById('letter-modal');
      if (modal) modal.classList.add('hidden');
    }
    window.closeLetterModal = closeLetterModal;

    function toggleFloatingChat() {
      const c = document.getElementById('floating-chat-container');
      if (c) c.classList.toggle('hidden');
      updateFloatingPreviewText();
    }
    window.toggleFloatingChat = toggleFloatingChat;

    function closeFloatingChat() {
      const c = document.getElementById('floating-chat-container');
      if (c) c.classList.add('hidden');
    }
    window.closeFloatingChat = closeFloatingChat;

    function switchToFloatingChat() {
      closeLetterModal();
      toggleFloatingChat();
    }
    window.switchToFloatingChat = switchToFloatingChat;

    function updateFloatingPreviewText() {
      const p = document.getElementById('floating-recent-bubble');
      if (!p) return;
      const letters = window.sharedState?.letters || [];
      if (letters.length === 0) { p.innerText = "Nenhum telegrama recente no Comitê."; return; }
      const last = letters[letters.length - 1];
      p.innerText = `${last.from === window.sharedState.myRole ? 'Você' : 'Camarada'}: "${last.text}"`;
    }
    window.updateFloatingPreviewText = updateFloatingPreviewText;

    function sendLoveLetter() {
      const input = document.getElementById('chat-input-text');
      if (!input || !input.value.trim()) return;
      processLetterSend(input.value.trim());
      input.value = '';
    }
    window.sendLoveLetter = sendLoveLetter;

    function sendLoveLetterFromFloating() {
      const input = document.getElementById('floating-chat-input');
      if (!input || !input.value.trim()) return;
      processLetterSend(input.value.trim());
      input.value = '';
    }
    window.sendLoveLetterFromFloating = sendLoveLetterFromFloating;

    window.enableBrowserNotifications = async function() {
      const btn = document.getElementById('browser-notifications-btn');
      if (!('Notification' in window)) {
        showBannerToast('Este navegador não suporta alertas de telegrama. 💌');
        return;
      }
      if (Notification.permission === 'granted') {
        if (btn) btn.textContent = '🔔 Alertas Ativos';
        showBannerToast('Os alertas do Comitê já estão ativos! ☭💖');
        return;
      }
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          if (btn) btn.textContent = '🔔 Alertas Ativos';
          showBannerToast('Alertas ativados! Você será avisado quando chegar um telegrama. 💌');
        }
      } catch (error) {}
    };

    window.notifyIncomingLetter = function(letter) {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      const sender = window.sharedState?.nicknames?.[letter.from] ||
        (letter.from === 'cat1' ? 'Camarada 1' : 'Camarada 2');
      const notification = new Notification('💌 Novo Telegrama — União Felina ☭', {
        body: `${sender}: ${String(letter.text || '').slice(0, 140)}`,
        tag: `gatinhos-carta-${letter.id}`
      });
      notification.onclick = () => {
        window.focus();
        openLetterModal();
        notification.close();
      };
    };

    function processLetterSend(text) {
      const myRole = window.sharedState.myRole || 'cat1';
      const partner = myRole === 'cat1' ? 'cat2' : 'cat1';
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} • ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;

      if (!window.sharedState.letters) window.sharedState.letters = [];
      window.sharedState.letters.push({ id: Date.now(), from: myRole, text, time: timeStr });
      window.sharedState[partner].speech = `💌 "${text}"`;
      window.sharedState.loveScore = Math.min(100, (window.sharedState.loveScore || 85) + 3);

      renderLetterHistory();
      renderFullState();
      window.saveStateToCloud(true);
      createHeartsParticles(window.innerWidth / 2, window.innerHeight / 2, 14);
      showBannerToast("Telegrama despachado pelo Comitê! 💌☭");
    }

    function renderLetterHistory() {
      const container = document.getElementById('chat-messages-container');
      if (!container) return;
      const letters = window.sharedState?.letters || [];
      const myRole = window.sharedState?.myRole || 'cat1';
      container.innerHTML = '';

      letters.forEach(l => {
        const isMe = l.from === myRole;
        const row = document.createElement('div');
        row.className = `flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 w-full`;
        row.innerHTML = `
          <div class="p-3 rounded-2xl border-2 border-pencil text-xs sm:text-sm font-hand leading-relaxed shadow-sm max-w-[80%] ${isMe ? 'bg-amber-100 text-red-950' : 'bg-white text-pencil'}">
            <span class="text-[10px] font-bold block opacity-75">${isMe ? 'Você' : 'Seu Camarada'} • ${l.time || ''}</span>
            <p class="pt-1 text-sm">${l.text}</p>
          </div>
        `;
        container.appendChild(row);
      });
      container.scrollTop = container.scrollHeight;
      updateFloatingPreviewText();
    }
    window.renderLetterHistory = renderLetterHistory;

    function insertQuickMessageFloating(txt) {
      const input = document.getElementById('floating-chat-input');
      if (input) { input.value = txt; input.focus(); }
    }
    window.insertQuickMessageFloating = insertQuickMessageFloating;

    /* 13. AUTENTICAÇÃO E PERFIL DO COMITÊ */
    function toggleMyIdentity() {
      openLoginModal();
    }
    window.toggleMyIdentity = toggleMyIdentity;

    function openLoginModal() {
      const modal = document.getElementById('login-modal');
      if (modal) modal.classList.remove('hidden');
    }
    window.openLoginModal = openLoginModal;

    let selectedLoginTarget = 'cat1';
    function chooseProfileTarget(role) {
      selectedLoginTarget = role;
      const b1 = document.getElementById('login-card-cat1');
      const b2 = document.getElementById('login-card-cat2');
      if (b1) b1.className = role === 'cat1' ? 'p-3.5 rounded-2xl border-4 border-amber-500 bg-amber-50 flex flex-col items-center gap-2 shadow-md ring-2 ring-amber-300' : 'p-3.5 rounded-2xl border-2 border-pencil bg-white opacity-70 hover:opacity-100 flex flex-col items-center gap-2';
      if (b2) b2.className = role === 'cat2' ? 'p-3.5 rounded-2xl border-4 border-red-600 bg-red-50 flex flex-col items-center gap-2 shadow-md ring-2 ring-red-300' : 'p-3.5 rounded-2xl border-2 border-pencil bg-white opacity-70 hover:opacity-100 flex flex-col items-center gap-2';
    }
    window.chooseProfileTarget = chooseProfileTarget;

    function submitSecureLogin() {
      const nick = document.getElementById('login-nickname-input')?.value.trim() || (selectedLoginTarget === 'cat1' ? 'Camarada 1' : 'Camarada 2');

      window.sharedState.myRole = selectedLoginTarget;
      localStorage.setItem('casal_meu_gatinho', selectedLoginTarget);
      localStorage.setItem('casal_auth_token', 'valid_' + Date.now());

      if (!window.sharedState.nicknames) window.sharedState.nicknames = {};
      window.sharedState.nicknames[selectedLoginTarget] = nick;

      const modal = document.getElementById('login-modal');
      if (modal) modal.classList.add('hidden');

      renderFullState();
      window.saveStateToCloud(true);
      showBannerToast(`Saudações Proletárias, ${nick}! ☭🐾`);
    }
    window.submitSecureLogin = submitSecureLogin;

    function lockAndLogout() {
      localStorage.removeItem('casal_auth_token');
      openLoginModal();
    }
    window.lockAndLogout = lockAndLogout;

    /* 14. RENDERIZAÇÃO GERAL DOS CAMARADAS FELINOS */
    function renderFullState() {
      const state = window.sharedState;
      if (!state) return;

      const cat1Mount = document.getElementById('cat1-svg-mount');
      if (cat1Mount && state.cat1) {
        cat1Mount.innerHTML = generateCatSvg({ ...state.cat1, isFlipped: false });
      }

      const cat2Mount = document.getElementById('cat2-svg-mount');
      if (cat2Mount && state.cat2) {
        cat2Mount.innerHTML = generateCatSvg({ ...state.cat2, isFlipped: true });
      }

      const letters = state.letters || [];
      const lastCat1Received = [...letters].reverse().find(l => l.from === 'cat2');
      const lastCat2Received = [...letters].reverse().find(l => l.from === 'cat1');

      const speech1 = document.getElementById('speech-cat1');
      if (speech1) speech1.innerText = lastCat1Received ? `💌 "${lastCat1Received.text}"` : (state.cat1?.speech || 'Trabalhando pelo nosso amor... ☭🐾');

      const speech2 = document.getElementById('speech-cat2');
      if (speech2) speech2.innerText = lastCat2Received ? `💌 "${lastCat2Received.text}"` : (state.cat2?.speech || 'Esperando meu Camarada... ☭💖');

      if (document.getElementById('cat1-hunger-bar')) document.getElementById('cat1-hunger-bar').style.width = `${state.cat1?.hunger || 0}%`;
      if (document.getElementById('cat1-energy-bar')) document.getElementById('cat1-energy-bar').style.width = `${state.cat1?.energy || 0}%`;
      if (document.getElementById('cat1-happy-bar')) document.getElementById('cat1-happy-bar').style.width = `${state.cat1?.happiness || 0}%`;

      if (document.getElementById('cat2-hunger-bar')) document.getElementById('cat2-hunger-bar').style.width = `${state.cat2?.hunger || 0}%`;
      if (document.getElementById('cat2-energy-bar')) document.getElementById('cat2-energy-bar').style.width = `${state.cat2?.energy || 0}%`;
      if (document.getElementById('cat2-happy-bar')) document.getElementById('cat2-happy-bar').style.width = `${state.cat2?.happiness || 0}%`;

      if (document.getElementById('love-percent-text')) document.getElementById('love-percent-text').innerText = `${state.loveScore || 0}%`;
      if (document.getElementById('love-progress-bar')) document.getElementById('love-progress-bar').style.width = `${state.loveScore || 0}%`;

      const isMeCat1 = state.myRole === 'cat1';
      const myNick = (state.nicknames && state.nicknames[state.myRole]) || (isMeCat1 ? 'Camarada 1' : 'Camarada 2');
      const partnerRole = isMeCat1 ? 'cat2' : 'cat1';
      const partnerNick = (state.nicknames && state.nicknames[partnerRole]) || (isMeCat1 ? 'Camarada 2' : 'Camarada 1');

      if (document.getElementById('cat1-title-label')) document.getElementById('cat1-title-label').innerText = isMeCat1 ? myNick : partnerNick;
      if (document.getElementById('cat2-title-label')) document.getElementById('cat2-title-label').innerText = isMeCat1 ? partnerNick : myNick;
      if (document.getElementById('header-my-role-label')) document.getElementById('header-my-role-label').innerText = `${myNick} (Você)`;

      const pill = document.getElementById('letters-count-pill');
      if (pill) pill.innerText = (state.letters && state.letters.length) || 0;

      checkStreakProgress();
      updateWalletHeader();
    }
    window.renderFullState = renderFullState;

    function showBannerToast(text) {
      const banner = document.getElementById('interaction-banner');
      const textElem = document.getElementById('interaction-banner-text');
      if (textElem) textElem.innerText = text;
      if (banner) {
        banner.classList.remove('opacity-0');
        clearTimeout(window._bannerTimer);
        window._bannerTimer = setTimeout(() => banner.classList.add('opacity-0'), 2600);
      }
    }
    window.showBannerToast = showBannerToast;

    function handleCatPet(targetCat, event) {
      if (event) createHeartsParticles(event.clientX, event.clientY, 8);
      const cat = window.sharedState[targetCat];
      if (!cat) return;
      cat.happiness = Math.min(100, (cat.happiness || 0) + 5);
      cat.expression = 'pet';
      window.sharedState.loveScore = Math.min(100, (window.sharedState.loveScore || 0) + 1);

      showBannerToast(`${targetCat === 'cat1' ? 'Camarada 1' : 'Camarada 2'} recebeu carinho proletário! 😻☭`);
      window.saveStateToCloud();
      setTimeout(() => {
        cat.expression = 'happy';
        window.saveStateToCloud();
      }, 1000);
    }
    window.handleCatPet = handleCatPet;

    /* 15. PARTÍCULAS E INICIALIZAÇÃO VISUAL */
    const fxCanvas = document.getElementById('fx-canvas');
    const fxCtx = fxCanvas?.getContext('2d');
    const particles = [];

    function resizeFx() {
      if (fxCanvas) {
        fxCanvas.width = window.innerWidth;
        fxCanvas.height = window.innerHeight;
      }
    }
    window.addEventListener('resize', resizeFx);
    resizeFx();

    function createHeartsParticles(x, y, count = 8) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() * 30 - 15),
          y: y + (Math.random() * 20 - 10),
          vx: Math.random() * 2 - 1,
          vy: -(Math.random() * 2.5 + 1.2),
          size: Math.random() * 12 + 10,
          color: ['#dc2626', '#fbbf24', '#e63946', '#f59e0b'][Math.floor(Math.random() * 4)],
          alpha: 1,
          decay: Math.random() * 0.015 + 0.012
        });
      }
    }
    window.createHeartsParticles = createHeartsParticles;

    function renderParticlesLoop() {
      if (!fxCtx || !fxCanvas) return;
      fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        fxCtx.save();
        fxCtx.translate(p.x, p.y);
        fxCtx.globalAlpha = p.alpha;
        fxCtx.fillStyle = p.color;

        const topH = p.size * 0.3;
        fxCtx.beginPath();
        fxCtx.moveTo(0, topH);
        fxCtx.bezierCurveTo(0, 0, -p.size/2, 0, -p.size/2, topH);
        fxCtx.bezierCurveTo(-p.size/2, (p.size+topH)/2, 0, p.size, 0, p.size);
        fxCtx.bezierCurveTo(0, p.size, p.size/2, (p.size+topH)/2, p.size/2, topH);
        fxCtx.bezierCurveTo(p.size/2, 0, 0, 0, 0, topH);
        fxCtx.fill();
        fxCtx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) particles.splice(i, 1);
      }
      requestAnimationFrame(renderParticlesLoop);
    }
    renderParticlesLoop();

    // Renderiza os gatinhos imediatamente na inicialização
    renderFullState();
    renderBackpackSlots();
