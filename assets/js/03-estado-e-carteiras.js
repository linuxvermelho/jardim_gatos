/* GARANTIA SÍNCRONA DE ESTADO E CARTEIRAS (FALLBACK IMEDIATO ANTES DO MÓDULO CARREGAR) */
    if (!window.sharedState) {
      const savedRoleSync = localStorage.getItem('casal_meu_gatinho') || 'cat1';
      window.sharedState = {
        roomId: 'ninho_de_amor_fixo',
        myRole: savedRoleSync,
        roomPassword: '',
        loveScore: 85,
        lastStatsUpdateTime: Date.now(),
        nicknames: { cat1: 'Camarada 1', cat2: 'Camarada 2' },
        streak: { current: 1, best: 1, totalDays: 1, lastDailyDate: new Date().toDateString() },
        scores: { cat1Wins: 0, cat2Wins: 0, ties: 0 },
        presence: { dailyKey: 'AMOR-CAT-2026', syncedToday: false, lastSyncedDate: '' },
        onlineRooms: {
          jokenpo: { p1InRoom: false, p2InRoom: false, p1Choice: '', p2Choice: '', state: 'waiting', winner: '', round: 1 },
          reaction: { p1InRoom: false, p2InRoom: false, state: 'idle', targetTime: 0, winner: '', round: 1 },
          tictactoe: { p1InRoom: false, p2InRoom: false, board: Array(9).fill(''), turn: 'cat1', winner: '' }
        },
        tictactoe: { board: Array(9).fill(''), turn: 'cat1', winner: '' },
        wallets: {
          cat1: { fish: 0, paws: 0, coupleCoins: 0 },
          cat2: { fish: 0, paws: 0, coupleCoins: 0 }
        },
        inventories: { cat1: {}, cat2: {} },
        unlockedItems: {
          cat1: ["acc_none", "acc_star", "outfit_none", "outfit_red_dress", "outfit_red_gown", "outfit_red_sweater", "outfit_red_hoodie", "outfit_red_overalls", "outfit_red_cape", "breed_white", "mouth_cat", "pupil_round", "shape_almond"],
          cat2: ["acc_none", "acc_star", "outfit_none", "outfit_red_dress", "outfit_red_gown", "outfit_red_sweater", "outfit_red_hoodie", "outfit_red_overalls", "outfit_red_cape", "breed_white", "mouth_cat", "pupil_round", "shape_almond"]
        },
        lastRewardDates: { cat1: '', cat2: '' },
        cat1: {
          breed: 'white', outfit: 'none', outfitColor: '#e63946', accessory: 'none', accessoryColor: '#e76f51',
          expression: 'happy', eyeShape: 'almond', eyeColor: '#2b2725', pupil: 'round', pupilColor: '#ffffff',
          mouth: 'cat', hunger: 80, energy: 85, happiness: 90, speech: 'Trabalhando pelo nosso amor... ☭🐾'
        },
        cat2: {
          breed: 'white', outfit: 'none', outfitColor: '#e63946', accessory: 'none', accessoryColor: '#e76f51',
          expression: 'happy', eyeShape: 'almond', eyeColor: '#2b2725', pupil: 'round', pupilColor: '#ffffff',
          mouth: 'cat', hunger: 80, energy: 85, happiness: 90, speech: 'Esperando meu Camarada... ☭💖'
        },
        letters: []
      };
    }

    if (typeof window.getMyWallet !== 'function') {
      window.getMyWallet = function() {
        const role = (window.sharedState && window.sharedState.myRole) || 'cat1';
        if (!window.sharedState.wallets) window.sharedState.wallets = {};
        if (!window.sharedState.wallets[role]) window.sharedState.wallets[role] = { fish: 0, paws: 0, coupleCoins: 0 };
        return window.sharedState.wallets[role];
      };
    }

    if (typeof window.getMyInventory !== 'function') {
      window.getMyInventory = function() {
        const role = (window.sharedState && window.sharedState.myRole) || 'cat1';
        if (!window.sharedState.inventories) window.sharedState.inventories = {};
        if (!window.sharedState.inventories[role]) window.sharedState.inventories[role] = {};
        return window.sharedState.inventories[role];
      };
    }

    if (typeof window.getMyUnlockedItems !== 'function') {
      window.getMyUnlockedItems = function() {
        const role = (window.sharedState && window.sharedState.myRole) || 'cat1';
        if (!window.sharedState.unlockedItems) window.sharedState.unlockedItems = {};
        if (!window.sharedState.unlockedItems[role]) {
          window.sharedState.unlockedItems[role] = ["acc_none", "acc_star", "outfit_none", "outfit_red_dress", "outfit_red_gown", "outfit_red_sweater", "outfit_red_hoodie", "outfit_red_overalls", "outfit_red_cape", "breed_white", "mouth_cat", "pupil_round", "shape_almond"];
        }
        return window.sharedState.unlockedItems[role];
      };
    }

    if (typeof window.saveStateToCloud !== 'function') {
      window.saveStateToCloud = function() {
        try {
          localStorage.setItem('casal_shared_state_cache', JSON.stringify(window.sharedState));
        } catch(e) {}
        if (typeof window.renderFullState === 'function') window.renderFullState();
        if (typeof window.updateWalletHeader === 'function') window.updateWalletHeader();
      };
    }

    /* 3. ECONOMIA PLANIFICADA, COOPERATIVA E ALIMENTAÇÃO */
    const FOOD_ITEMS = [
      { id: 'food_bread', name: 'Pão do Povo', icon: '🍞', price: 12, hunger: 20, joy: 5 },
      { id: 'food_milk', name: 'Leite Coletivizado', icon: '🥛', price: 18, hunger: 22, joy: 8 },
      { id: 'food_salmon', name: 'Salmão do Báltico', icon: '🐟', price: 30, hunger: 35, joy: 15 },
      { id: 'food_starfruit', name: 'Estrela Vermelha', icon: '⭐', price: 25, hunger: 25, joy: 10 },
      { id: 'food_steak', name: 'Banquete do Politburo', icon: '🥩', price: 50, hunger: 45, joy: 20 },
      { id: 'food_potion', name: 'Elixir Bolchevique', icon: '🧪', price: 80, hunger: 30, joy: 30 }
    ];

    function updateWalletHeader() {
      const wallet = window.getMyWallet();
      const fDisplay = document.getElementById('wallet-fish-display');
      const pDisplay = document.getElementById('wallet-paws-display');
      const cDisplay = document.getElementById('wallet-couple-display');
      if (fDisplay) fDisplay.innerText = wallet.fish;
      if (pDisplay) pDisplay.innerText = wallet.paws;
      if (cDisplay) cDisplay.innerText = wallet.coupleCoins;
    }
    window.updateWalletHeader = updateWalletHeader;

    function getTodayDateString() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    window.getTodayDateString = getTodayDateString;

    function isPresenceSyncedToday() {
      const today = getTodayDateString();
      return !!(window.sharedState && window.sharedState.presence && window.sharedState.presence.syncedToday && window.sharedState.presence.lastSyncedDate === today);
    }
    window.isPresenceSyncedToday = isPresenceSyncedToday;

    function claimDailyRewardManual() {
      const today = new Date().toDateString();
      const role = window.sharedState.myRole;
      if (!window.sharedState.lastRewardDates) window.sharedState.lastRewardDates = {};

      if (window.sharedState.lastRewardDates[role] === today) {
        showBannerToast("Você já retirou sua cota de Peixe do Estado hoje! Volte amanhã ☭🐾");
        return;
      }

      window.sharedState.lastRewardDates[role] = today;
      const wallet = window.getMyWallet();
      wallet.fish += 1;
      window.saveStateToCloud(true);
      createHeartsParticles(window.innerWidth / 2, window.innerHeight / 2, 10);
      showBannerToast("🎁 +1 Peixe do Estado distribuído pelo Comitê!");
    }
    window.claimDailyRewardManual = claimDailyRewardManual;

    function toggleBackpack() {
      const drawer = document.getElementById('backpack-drawer');
      if (drawer) {
        drawer.classList.toggle('hidden');
        renderBackpackSlots();
      }
    }
    window.toggleBackpack = toggleBackpack;

    let selectedFoodForFeeding = null;

    function openFeedChooser(foodKey) {
      selectedFoodForFeeding = foodKey;
      const container = document.getElementById('feed-action-bar-container');
      const food = FOOD_ITEMS.find(f => f.id === foodKey);
      if (!container || !food) return;

      const nick1 = (window.sharedState.nicknames && window.sharedState.nicknames.cat1) || 'Camarada 1';
      const nick2 = (window.sharedState.nicknames && window.sharedState.nicknames.cat2) || 'Camarada 2';

      container.innerHTML = `
        <div id="feed-action-bar" class="w-full bg-[#450a0a] border-2 border-[#fde68a] rounded-xl p-2.5 my-2 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-lg">
          <div class="flex items-center gap-2">
            <span class="text-3xl">${food.icon}</span>
            <div class="text-left">
              <span class="text-xs font-bold text-[#fde68a] block">Distribuir ${food.name}:</span>
              <span class="text-[10px] text-amber-200/80">Escolha qual Camarada receberá a ração!</span>
            </div>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button onclick="feedCatWithItem('cat1', '${foodKey}');" class="sketch-btn flex-1 sm:flex-none bg-amber-400 hover:bg-amber-500 text-red-950 font-bold text-xs px-3 py-1.5 rounded-xl shadow">
              ⭐ ${nick1}
            </button>
            <button onclick="feedCatWithItem('cat2', '${foodKey}');" class="sketch-btn flex-1 sm:flex-none bg-red-600 hover:bg-red-500 text-amber-100 font-bold text-xs px-3 py-1.5 rounded-xl shadow">
              🚩 ${nick2}
            </button>
            <button onclick="closeFeedChooser();" class="text-xs text-amber-200 hover:text-white px-2 py-1 font-bold">
              ✕
            </button>
          </div>
        </div>
      `;
      renderBackpackSlots();
    }
    window.openFeedChooser = openFeedChooser;

    function closeFeedChooser() {
      selectedFoodForFeeding = null;
      const container = document.getElementById('feed-action-bar-container');
      if (container) container.innerHTML = '';
      renderBackpackSlots();
    }
    window.closeFeedChooser = closeFeedChooser;

    function handleCatInteraction(targetCat, event) {
      if (selectedFoodForFeeding) {
        const foodKey = selectedFoodForFeeding;
        feedCatWithItem(targetCat, foodKey);
      } else {
        handleCatPet(targetCat, event);
      }
    }
    window.handleCatInteraction = handleCatInteraction;

    function handleCatDragOver(event) {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }
      const dropTarget = event.currentTarget;
      if (dropTarget) dropTarget.classList.add('drag-over');
    }
    window.handleCatDragOver = handleCatDragOver;

    function handleCatDragLeave(event) {
      const dropTarget = event.currentTarget;
      if (dropTarget) dropTarget.classList.remove('drag-over');
    }
    window.handleCatDragLeave = handleCatDragLeave;

    function handleCatDrop(targetCat, event) {
      event.preventDefault();
      event.stopPropagation();
      document.querySelectorAll('.cat-drop-target, #cat1-container-box, #cat2-container-box').forEach(el => el.classList.remove('drag-over'));
      
      let foodKey = null;
      if (event.dataTransfer) {
        foodKey = event.dataTransfer.getData('text/plain') || event.dataTransfer.getData('foodKey');
      }
      if (!foodKey && selectedFoodForFeeding) {
        foodKey = selectedFoodForFeeding;
      }
      if (foodKey) {
        feedCatWithItem(targetCat, foodKey);
      }
    }
    window.handleCatDrop = handleCatDrop;

    let touchGhostEl = null;
    let touchDraggingFoodKey = null;

    function renderBackpackSlots() {
      const container = document.getElementById('backpack-slots-container');
      if (!container) return;
      container.innerHTML = '';

      const inv = window.getMyInventory();
      Object.keys(inv).forEach(k => {
        if (!inv[k] || Number(inv[k]) <= 0) delete inv[k];
      });
      const keys = Object.keys(inv).filter(k => Number(inv[k]) > 0);

      if (keys.length === 0) {
        container.innerHTML = `<span class="text-xs text-amber-200/80 p-2">Armazém Coletivo vazio! Requisite rações na Cooperativa Estatal 🏪☭</span>`;
        return;
      }

      keys.forEach(key => {
        const item = FOOD_ITEMS.find(f => f.id === key);
        if (!item) return;

        const isSelected = selectedFoodForFeeding === key;
        const slot = document.createElement('div');
        slot.className = `touch-drag-item flex-shrink-0 w-16 h-16 bg-[#881b1b] border-2 ${isSelected ? 'border-amber-300 ring-4 ring-amber-300/80 scale-105' : 'border-[#fde68a]'} rounded-xl flex flex-col items-center justify-center relative cursor-grab active:cursor-grabbing select-none hover:scale-105 transition-all shadow-md`;
        slot.draggable = true;
        slot.style.touchAction = 'none';
        slot.title = `${item.name} (Toque para escolher qual Camarada alimentar ou arraste)`;
        slot.innerHTML = `
          <span class="text-2xl pointer-events-none">${item.icon}</span>
          <span class="absolute bottom-1 right-1 text-[10px] bg-[#450a0a] text-[#fde68a] px-1 rounded-md font-bold pointer-events-none">${inv[key]}</span>
        `;

        slot.addEventListener('click', (e) => {
          e.stopPropagation();
          if (selectedFoodForFeeding === key) {
            closeFeedChooser();
          } else {
            openFeedChooser(key);
          }
        });

        slot.addEventListener('dragstart', (e) => {
          if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', key);
            e.dataTransfer.setData('foodKey', key);
            e.dataTransfer.effectAllowed = 'copyMove';
          }
          selectedFoodForFeeding = key;
          slot.classList.add('opacity-40');
        });

        slot.addEventListener('dragend', () => {
          slot.classList.remove('opacity-40');
          document.querySelectorAll('.cat-drop-target, #cat1-container-box, #cat2-container-box').forEach(el => el.classList.remove('drag-over'));
        });

        slot.addEventListener('touchstart', (e) => {
          touchDraggingFoodKey = key;
          selectedFoodForFeeding = key;
          const touch = e.touches[0];
          if (touchGhostEl) touchGhostEl.remove();
          touchGhostEl = document.createElement('div');
          touchGhostEl.className = 'fixed pointer-events-none z-[999] text-4xl transform -translate-x-1/2 -translate-y-1/2 drop-shadow-xl animate-bounce';
          touchGhostEl.innerText = item.icon;
          touchGhostEl.style.left = `${touch.clientX}px`;
          touchGhostEl.style.top = `${touch.clientY}px`;
          document.body.appendChild(touchGhostEl);
        }, { passive: true });

        slot.addEventListener('touchmove', (e) => {
          if (!touchGhostEl) return;
          const touch = e.touches[0];
          touchGhostEl.style.left = `${touch.clientX}px`;
          touchGhostEl.style.top = `${touch.clientY}px`;

          const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
          const isOverCat1 = !!(targetEl?.closest('#cat1-drop-area') || targetEl?.closest('#cat1-container-box'));
          const isOverCat2 = !!(targetEl?.closest('#cat2-drop-area') || targetEl?.closest('#cat2-container-box'));

          document.getElementById('cat1-drop-area')?.classList.toggle('drag-over', isOverCat1);
          document.getElementById('cat2-drop-area')?.classList.toggle('drag-over', isOverCat2);
          document.getElementById('cat1-container-box')?.classList.toggle('drag-over', isOverCat1);
          document.getElementById('cat2-container-box')?.classList.toggle('drag-over', isOverCat2);

          if (e.cancelable) e.preventDefault();
        }, { passive: false });

        slot.addEventListener('touchend', (e) => {
          if (touchGhostEl) {
            touchGhostEl.remove();
            touchGhostEl = null;
          }
          document.querySelectorAll('.cat-drop-target, #cat1-container-box, #cat2-container-box').forEach(el => el.classList.remove('drag-over'));

          const touch = e.changedTouches[0];
          const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
          const droppedCat1 = targetEl?.closest('#cat1-drop-area') || targetEl?.closest('#cat1-container-box');
          const droppedCat2 = targetEl?.closest('#cat2-drop-area') || targetEl?.closest('#cat2-container-box');

          if (droppedCat1 && touchDraggingFoodKey) {
            feedCatWithItem('cat1', touchDraggingFoodKey);
          } else if (droppedCat2 && touchDraggingFoodKey) {
            feedCatWithItem('cat2', touchDraggingFoodKey);
          }
          touchDraggingFoodKey = null;
        });

        container.appendChild(slot);
      });
    }
    window.renderBackpackSlots = renderBackpackSlots;

    function feedCatWithItem(targetCat, foodKey) {
      const myRole = window.sharedState.myRole || 'cat1';
      const inv = window.getMyInventory();
      const currentQty = Number(inv[foodKey] || 0);

      if (currentQty <= 0) {
        delete inv[foodKey];
        if (window.sharedState.inventories && window.sharedState.inventories[myRole]) {
          delete window.sharedState.inventories[myRole][foodKey];
        }
        closeFeedChooser();
        renderBackpackSlots();
        return;
      }

      const food = FOOD_ITEMS.find(f => f.id === foodKey);
      if (!food) return;

      const remaining = currentQty - 1;
      if (remaining <= 0) {
        delete inv[foodKey];
        if (window.sharedState.inventories && window.sharedState.inventories[myRole]) {
          delete window.sharedState.inventories[myRole][foodKey];
        }
      } else {
        inv[foodKey] = remaining;
        if (window.sharedState.inventories && window.sharedState.inventories[myRole]) {
          window.sharedState.inventories[myRole][foodKey] = remaining;
        }
      }

      const cat = window.sharedState[targetCat];
      if (cat) {
        cat.hunger = Math.min(100, (cat.hunger || 0) + food.hunger);
        cat.happiness = Math.min(100, (cat.happiness || 0) + food.joy);
        cat.energy = Math.min(100, (cat.energy || 0) + 12);
        cat.expression = 'pet';

        const isFeedingPartner = (targetCat !== myRole);
        const targetNick = (window.sharedState.nicknames && window.sharedState.nicknames[targetCat]) || (targetCat === 'cat1' ? 'Camarada 1' : 'Camarada 2');

        if (isFeedingPartner) {
          cat.speech = `Viva! Meu Camarada dividiu ${food.name} comigo! ☭💖😋`;
          window.sharedState.loveScore = Math.min(100, (window.sharedState.loveScore || 85) + 4);
          showBannerToast(`Solidariedade de classe! Você alimentou ${targetNick}! +4% ☭`);
        } else {
          cat.speech = `Huum! Ração estatal de primeira: ${food.name}! 😻⭐`;
          window.sharedState.loveScore = Math.min(100, (window.sharedState.loveScore || 85) + 1);
          showBannerToast(`${targetNick} saboreou ${food.name}! ${food.icon}`);
        }

        setTimeout(() => {
          if (cat) cat.expression = 'happy';
          if (typeof window.renderFullState === 'function') window.renderFullState();
        }, 1200);
      }

      createHeartsParticles(window.innerWidth / 2, window.innerHeight / 2, 14);
      closeFeedChooser();
      renderBackpackSlots();
      if (typeof window.renderFullState === 'function') window.renderFullState();
      window.saveStateToCloud(true);
    }
    window.feedCatWithItem = feedCatWithItem;


    function openFoodStallModal() {
      const modal = document.getElementById('food-stall-modal');
      if (!modal) return;
      const grid = document.getElementById('stall-goods-grid');
      const wallet = window.getMyWallet();
      const pCount = document.getElementById('stall-paws-count');
      if (pCount) pCount.innerText = `${wallet.paws} 🐾`;
      if (grid) {
        grid.innerHTML = '';
        FOOD_ITEMS.forEach(f => {
          const card = document.createElement('div');
          card.className = 'bg-white p-2.5 rounded-xl border-2 border-pencil text-center flex flex-col items-center justify-between shadow-sm';
          card.innerHTML = `
            <span class="text-3xl">${f.icon}</span>
            <span class="text-xs font-bold mt-1 text-red-950">${f.name}</span>
            <span class="text-[11px] text-red-700 font-bold mb-1.5">${f.price} 🐾</span>
            <button onclick="buyFoodFromStall('${f.id}')" class="sketch-btn w-full bg-amber-200 hover:bg-amber-300 text-red-950 text-xs py-1 rounded-lg font-bold">
              Requisitar
            </button>
          `;
          grid.appendChild(card);
        });
      }
      modal.classList.remove('hidden');
    }
    window.openFoodStallModal = openFoodStallModal;

    function closeFoodStallModal() {
      const modal = document.getElementById('food-stall-modal');
      if (modal) modal.classList.add('hidden');
    }
    window.closeFoodStallModal = closeFoodStallModal;

    function buyFoodFromStall(foodId) {
      const food = FOOD_ITEMS.find(f => f.id === foodId);
      if (!food) return;

      const wallet = window.getMyWallet();
      const inv = window.getMyInventory();

      if (wallet.paws >= food.price) {
        wallet.paws -= food.price;
        inv[foodId] = (Number(inv[foodId]) || 0) + 1;
        window.saveStateToCloud(true);

        const stallPaws = document.getElementById('stall-paws-count');
        if (stallPaws) stallPaws.innerText = `${wallet.paws} 🐾`;
        renderBackpackSlots();
        createHeartsParticles(window.innerWidth / 2, window.innerHeight / 2, 6);
        showBannerToast(`${food.name} enviado ao Armazém Coletivo! 🎒☭`);
      } else {
        showBannerToast(`Rublos Felinos insuficientes! Disputem as Olimpíadas Soviéticas 🎮`);
      }
    }
    window.buyFoodFromStall = buyFoodFromStall;
