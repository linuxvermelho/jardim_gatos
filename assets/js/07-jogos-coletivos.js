/* 6. JOGO DA VELHA COLETIVO & PATA RÁPIDA STAKHANOVISTA */
    let tttSessionFirstRound = true;
    let tttLastLoser = null;

    function openTicTacToeModal() {
      closeGamesHubModal();
      if (!isPresenceSyncedToday()) {
        showBannerToast("Disputa bloqueada! Batam o Ponto do Sindicato hoje para liberar! 🔒☭");
      }

      const myRole = window.sharedState.myRole || 'cat1';
      if (!window.sharedState.onlineRooms) window.sharedState.onlineRooms = {};
      if (!window.sharedState.onlineRooms.tictactoe) window.sharedState.onlineRooms.tictactoe = {};
      if (myRole === 'cat1') window.sharedState.onlineRooms.tictactoe.p1InRoom = true;
      else window.sharedState.onlineRooms.tictactoe.p2InRoom = true;
      window.saveStateToCloud();

      const modal = document.getElementById('tictactoe-modal');
      if (modal) modal.classList.remove('hidden');

      const firstBanner = document.getElementById('ttt-first-round-banner');
      if (firstBanner) {
        if (tttSessionFirstRound) firstBanner.classList.remove('hidden');
        else firstBanner.classList.add('hidden');
      }

      renderTicTacToeBoard();
      syncOnlineGameLobbies();
    }
    window.openTicTacToeModal = openTicTacToeModal;

    function closeTicTacToeModal() {
      const myRole = window.sharedState.myRole || 'cat1';
      if (window.sharedState.onlineRooms?.tictactoe) {
        if (myRole === 'cat1') window.sharedState.onlineRooms.tictactoe.p1InRoom = false;
        else window.sharedState.onlineRooms.tictactoe.p2InRoom = false;
        window.saveStateToCloud();
      }
      const modal = document.getElementById('tictactoe-modal');
      if (modal) modal.classList.add('hidden');
      tttSessionFirstRound = true;
      tttLastLoser = null;
    }
    window.closeTicTacToeModal = closeTicTacToeModal;

    function setFirstTurnPlayer(role) {
      window.sharedState.tictactoe.turn = role;
      tttSessionFirstRound = false;
      const firstBanner = document.getElementById('ttt-first-round-banner');
      if (firstBanner) firstBanner.classList.add('hidden');
      renderTicTacToeBoard();
      const name = (window.sharedState.nicknames && window.sharedState.nicknames[role]) || (role === 'cat1' ? 'Camarada 1' : 'Camarada 2');
      showBannerToast(`1ª Rodada: ${name} inicia a partida! ☭🐾`);
      window.saveStateToCloud();
    }
    window.setFirstTurnPlayer = setFirstTurnPlayer;

    function openJokenpoForFirstTurn() {
      closeTicTacToeModal();
      openJokenpoModal('online', true);
    }
    window.openJokenpoForFirstTurn = openJokenpoForFirstTurn;

    function renderTicTacToeBoard() {
      const grid = document.getElementById('ttt-board-grid');
      if (!grid) return;
      grid.innerHTML = '';

      const ttt = window.sharedState.tictactoe;
      const myRole = window.sharedState.myRole;
      const mySymbol = myRole === 'cat1' ? '🐾' : '🐟';
      document.getElementById('ttt-my-symbol').innerText = `${mySymbol} (${myRole === 'cat1' ? 'Camarada 1' : 'Camarada 2'})`;

      const turnName = (window.sharedState.nicknames && window.sharedState.nicknames[ttt.turn]) || (ttt.turn === 'cat1' ? 'Camarada 1' : 'Camarada 2');
      const turnSymbol = ttt.turn === 'cat1' ? '🐾' : '🐟';
      document.getElementById('ttt-turn-indicator').innerText = `Vez de ${turnName} (${turnSymbol})`;

      ttt.board.forEach((cell, idx) => {
        const btn = document.createElement('button');
        btn.className = 'w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl border-2 border-pencil font-bold text-2xl flex items-center justify-center hover:bg-amber-50 active:scale-95 transition-transform shadow-sm';
        btn.innerText = cell;
        btn.onclick = () => handleTicTacToeMove(idx);
        grid.appendChild(btn);
      });

      if (ttt.winner) {
        document.getElementById('ttt-status-msg').innerText = `Vencedor: ${ttt.winner}! 🎉`;
      } else {
        document.getElementById('ttt-status-msg').innerText = ttt.turn === myRole ? 'É a sua vez de jogar, Camarada!' : 'Aguardando o lance do seu Camarada...';
      }
    }
    window.renderTicTacToeBoard = renderTicTacToeBoard;

    function handleTicTacToeMove(index) {
      if (!isPresenceSyncedToday()) {
        showBannerToast("Batam o Ponto do Sindicato hoje para jogar online! 🔒☭");
        return;
      }
      const room = window.sharedState.onlineRooms?.tictactoe;
      if (!room || !room.p1InRoom || !room.p2InRoom) {
        showBannerToast("Aguardando seu Camarada entrar na sala! ⏳");
        return;
      }

      const ttt = window.sharedState.tictactoe;
      const myRole = window.sharedState.myRole;
      if (ttt.winner || ttt.board[index] !== '' || ttt.turn !== myRole) return;

      tttSessionFirstRound = false;
      const firstBanner = document.getElementById('ttt-first-round-banner');
      if (firstBanner) firstBanner.classList.add('hidden');

      const symbol = myRole === 'cat1' ? '🐾' : '🐟';
      ttt.board[index] = symbol;

      const wins = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ];

      let won = false;
      for (let w of wins) {
        if (ttt.board[w[0]] && ttt.board[w[0]] === ttt.board[w[1]] && ttt.board[w[1]] === ttt.board[w[2]]) {
          won = true;
          break;
        }
      }

      if (won) {
        ttt.winner = myRole === 'cat1' ? 'Camarada 1 ⭐' : 'Camarada 2 🚩';
        tttLastLoser = (myRole === 'cat1') ? 'cat2' : 'cat1';
        if (myRole === 'cat1') window.sharedState.scores.cat1Wins++;
        else window.sharedState.scores.cat2Wins++;
        window.getMyWallet().paws += 8;
        showBannerToast(`Glória Proletária! Você venceu e ganhou +8 Rublos 🐾!`);
      } else if (!ttt.board.includes('')) {
        ttt.winner = 'Empate Coletivo 🤝';
        tttLastLoser = (myRole === 'cat1') ? 'cat2' : 'cat1';
        window.sharedState.scores.ties++;
        window.getMyWallet().paws += 4;
        showBannerToast(`Empate Fraterno! +4 Rublos 🐾 distribuídos!`);
      } else {
        ttt.turn = myRole === 'cat1' ? 'cat2' : 'cat1';
      }
      window.saveStateToCloud();
      renderTicTacToeBoard();
    }
    window.handleTicTacToeMove = handleTicTacToeMove;

    function resetTicTacToeGame() {
      let nextStarter = 'cat1';
      if (!tttSessionFirstRound && tttLastLoser) nextStarter = tttLastLoser;

      window.sharedState.tictactoe = {
        board: Array(9).fill(''),
        turn: nextStarter,
        winner: ''
      };
      window.saveStateToCloud();
      renderTicTacToeBoard();
      showBannerToast(`Tabuleiro Coletivo reiniciado! ☭`);
    }
    window.resetTicTacToeGame = resetTicTacToeGame;

    /* PATA RÁPIDA STAKHANOVISTA ONLINE */
    let reactionTimer = null;

    function openReactionModal() {
      closeGamesHubModal();
      if (!isPresenceSyncedToday()) {
        showBannerToast("Disputa bloqueada! Batam o Ponto do Sindicato hoje para liberar! 🔒☭");
      }

      const myRole = window.sharedState.myRole || 'cat1';
      if (!window.sharedState.onlineRooms) window.sharedState.onlineRooms = {};
      if (!window.sharedState.onlineRooms.reaction) window.sharedState.onlineRooms.reaction = {};
      if (myRole === 'cat1') window.sharedState.onlineRooms.reaction.p1InRoom = true;
      else window.sharedState.onlineRooms.reaction.p2InRoom = true;
      window.saveStateToCloud();

      const modal = document.getElementById('reaction-modal');
      if (modal) modal.classList.remove('hidden');
      syncOnlineGameLobbies();
    }
    window.openReactionModal = openReactionModal;

    function closeReactionModal() {
      clearTimeout(reactionTimer);
      const myRole = window.sharedState.myRole || 'cat1';
      if (window.sharedState.onlineRooms?.reaction) {
        if (myRole === 'cat1') window.sharedState.onlineRooms.reaction.p1InRoom = false;
        else window.sharedState.onlineRooms.reaction.p2InRoom = false;
        window.saveStateToCloud();
      }
      const modal = document.getElementById('reaction-modal');
      if (modal) modal.classList.add('hidden');
    }
    window.closeReactionModal = closeReactionModal;

    function startReactionRound() {
      if (!isPresenceSyncedToday()) {
        showBannerToast("Batam o Ponto do Sindicato hoje para jogar online! 🔒☭");
        return;
      }
      const room = window.sharedState.onlineRooms?.reaction;
      if (!room || !room.p1InRoom || !room.p2InRoom) {
        showBannerToast("Aguardando seu Camarada entrar na tela! ⏳");
        return;
      }

      clearTimeout(reactionTimer);
      room.state = 'waiting';
      room.winner = '';
      window.saveStateToCloud(true);

      const delay = Math.floor(Math.random() * 2500) + 1600;
      reactionTimer = setTimeout(() => {
        room.state = 'ready';
        window.saveStateToCloud(true);
      }, delay);
    }
    window.startReactionRound = startReactionRound;

    function handleReactionTap() {
      const room = window.sharedState.onlineRooms?.reaction;
      const myRole = window.sharedState.myRole || 'cat1';
      if (!room) return;

      if (room.state === 'ready') {
        room.state = 'finished';
        room.winner = myRole;
        window.getMyWallet().paws += 6;
        window.saveStateToCloud(true);
        createHeartsParticles(window.innerWidth / 2, window.innerHeight / 2, 12);
        showBannerToast('Reflexo Stakhanovista exemplar! +6 Rublos Felinos 🐾☭');
      } else if (room.state === 'waiting') {
        clearTimeout(reactionTimer);
        room.state = 'idle';
        window.saveStateToCloud(true);
        showBannerToast('Precipitação burguesa! Espere a tigela acender em ouro 🥣');
      }
    }
    window.handleReactionTap = handleReactionTap;
