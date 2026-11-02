// CÓPIA DE REFERÊNCIA: o módulo executado está inline em index.html.
// Isso mantém compatibilidade ao abrir o projeto diretamente via file://.

/* 2. PERSISTÊNCIA HIPER-ECONÔMICA NO FIRESTORE TESTE */
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
    let firstLettersSnapshot = true;

    let savedRole = localStorage.getItem('casal_meu_gatinho') || 'cat1';
    let myDeviceId = localStorage.getItem('casal_device_id');
    if (!myDeviceId) {
      myDeviceId = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('casal_device_id', myDeviceId);
    }
    window.myDeviceId = myDeviceId;

    const defaultState = {
      roomId: fixedRoomId,
      myRole: savedRole,
      roomPassword: '',
      loveScore: 85,
      lastStatsUpdateTime: Date.now(),
      nicknames: {
        cat1: 'Camarada 1',
        cat2: 'Camarada 2'
      },
      streak: {
        current: 1,
        best: 1,
        totalDays: 1,
        lastDailyDate: new Date().toDateString()
      },
      scores: {
        cat1Wins: 0,
        cat2Wins: 0,
        ties: 0
      },
      presence: {
        dailyKey: 'AMOR-CAT-2026',
        syncedToday: false,
        lastSyncedDate: ''
      },
      onlineRooms: {
        jokenpo: {
          p1InRoom: false,
          p2InRoom: false,
          p1Choice: '',
          p2Choice: '',
          state: 'waiting',
          winner: '',
          round: 1
        },
        reaction: {
          p1InRoom: false,
          p2InRoom: false,
          state: 'idle',
          targetTime: 0,
          winner: '',
          round: 1
        },
        tictactoe: {
          p1InRoom: false,
          p2InRoom: false,
          board: Array(9).fill(''),
          turn: 'cat1',
          winner: ''
        }
      },
      tictactoe: {
        board: Array(9).fill(''),
        turn: 'cat1',
        winner: ''
      },
      wallets: {
        cat1: { fish: 0, paws: 0, coupleCoins: 0 },
        cat2: { fish: 0, paws: 0, coupleCoins: 0 }
      },
      // Novo jogo começa sem alimentos no inventário.
      inventories: {
        cat1: {},
        cat2: {}
      },
      unlockedItems: {
        cat1: ["acc_none", "acc_star", "outfit_none", "outfit_red_dress", "outfit_red_gown", "outfit_red_sweater", "outfit_red_hoodie", "outfit_red_overalls", "outfit_red_cape", "breed_white", "mouth_cat", "pupil_round", "shape_almond"],
        cat2: ["acc_none", "acc_star", "outfit_none", "outfit_red_dress", "outfit_red_gown", "outfit_red_sweater", "outfit_red_hoodie", "outfit_red_overalls", "outfit_red_cape", "breed_white", "mouth_cat", "pupil_round", "shape_almond"]
      },
      lastRewardDates: { cat1: '', cat2: '' },
      cat1: {
        breed: 'white',
        outfit: 'none',
        outfitColor: '#e63946',
        accessory: 'none',
        accessoryColor: '#e76f51',
        expression: 'happy',
        eyeShape: 'almond',
        eyeColor: '#2b2725',
        pupil: 'round',
        pupilColor: '#ffffff',
        mouth: 'cat',
        hunger: 80,
        energy: 85,
        happiness: 90,
        speech: 'Ronronando baixinho... 🐾'
      },
      cat2: {
        breed: 'white',
        outfit: 'none',
        outfitColor: '#e63946',
        accessory: 'none',
        accessoryColor: '#e76f51',
        expression: 'happy',
        eyeShape: 'almond',
        eyeColor: '#2b2725',
        pupil: 'round',
        pupilColor: '#ffffff',
        mouth: 'cat',
        hunger: 80,
        energy: 85,
        happiness: 90,
        speech: 'Ronronando baixinho... 🐾'
      },
      letters: []
    };

    const KNOWN_FOOD_IDS = ['food_bread', 'food_milk', 'food_salmon', 'food_starfruit', 'food_steak', 'food_potion'];

    function sanitizeInventory(invObj) {
      if (!invObj || typeof invObj !== 'object') return {};
      const clean = {};
      Object.keys(invObj).forEach(k => {
        const qty = Number(invObj[k]);
        if (!isNaN(qty) && qty > 0) clean[k] = qty;
      });
      return clean;
    }
    window.sanitizeInventory = sanitizeInventory;

    function buildInventoryPayload(invObj) {
      const payload = {};
      const clean = sanitizeInventory(invObj);
      KNOWN_FOOD_IDS.forEach(foodId => {
        payload[foodId] = clean[foodId] !== undefined ? clean[foodId] : 0;
      });
      return payload;
    }
    window.buildInventoryPayload = buildInventoryPayload;

    function applyFastOfflineDecay() {
      const state = window.sharedState;
      if (!state) return;
      const now = Date.now();
      const lastUpdate = state.lastStatsUpdateTime || now;
      const elapsedMinutes = Math.floor((now - lastUpdate) / (1000 * 60));

      if (elapsedMinutes >= 1) {
        const hungerLoss = Math.floor(elapsedMinutes / 3);
        const happyLoss = Math.floor(elapsedMinutes / 5);
        const energyLoss = Math.floor(elapsedMinutes / 6);

        if (hungerLoss > 0 || happyLoss > 0) {
          ['cat1', 'cat2'].forEach(k => {
            if (state[k]) {
              state[k].hunger = Math.max(5, (state[k].hunger || 50) - hungerLoss);
              state[k].happiness = Math.max(5, (state[k].happiness || 50) - happyLoss);
              state[k].energy = Math.max(10, (state[k].energy || 50) - energyLoss);
              if (state[k].hunger <= 25) {
                state[k].speech = 'Camarada, preciso de ração estatal... 🐟🥺';
              }
            }
          });
          state.lastStatsUpdateTime = now;
          if (typeof window.saveStateToCloud === 'function') window.saveStateToCloud();
        }
      }
    }
    window.applyFastOfflineDecay = applyFastOfflineDecay;

    function loadLocalStateCache() {
      try {
        const cachedRaw = localStorage.getItem('casal_shared_state_cache');
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          return {
            ...defaultState,
            ...cached,
            myRole: savedRole,
            onlineRooms: { ...defaultState.onlineRooms, ...(cached.onlineRooms || {}) },
            wallets: { ...defaultState.wallets, ...(cached.wallets || {}) },
            inventories: {
              cat1: sanitizeInventory(cached.inventories?.cat1 !== undefined ? cached.inventories.cat1 : defaultState.inventories.cat1),
              cat2: sanitizeInventory(cached.inventories?.cat2 !== undefined ? cached.inventories.cat2 : defaultState.inventories.cat2)
            },
            cat1: { ...defaultState.cat1, ...(cached.cat1 || {}) },
            cat2: { ...defaultState.cat2, ...(cached.cat2 || {}) },
            letters: Array.isArray(cached.letters) ? cached.letters : []
          };
        }
      } catch (e) {}
      return { ...defaultState };
    }

    window.sharedState = loadLocalStateCache();

    window.saveStateToLocalCache = function() {
      try {
        localStorage.setItem('casal_shared_state_cache', JSON.stringify(window.sharedState));
      } catch(e) {}
    };

    window.getMyWallet = function() {
      const role = window.sharedState.myRole || 'cat1';
      if (!window.sharedState.wallets) window.sharedState.wallets = {};
      if (!window.sharedState.wallets[role]) window.sharedState.wallets[role] = { fish: 0, paws: 0, coupleCoins: 0 };
      return window.sharedState.wallets[role];
    };

    window.getMyInventory = function() {
      const role = window.sharedState.myRole || 'cat1';
      if (!window.sharedState.inventories) window.sharedState.inventories = {};
      window.sharedState.inventories[role] = sanitizeInventory(window.sharedState.inventories[role]);
      return window.sharedState.inventories[role];
    };

    window.getMyUnlockedItems = function() {
      const role = window.sharedState.myRole || 'cat1';
      if (!window.sharedState.unlockedItems) window.sharedState.unlockedItems = {};
      if (!window.sharedState.unlockedItems[role]) {
        window.sharedState.unlockedItems[role] = ["acc_none", "acc_star", "outfit_none", "outfit_red_dress", "outfit_red_gown", "outfit_red_sweater", "outfit_red_hoodie", "outfit_red_overalls", "outfit_red_cape", "breed_white", "mouth_cat", "pupil_round", "shape_almond"];
      }
      return window.sharedState.unlockedItems[role];
    };

    let db = null;
    async function initFirebaseSync() {
      const statusText = document.getElementById('cloud-sync-status-text');
      const statusDot = document.getElementById('cloud-sync-status-dot');

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

        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', fixedRoomId);

        onSnapshot(roomRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();

            // Notifica apenas cartas novas recebidas depois da primeira sincronização.
            const incomingLetters = firstLettersSnapshot
              ? []
              : (Array.isArray(data.letters) ? data.letters : []).filter(letter =>
                  letter && letter.from && letter.from !== (window.sharedState?.myRole || savedRole) &&
                  !(window.sharedState?.letters || []).some(old => String(old.id) === String(letter.id))
                );
            firstLettersSnapshot = false;

            window.sharedState = {
              ...window.sharedState,
              ...data,
              myRole: window.sharedState.myRole,
              onlineRooms: {
                jokenpo: { ...defaultState.onlineRooms.jokenpo, ...(data.onlineRooms?.jokenpo || {}) },
                reaction: { ...defaultState.onlineRooms.reaction, ...(data.onlineRooms?.reaction || {}) },
                tictactoe: { ...defaultState.onlineRooms.tictactoe, ...(data.onlineRooms?.tictactoe || {}) }
              },
              wallets: {
                cat1: { ...window.sharedState.wallets.cat1, ...(data.wallets?.cat1 || {}) },
                cat2: { ...window.sharedState.wallets.cat2, ...(data.wallets?.cat2 || {}) }
              },
              inventories: {
                cat1: sanitizeInventory(data.inventories?.cat1 !== undefined ? data.inventories.cat1 : window.sharedState.inventories.cat1),
                cat2: sanitizeInventory(data.inventories?.cat2 !== undefined ? data.inventories.cat2 : window.sharedState.inventories.cat2)
              },
              cat1: { ...window.sharedState.cat1, ...(data.cat1 || {}) },
              cat2: { ...window.sharedState.cat2, ...(data.cat2 || {}) },
              letters: Array.isArray(data.letters) ? data.letters : (window.sharedState.letters || [])
            };

            applyFastOfflineDecay();
            window.saveStateToLocalCache();
            if (statusText) statusText.innerText = "Satélite Sputnik Conectado ☁️";
            if (statusDot) statusDot.className = "w-2 h-2 rounded-full bg-emerald-500 inline-block";

            if (typeof window.renderFullState === 'function') window.renderFullState();
            if (typeof window.syncOnlineGameLobbies === 'function') window.syncOnlineGameLobbies();
            if (typeof window.renderTicTacToeBoard === 'function') window.renderTicTacToeBoard();
            if (typeof window.renderBackpackSlots === 'function') window.renderBackpackSlots();
            if (typeof window.updateWalletHeader === 'function') window.updateWalletHeader();
            if (typeof window.renderLetterHistory === 'function') window.renderLetterHistory();
            if (typeof window.updateFloatingPreviewText === 'function') window.updateFloatingPreviewText();
            incomingLetters.forEach(letter => {
              if (typeof window.notifyIncomingLetter === 'function') window.notifyIncomingLetter(letter);
            });
          } else {
            window.saveStateToCloud(true);
          }
        }, (err) => {
          if (statusText) statusText.innerText = "Bunker Local Seguro 🛡️";
          if (statusDot) statusDot.className = "w-2 h-2 rounded-full bg-amber-500 inline-block";
        });
      } catch(err) {
        if (statusText) statusText.innerText = "Bunker Local Seguro 🛡️";
      }
    }

    let cloudSaveTimeout = null;
    window.saveStateToCloud = function(immediate = false) {
      if (typeof window.renderFullState === 'function') window.renderFullState();
      if (typeof window.updateWalletHeader === 'function') window.updateWalletHeader();
      window.saveStateToLocalCache();

      if (!db) return;
      if (immediate) {
        if (cloudSaveTimeout) clearTimeout(cloudSaveTimeout);
        executeCloudSave();
      } else {
        if (!cloudSaveTimeout) {
          cloudSaveTimeout = setTimeout(() => {
            cloudSaveTimeout = null;
            executeCloudSave();
          }, 1200);
        }
      }
    };

    async function executeCloudSave() {
      if (!db) return;
      try {
        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', fixedRoomId);
        await setDoc(roomRef, {
          roomPassword: window.sharedState.roomPassword || '',
          cat1: window.sharedState.cat1,
          cat2: window.sharedState.cat2,
          loveScore: window.sharedState.loveScore,
          nicknames: window.sharedState.nicknames,
          streak: window.sharedState.streak,
          scores: window.sharedState.scores,
          presence: window.sharedState.presence,
          onlineRooms: window.sharedState.onlineRooms,
          tictactoe: window.sharedState.tictactoe,
          wallets: window.sharedState.wallets,
          inventories: {
            cat1: buildInventoryPayload(window.sharedState.inventories?.cat1),
            cat2: buildInventoryPayload(window.sharedState.inventories?.cat2)
          },
          unlockedItems: window.sharedState.unlockedItems,
          lastRewardDates: window.sharedState.lastRewardDates || {},
          letters: window.sharedState.letters || [],
          lastStatsUpdateTime: window.sharedState.lastStatsUpdateTime || Date.now(),
          updatedAt: Date.now()
        }, { merge: true });
      } catch(e) {}
    }

    window.addEventListener('DOMContentLoaded', () => {
      applyFastOfflineDecay();
      if (typeof window.updateWalletHeader === 'function') window.updateWalletHeader();
      if (typeof window.renderFullState === 'function') window.renderFullState();
      if (typeof window.renderBackpackSlots === 'function') window.renderBackpackSlots();
      if (typeof window.checkStreakProgress === 'function') window.checkStreakProgress();
      if (typeof window.renderLetterHistory === 'function') window.renderLetterHistory();
      if (typeof window.updateFloatingPreviewText === 'function') window.updateFloatingPreviewText();

      initFirebaseSync();

      const authToken = localStorage.getItem('casal_auth_token');
      if (!authToken) {
        if (typeof window.openLoginModal === 'function') window.openLoginModal();
      }

      const chatInput = document.getElementById('chat-input-text');
      if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendLoveLetter();
          }
        });
      }

      const floatingInput = document.getElementById('floating-chat-input');
      if (floatingInput) {
        floatingInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendLoveLetterFromFloating();
          }
        });
      }
    });
