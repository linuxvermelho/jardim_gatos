/* 5. JOKENPÔ PROLETÁRIO */
    let jokenpoMode = 'online';
    let jokenpoForGameTurn = false;
    let jkpP1Choice = null;
    let jkpP2Choice = null;
    let jkpRoundFinished = false;

    function getCatPawGestureSvg(gesture, size = 36) {
      if (gesture === 'rock') {
        return `
          <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="drop-shadow-sm select-none">
            <ellipse cx="50" cy="58" rx="28" ry="24" fill="#faf0e6" stroke="#2b1111" stroke-width="3.5"/>
            <ellipse cx="32" cy="40" rx="9" ry="11" fill="#faf0e6" stroke="#2b1111" stroke-width="3"/>
            <ellipse cx="45" cy="34" rx="9" ry="12" fill="#faf0e6" stroke="#2b1111" stroke-width="3"/>
            <ellipse cx="58" cy="34" rx="9" ry="12" fill="#faf0e6" stroke="#2b1111" stroke-width="3"/>
            <ellipse cx="70" cy="40" rx="9" ry="11" fill="#faf0e6" stroke="#2b1111" stroke-width="3"/>
            <path d="M 38,55 Q 50,62 62,55" fill="none" stroke="#2b1111" stroke-width="3" stroke-linecap="round"/>
            <circle cx="50" cy="65" r="4.5" fill="#b91c1c" opacity="0.75"/>
          </svg>
        `;
      } else if (gesture === 'paper') {
        return `
          <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="drop-shadow-sm select-none">
            <ellipse cx="50" cy="60" rx="30" ry="26" fill="#faf0e6" stroke="#2b1111" stroke-width="3.5"/>
            <circle cx="28" cy="32" r="10" fill="#faf0e6" stroke="#2b1111" stroke-width="3"/>
            <circle cx="43" cy="24" r="10.5" fill="#faf0e6" stroke="#2b1111" stroke-width="3"/>
            <circle cx="57" cy="24" r="10.5" fill="#faf0e6" stroke="#2b1111" stroke-width="3"/>
            <circle cx="72" cy="32" r="10" fill="#faf0e6" stroke="#2b1111" stroke-width="3"/>
            <circle cx="28" cy="33" r="6" fill="#ef4444"/>
            <circle cx="43" cy="25" r="6.5" fill="#ef4444"/>
            <circle cx="57" cy="25" r="6.5" fill="#ef4444"/>
            <circle cx="72" cy="33" r="6" fill="#ef4444"/>
            <path d="M 38,62 C 38,54 44,52 50,56 C 56,52 62,54 62,62 C 62,72 50,78 50,78 C 50,78 38,72 38,62 Z" fill="#b91c1c" stroke="#2b1111" stroke-width="1.8"/>
          </svg>
        `;
      } else {
        return `
          <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="drop-shadow-sm select-none">
            <ellipse cx="50" cy="65" rx="26" ry="22" fill="#faf0e6" stroke="#2b1111" stroke-width="3.5"/>
            <path d="M 36,55 L 34,26 C 34,22 42,22 42,26 L 42,52" fill="#faf0e6" stroke="#2b1111" stroke-width="3" stroke-linejoin="round"/>
            <path d="M 64,55 L 66,26 C 66,22 58,22 58,26 L 58,52" fill="#faf0e6" stroke="#2b1111" stroke-width="3" stroke-linejoin="round"/>
            <path d="M 36,25 Q 38,10 32,6 Q 42,12 40,25 Z" fill="#ffffff" stroke="#2b1111" stroke-width="2"/>
            <path d="M 64,25 Q 62,10 68,6 Q 58,12 60,25 Z" fill="#ffffff" stroke="#2b1111" stroke-width="2"/>
            <circle cx="26" cy="58" r="8" fill="#faf0e6" stroke="#2b1111" stroke-width="2.5"/>
            <circle cx="74" cy="58" r="8" fill="#faf0e6" stroke="#2b1111" stroke-width="2.5"/>
          </svg>
        `;
      }
    }

    function openJokenpoModal(mode = 'online', forGameTurn = false) {
      closeGamesHubModal();
      jokenpoMode = mode;
      jokenpoForGameTurn = forGameTurn;

      if ((mode === 'online' || mode === 'local') && !isPresenceSyncedToday()) {
        showBannerToast("Disputa bloqueada! Batam o Ponto do Sindicato hoje para liberar! 🔒☭");
      }

      selectJokenpoMode(mode);

      const rEl = document.getElementById('svg-paw-rock-my');
      const paEl = document.getElementById('svg-paw-paper-my');
      const sEl = document.getElementById('svg-paw-scissors-my');
      if (rEl) rEl.innerHTML = getCatPawGestureSvg('rock', 34);
      if (paEl) paEl.innerHTML = getCatPawGestureSvg('paper', 34);
      if (sEl) sEl.innerHTML = getCatPawGestureSvg('scissors', 34);

      const c1Box = document.getElementById('jkp-cat1-svg-box');
      const c2Box = document.getElementById('jkp-cat2-svg-box');
      if (c1Box) c1Box.innerHTML = generateCatSvg({ ...window.sharedState.cat1, expression: 'happy', isFlipped: false });
      if (c2Box) c2Box.innerHTML = generateCatSvg({ ...window.sharedState.cat2, expression: 'happy', isFlipped: true });

      if (mode === 'online') {
        const myRole = window.sharedState.myRole || 'cat1';
        if (!window.sharedState.onlineRooms) window.sharedState.onlineRooms = {};
        if (!window.sharedState.onlineRooms.jokenpo) window.sharedState.onlineRooms.jokenpo = {};
        if (myRole === 'cat1') window.sharedState.onlineRooms.jokenpo.p1InRoom = true;
        else window.sharedState.onlineRooms.jokenpo.p2InRoom = true;
        window.saveStateToCloud();
      }

      resetJokenpoMatch();
      const modal = document.getElementById('jokenpo-modal');
      if (modal) modal.classList.remove('hidden');
    }
    window.openJokenpoModal = openJokenpoModal;

    function closeJokenpoModal() {
      if (jokenpoMode === 'online') {
        const myRole = window.sharedState.myRole || 'cat1';
        if (window.sharedState.onlineRooms?.jokenpo) {
          if (myRole === 'cat1') window.sharedState.onlineRooms.jokenpo.p1InRoom = false;
          else window.sharedState.onlineRooms.jokenpo.p2InRoom = false;
          window.saveStateToCloud();
        }
      }
      const modal = document.getElementById('jokenpo-modal');
      if (modal) modal.classList.add('hidden');
    }
    window.closeJokenpoModal = closeJokenpoModal;

    function selectJokenpoMode(mode) {
      jokenpoMode = mode;
      const tabOnline = document.getElementById('jokenpo-tab-online');
      const tabLocal = document.getElementById('jokenpo-tab-local');
      const tabBot = document.getElementById('jokenpo-tab-bot');
      const p2Controls = document.getElementById('jkp-p2-controls-container');
      const myControlsTitle = document.getElementById('jkp-my-controls-title');

      if (tabOnline) tabOnline.className = mode === 'online' ? 'px-2.5 py-1 rounded-lg bg-amber-300 border border-pencil text-stone-900 shadow-sm font-bold' : 'px-2.5 py-1 rounded-lg bg-white border border-pencil text-stone-700 hover:bg-stone-50 font-normal';
      if (tabLocal) tabLocal.className = mode === 'local' ? 'px-2.5 py-1 rounded-lg bg-amber-300 border border-pencil text-stone-900 shadow-sm font-bold' : 'px-2.5 py-1 rounded-lg bg-white border border-pencil text-stone-700 hover:bg-stone-50 font-normal';
      if (tabBot) tabBot.className = mode === 'bot' ? 'px-2.5 py-1 rounded-lg bg-amber-300 border border-pencil text-stone-900 shadow-sm font-bold' : 'px-2.5 py-1 rounded-lg bg-white border border-pencil text-stone-700 hover:bg-stone-50 font-normal';

      if (mode === 'local') {
        if (p2Controls) p2Controls.classList.remove('hidden');
        if (myControlsTitle) myControlsTitle.innerText = 'Patinha do Camarada 1:';
      } else {
        if (p2Controls) p2Controls.classList.add('hidden');
        if (myControlsTitle) myControlsTitle.innerText = 'Escolha sua Patinha Proletária:';
      }

      resetJokenpoMatch();
      syncOnlineGameLobbies();
    }
    window.selectJokenpoMode = selectJokenpoMode;

    function selectMyJokenpoPaw(gesture) {
      const myRole = window.sharedState.myRole || 'cat1';
      if (jokenpoMode === 'online') {
        if (!isPresenceSyncedToday()) {
          showBannerToast("Batam o Ponto do Sindicato hoje para jogar online! 🔒☭");
          return;
        }
        const room = window.sharedState.onlineRooms?.jokenpo;
        if (!room || !room.p1InRoom || !room.p2InRoom) {
          showBannerToast("Aguardando seu Camarada entrar na arena! ⏳");
          return;
        }
        if (myRole === 'cat1') room.p1Choice = gesture;
        else room.p2Choice = gesture;
        window.saveStateToCloud();
        showBannerToast(`Patinha escolhida pelo Partido! 🐾☭`);
      } else {
        selectJokenpoPaw(myRole, gesture);
      }
    }
    window.selectMyJokenpoPaw = selectMyJokenpoPaw;

    function selectJokenpoPaw(player, gesture) {
      if (jkpRoundFinished) return;
      if (player === 'cat1') jkpP1Choice = gesture;
      else jkpP2Choice = gesture;

      if (jokenpoMode === 'bot' && jkpP1Choice && !jkpP2Choice) {
        const moves = ['rock', 'paper', 'scissors'];
        jkpP2Choice = moves[Math.floor(Math.random() * moves.length)];
      }

      if (jkpP1Choice && jkpP2Choice) {
        triggerJokenpoRevealSequence(jkpP1Choice, jkpP2Choice);
      }
    }
    window.selectJokenpoPaw = selectJokenpoPaw;

    function triggerOnlineJokenpoReveal(c1, c2) {
      window._jkpRevealing = true;
      triggerJokenpoRevealSequence(c1, c2, () => {
        window._jkpRevealing = false;
      });
    }

    function triggerJokenpoRevealSequence(c1, c2, onComplete) {
      jkpRoundFinished = true;
      const countdown = document.getElementById('jkp-clash-countdown');
      let step = 0;
      const chants = ['1... ☭', '2... ⭐', '3... URA!! 💥'];

      const interval = setInterval(() => {
        if (step < chants.length) {
          if (countdown) countdown.innerText = chants[step];
          step++;
        } else {
          clearInterval(interval);
          finishJokenpoReveal(c1, c2);
          if (onComplete) onComplete();
        }
      }, 450);
    }

    let jkpWinnerRole = null;
    function finishJokenpoReveal(c1, c2) {
      const p1Display = document.getElementById('jkp-p1-gesture-display');
      const p2Display = document.getElementById('jkp-p2-gesture-display');
      const countdown = document.getElementById('jkp-clash-countdown');
      const actionBox = document.getElementById('jkp-result-action-box');
      const banner = document.getElementById('jkp-result-banner');
      const applyBtn = document.getElementById('jkp-apply-turn-btn');

      const gestureNames = { rock: 'Pedra', paper: 'Papel', scissors: 'Tesoura' };
      if (p1Display) p1Display.innerHTML = `${getCatPawGestureSvg(c1, 46)}<span class="text-[11px] font-bold text-amber-900 mt-1">${gestureNames[c1]}</span>`;
      if (p2Display) p2Display.innerHTML = `${getCatPawGestureSvg(c2, 46)}<span class="text-[11px] font-bold text-red-900 mt-1">${gestureNames[c2]}</span>`;

      const p1Name = (window.sharedState.nicknames && window.sharedState.nicknames.cat1) || 'Camarada 1';
      const p2Name = jokenpoMode === 'bot' ? 'Autômato Estatal' : ((window.sharedState.nicknames && window.sharedState.nicknames.cat2) || 'Camarada 2');

      if (c1 === c2) {
        jkpWinnerRole = 'tie';
        if (countdown) countdown.innerText = 'Igualdade Proletária (Empate)! 🤝☭';
        if (banner) banner.innerText = 'Deu empate! Joguem outra rodada pelo Comitê! 🐾';
        if (applyBtn) applyBtn.classList.add('hidden');
      } else if (
        (c1 === 'rock' && c2 === 'scissors') ||
        (c1 === 'paper' && c2 === 'rock') ||
        (c1 === 'scissors' && c2 === 'paper')
      ) {
        jkpWinnerRole = 'cat1';
        if (countdown) countdown.innerText = `Vitória de ${p1Name}! 🏆☭`;
        if (banner) banner.innerText = `${p1Name} triunfou com ${gestureNames[c1]}! +6 Rublos 🐾`;
        window.getMyWallet().paws += 6;
        window.saveStateToCloud();
        createHeartsParticles(window.innerWidth / 2, window.innerHeight / 2, 14);

        if (jokenpoForGameTurn && applyBtn) {
          applyBtn.innerText = `Iniciar Jogo da Velha com ${p1Name}! ⚡`;
          applyBtn.classList.remove('hidden');
        } else if (applyBtn) applyBtn.classList.add('hidden');
      } else {
        jkpWinnerRole = 'cat2';
        if (countdown) countdown.innerText = `Vitória de ${p2Name}! 🏆☭`;
        if (banner) banner.innerText = `${p2Name} triunfou com ${gestureNames[c2]}! 🎉`;
        createHeartsParticles(window.innerWidth / 2, window.innerHeight / 2, 14);

        if (jokenpoForGameTurn && applyBtn) {
          applyBtn.innerText = `Iniciar Jogo da Velha com ${p2Name}! ⚡`;
          applyBtn.classList.remove('hidden');
        } else if (applyBtn) applyBtn.classList.add('hidden');
      }

      if (actionBox) actionBox.classList.remove('hidden');
    }

    function resetJokenpoMatch() {
      jkpP1Choice = null;
      jkpP2Choice = null;
      jkpRoundFinished = false;
      window._jkpRevealing = false;

      if (jokenpoMode === 'online' && window.sharedState.onlineRooms?.jokenpo) {
        const room = window.sharedState.onlineRooms.jokenpo;
        room.p1Choice = '';
        room.p2Choice = '';
        room.state = 'waiting';
        window.saveStateToCloud();
      }

      const p1Display = document.getElementById('jkp-p1-gesture-display');
      const p2Display = document.getElementById('jkp-p2-gesture-display');
      const actionBox = document.getElementById('jkp-result-action-box');
      if (p1Display) p1Display.innerHTML = `<span class="text-3xl">❓</span>`;
      if (p2Display) p2Display.innerHTML = `<span class="text-3xl">❓</span>`;
      if (actionBox) actionBox.classList.add('hidden');
      syncOnlineGameLobbies();
    }
    window.resetJokenpoMatch = resetJokenpoMatch;

    function applyJokenpoWinnerToTurnGame() {
      if (jkpWinnerRole && jkpWinnerRole !== 'tie') {
        closeJokenpoModal();
        openTicTacToeModal();
        setFirstTurnPlayer(jkpWinnerRole);
      }
    }
    window.applyJokenpoWinnerToTurnGame = applyJokenpoWinnerToTurnGame;
