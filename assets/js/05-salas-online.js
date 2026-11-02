/* 4. SINCRONIZAÇÃO DE SALAS ONLINE */
    function syncOnlineGameLobbies() {
      const rooms = window.sharedState.onlineRooms || {};
      const myRole = window.sharedState.myRole || 'cat1';

      // 1. LOBBY DO JOKENPÔ PROLETÁRIO ONLINE
      const jkpRoom = rooms.jokenpo || {};
      const jkpWaiting = document.getElementById('jkp-waiting-banner');
      const jkpControls = document.getElementById('jkp-controls-area');
      const jkpP1Pill = document.getElementById('jkp-p1-status-pill');
      const jkpP2Pill = document.getElementById('jkp-p2-status-pill');
      const jkpCountdown = document.getElementById('jkp-clash-countdown');

      if (jokenpoMode === 'online') {
        const bothInJkp = jkpRoom.p1InRoom && jkpRoom.p2InRoom;
        if (!bothInJkp) {
          if (jkpWaiting) jkpWaiting.classList.remove('hidden');
          if (jkpControls) jkpControls.classList.add('opacity-50', 'pointer-events-none');
          if (jkpCountdown) jkpCountdown.innerText = 'Aguardando Camarada entrar na arena... ⏳';
        } else {
          if (jkpWaiting) jkpWaiting.classList.add('hidden');
          if (jkpControls) jkpControls.classList.remove('opacity-50', 'pointer-events-none');
          if (jkpCountdown && jkpRoom.state !== 'revealing') {
            jkpCountdown.innerText = 'Camaradas conectados! Escolha sua patinha ☭';
          }
        }

        if (jkpP1Pill) {
          if (!jkpRoom.p1InRoom) jkpP1Pill.innerText = 'Ausente ⚪';
          else if (jkpRoom.p1Choice) jkpP1Pill.innerText = myRole === 'cat1' ? 'Pronto! ✓' : 'Decidido! 🤫';
          else jkpP1Pill.innerText = 'Escolhendo... 🐾';
        }

        if (jkpP2Pill) {
          if (!jkpRoom.p2InRoom) jkpP2Pill.innerText = 'Ausente ⚪';
          else if (jkpRoom.p2Choice) jkpP2Pill.innerText = myRole === 'cat2' ? 'Pronto! ✓' : 'Decidido! 🤫';
          else jkpP2Pill.innerText = 'Escolhendo... 🐾';
        }

        if (jkpRoom.p1Choice && jkpRoom.p2Choice && jkpRoom.state === 'waiting' && !window._jkpRevealing) {
          triggerOnlineJokenpoReveal(jkpRoom.p1Choice, jkpRoom.p2Choice);
        }
      }

      // 2. LOBBY DA PATA RÁPIDA STAKHANOVISTA ONLINE
      const recRoom = rooms.reaction || {};
      const recWaiting = document.getElementById('reaction-waiting-banner');
      const recStartBtn = document.getElementById('reaction-start-btn');
      const recP1Dot = document.getElementById('reaction-p1-dot');
      const recP2Dot = document.getElementById('reaction-p2-dot');
      const recArena = document.getElementById('reaction-arena');
      const recPrompt = document.getElementById('reaction-prompt-text');
      const recIcon = document.getElementById('reaction-bowl-icon');

      if (recP1Dot) recP1Dot.className = recRoom.p1InRoom ? 'w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block' : 'w-2.5 h-2.5 rounded-full bg-stone-300 inline-block';
      if (recP2Dot) recP2Dot.className = recRoom.p2InRoom ? 'w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block' : 'w-2.5 h-2.5 rounded-full bg-stone-300 inline-block';

      const bothInRec = recRoom.p1InRoom && recRoom.p2InRoom;
      if (!bothInRec) {
        if (recWaiting) recWaiting.classList.remove('hidden');
        if (recStartBtn) {
          recStartBtn.disabled = true;
          recStartBtn.innerText = 'Aguardando Camarada entrar na tela... ⏳';
          recStartBtn.className = 'sketch-btn w-full bg-stone-200 text-stone-500 py-2 rounded-xl font-bold text-xs cursor-not-allowed';
        }
      } else {
        if (recWaiting) recWaiting.classList.add('hidden');
        if (recStartBtn && recRoom.state !== 'waiting') {
          recStartBtn.disabled = false;
          recStartBtn.innerText = 'Iniciar Turno Online ⚡';
          recStartBtn.className = 'sketch-btn w-full bg-amber-300 hover:bg-amber-400 text-red-950 py-2 rounded-xl font-bold text-xs cursor-pointer';
        }
      }

      if (recRoom.state === 'waiting') {
        if (recArena) recArena.style.backgroundColor = '#fee2e2';
        if (recPrompt) recPrompt.innerText = 'Disciplina do Partido... Aguardem o sinal!';
        if (recIcon) recIcon.innerText = '🥣';
        if (recStartBtn) {
          recStartBtn.disabled = true;
          recStartBtn.innerText = 'Turno em andamento...';
        }
      } else if (recRoom.state === 'ready') {
        if (recArena) recArena.style.backgroundColor = '#fef08a';
        if (recPrompt) recPrompt.innerText = 'PELA REVOLUÇÃO, TOQUE AGORA!! ⚡☭';
        if (recIcon) recIcon.innerText = '🍲⭐';
      } else if (recRoom.state === 'finished' && recRoom.winner) {
        if (recArena) recArena.style.backgroundColor = '#bbf7d0';
        const winName = (window.sharedState.nicknames && window.sharedState.nicknames[recRoom.winner]) || (recRoom.winner === 'cat1' ? 'Camarada 1' : 'Camarada 2');
        if (recPrompt) recPrompt.innerText = `Vitória Stakhanovista de ${winName}! 🏆☭`;
        if (recIcon) recIcon.innerText = '🏆⭐';
      }

      // 3. LOBBY DO JOGO DA VELHA COLETIVO
      const tttRoom = rooms.tictactoe || {};
      const tttWaiting = document.getElementById('ttt-waiting-banner');
      const tttP1Dot = document.getElementById('ttt-p1-dot');
      const tttP2Dot = document.getElementById('ttt-p2-dot');

      if (tttP1Dot) tttP1Dot.className = tttRoom.p1InRoom ? 'w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block' : 'w-2.5 h-2.5 rounded-full bg-stone-300 inline-block';
      if (tttP2Dot) tttP2Dot.className = tttRoom.p2InRoom ? 'w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block' : 'w-2.5 h-2.5 rounded-full bg-stone-300 inline-block';

      const bothInTtt = tttRoom.p1InRoom && tttRoom.p2InRoom;
      if (!bothInTtt) {
        if (tttWaiting) tttWaiting.classList.remove('hidden');
      } else {
        if (tttWaiting) tttWaiting.classList.add('hidden');
      }
    }
    window.syncOnlineGameLobbies = syncOnlineGameLobbies;
