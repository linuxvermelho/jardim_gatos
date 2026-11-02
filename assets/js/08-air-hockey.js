/* 7. AIR HOCKEY SIBERIANO & PULA-PULA SPUTNIK NAS NUVENS */
    let airHockeyMode = 'local';
    let airHockeyRunning = false;
    let airHockeyAnimationId = null;
    let ahCanvas = null;
    let ahCtx = null;

    const ahState = {
      puck: { x: 0, y: 0, vx: 0, vy: 0, radius: 12 },
      player: { x: 0, y: 0, targetX: 0, targetY: 0, radius: 24 },
      opponent: { x: 0, y: 0, targetX: 0, targetY: 0, radius: 24 },
      score1: 0,
      score2: 0,
      maxScore: 5,
      goalWidth: 100,
      isPausedForGoal: false
    };

    function openAirHockeyModal(mode = 'local') {
      closeGamesHubModal();
      airHockeyMode = mode;
      if (mode === 'local' && !isPresenceSyncedToday()) {
        showBannerToast("Modo presencial bloqueado! Batam o Ponto do Sindicato hoje para liberar! 🔒☭");
      }
      selectAirHockeyMode(mode);
      const modal = document.getElementById('airhockey-modal');
      if (modal) modal.classList.remove('hidden');
      setTimeout(setupAirHockeyCanvas, 60);
    }
    window.openAirHockeyModal = openAirHockeyModal;

    function closeAirHockeyModal() {
      airHockeyRunning = false;
      if (airHockeyAnimationId) cancelAnimationFrame(airHockeyAnimationId);
      const modal = document.getElementById('airhockey-modal');
      if (modal) modal.classList.add('hidden');
    }
    window.closeAirHockeyModal = closeAirHockeyModal;

    function selectAirHockeyMode(mode) {
      airHockeyMode = mode;
      const tabLocal = document.getElementById('ah-tab-local');
      const tabBot = document.getElementById('ah-tab-bot');
      const desc = document.getElementById('airhockey-mode-desc');
      const hint = document.getElementById('airhockey-hint-txt');

      if (mode === 'local') {
        if (tabLocal) tabLocal.className = 'px-3 py-1 rounded-lg bg-amber-300 border border-pencil text-stone-900 shadow-sm transition-all font-bold';
        if (tabBot) tabBot.className = 'px-3 py-1 rounded-lg bg-white border border-pencil text-stone-700 hover:bg-stone-50 transition-all font-normal';
        if (desc) desc.innerText = 'Disputa de camaradas na mesma tela!';
        if (hint) hint.innerText = isPresenceSyncedToday() ? 'Multi-touch ativo: joguem juntos na mesma tela!' : '🔒 Batam o Ponto do Sindicato para liberar!';
      } else {
        if (tabBot) tabBot.className = 'px-3 py-1 rounded-lg bg-amber-300 border border-pencil text-stone-900 shadow-sm transition-all font-bold';
        if (tabLocal) tabLocal.className = 'px-3 py-1 rounded-lg bg-white border border-pencil text-stone-700 hover:bg-stone-50 transition-all font-normal';
        if (desc) desc.innerText = 'Treino no gelo contra o Autômato Soviético!';
        if (hint) hint.innerText = 'Defenda sua meta e vença o Autômato!';
      }
    }
    window.selectAirHockeyMode = selectAirHockeyMode;

    function setupAirHockeyCanvas() {
      ahCanvas = document.getElementById('airhockey-canvas');
      if (!ahCanvas) return;
      const container = document.getElementById('airhockey-canvas-container');
      ahCanvas.width = container.clientWidth || 300;
      ahCanvas.height = container.clientHeight || 320;
      ahCtx = ahCanvas.getContext('2d');

      resetPuckAndPaddlesToCenter();
      setupAirHockeyInput();
      drawAirHockeyFrame();
    }

    function resetPuckAndPaddlesToCenter() {
      if (!ahCanvas) return;
      const w = ahCanvas.width;
      const h = ahCanvas.height;

      ahState.puck.x = w / 2;
      ahState.puck.y = h / 2;
      ahState.puck.vx = 0;
      ahState.puck.vy = 0;

      ahState.player.x = w / 2;
      ahState.player.y = h * 0.82;
      ahState.player.targetX = w / 2;
      ahState.player.targetY = h * 0.82;

      ahState.opponent.x = w / 2;
      ahState.opponent.y = h * 0.18;
      ahState.opponent.targetX = w / 2;
      ahState.opponent.targetY = h * 0.18;
    }

    function setupAirHockeyInput() {
      if (!ahCanvas) return;
      ahCanvas.addEventListener('touchstart', handleCanvasTouch, { passive: false });
      ahCanvas.addEventListener('touchmove', handleCanvasTouch, { passive: false });
    }

    function handleCanvasTouch(e) {
      e.preventDefault();
      if (!airHockeyRunning || ahState.isPausedForGoal) return;
      const rect = ahCanvas.getBoundingClientRect();

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        if (y > ahCanvas.height / 2) {
          ahState.player.targetX = Math.max(ahState.player.radius, Math.min(ahCanvas.width - ahState.player.radius, x));
          ahState.player.targetY = Math.max(ahCanvas.height / 2 + ahState.player.radius + 4, Math.min(ahCanvas.height - ahState.player.radius - 4, y));
        } else if (airHockeyMode === 'local') {
          ahState.opponent.targetX = Math.max(ahState.opponent.radius, Math.min(ahCanvas.width - ahState.opponent.radius, x));
          ahState.opponent.targetY = Math.max(ahState.opponent.radius + 4, Math.min(ahCanvas.height / 2 - ahState.opponent.radius - 4, y));
        }
      }
    }

    function startAirHockeyGame(mode = airHockeyMode) {
      if (mode === 'local' && !isPresenceSyncedToday()) {
        showBannerToast("Modo presencial bloqueado! Batam o Ponto do Sindicato hoje para liberar! 🔒☭");
        return;
      }
      const overlay = document.getElementById('airhockey-overlay');
      if (overlay) overlay.classList.add('hidden');

      ahState.score1 = 0;
      ahState.score2 = 0;
      updateAirHockeyScoreboard();
      resetPuckAndPaddlesToCenter();
      airHockeyRunning = true;

      if (airHockeyAnimationId) cancelAnimationFrame(airHockeyAnimationId);
      airHockeyAnimationId = requestAnimationFrame(airHockeyGameLoop);
    }
    window.startAirHockeyGame = startAirHockeyGame;

    function updateAirHockeyScoreboard() {
      const s1 = document.getElementById('airhockey-score-p1');
      const s2 = document.getElementById('airhockey-score-p2');
      if (s1) s1.innerText = ahState.score1;
      if (s2) s2.innerText = ahState.score2;
    }

    function airHockeyGameLoop() {
      if (!airHockeyRunning || !ahCanvas) return;
      updateAirHockeyPhysics();
      drawAirHockeyFrame();
      airHockeyAnimationId = requestAnimationFrame(airHockeyGameLoop);
    }

    function updateAirHockeyPhysics() {
      const w = ahCanvas.width;
      const h = ahCanvas.height;

      ahState.player.x += (ahState.player.targetX - ahState.player.x) * 0.45;
      ahState.player.y += (ahState.player.targetY - ahState.player.y) * 0.45;

      const puck = ahState.puck;
      const opp = ahState.opponent;

      if (airHockeyMode === 'local') {
        opp.x += (opp.targetX - opp.x) * 0.45;
        opp.y += (opp.targetY - opp.y) * 0.45;
      } else {
        let desiredX = puck.x;
        let desiredY = h * 0.18;
        if (puck.y < h * 0.52) {
          desiredY = Math.min(h * 0.44, Math.max(opp.radius + 6, puck.y - 10));
          desiredX = puck.x + (puck.vx * 3.0);
        } else {
          desiredX = w / 2;
        }
        opp.x += (desiredX - opp.x) * 0.095;
        opp.y += (desiredY - opp.y) * 0.095;
      }

      puck.vx *= 0.992;
      puck.vy *= 0.992;
      puck.x += puck.vx;
      puck.y += puck.vy;

      if (puck.x - puck.radius < 4) { puck.x = 4 + puck.radius; puck.vx = -puck.vx * 0.88; }
      else if (puck.x + puck.radius > w - 4) { puck.x = w - 4 - puck.radius; puck.vx = -puck.vx * 0.88; }

      const goalLeft = (w - ahState.goalWidth) / 2;
      const goalRight = goalLeft + ahState.goalWidth;

      if (puck.y - puck.radius <= 4) {
        if (puck.x >= goalLeft && puck.x <= goalRight) { triggerAirHockeyGoal(1); return; }
        else { puck.y = 4 + puck.radius; puck.vy = -puck.vy * 0.88; }
      }
      if (puck.y + puck.radius >= h - 4) {
        if (puck.x >= goalLeft && puck.x <= goalRight) { triggerAirHockeyGoal(2); return; }
        else { puck.y = h - 4 - puck.radius; puck.vy = -puck.vy * 0.88; }
      }

      handlePaddlePuckCollision(ahState.player, puck);
      handlePaddlePuckCollision(ahState.opponent, puck);
    }

    function handlePaddlePuckCollision(paddle, puck) {
      const dx = puck.x - paddle.x;
      const dy = puck.y - paddle.y;
      const dist = Math.hypot(dx, dy);
      const minDist = paddle.radius + puck.radius;

      if (dist < minDist && dist > 0) {
        const nx = dx / dist;
        const ny = dy / dist;
        puck.x = paddle.x + nx * (minDist + 1);
        puck.y = paddle.y + ny * (minDist + 1);
        puck.vx += nx * 3.5;
        puck.vy += ny * 3.5;
        createHeartsParticles(puck.x, puck.y, 4);
      }
    }

    function triggerAirHockeyGoal(winnerId) {
      ahState.isPausedForGoal = true;
      if (winnerId === 1) ahState.score1++;
      else ahState.score2++;
      updateAirHockeyScoreboard();

      if (ahState.score1 >= ahState.maxScore || ahState.score2 >= ahState.maxScore) {
        airHockeyRunning = false;
        window.getMyWallet().paws += 10;
        window.saveStateToCloud(true);
        showBannerToast("Partida Siberiana concluída! +10 Rublos Felinos 🏆☭");
        const overlay = document.getElementById('airhockey-overlay');
        if (overlay) overlay.classList.remove('hidden');
      } else {
        setTimeout(() => {
          resetPuckAndPaddlesToCenter();
          ahState.isPausedForGoal = false;
        }, 1000);
      }
    }

    function drawAirHockeyFrame() {
      if (!ahCtx || !ahCanvas) return;
      const ctx = ahCtx;
      const w = ahCanvas.width;
      const h = ahCanvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#f0f9ff';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#2b1111';
      ctx.lineWidth = 3;
      ctx.strokeRect(2, 2, w - 4, h - 4);

      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.moveTo(4, h / 2);
      ctx.lineTo(w - 4, h / 2);
      ctx.strokeStyle = '#b91c1c';
      ctx.stroke();
      ctx.setLineDash([]);

      const puck = ahState.puck;
      ctx.beginPath();
      ctx.arc(puck.x, puck.y, puck.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#b91c1c';
      ctx.fill();
      ctx.stroke();

      drawPaddle(ctx, ahState.opponent.x, ahState.opponent.y, ahState.opponent.radius, '#dc2626', '🚩');
      drawPaddle(ctx, ahState.player.x, ahState.player.y, ahState.player.radius, '#f59e0b', '⭐');
    }

    function drawPaddle(ctx, x, y, r, color, emoji) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#2b1111';
      ctx.stroke();

      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, x, y);
    }

    /* PULA-PULA SPUTNIK NAS NUVENS */
    let skyHopRunning = false;
    let skyHopScoreVal = 0;
    function openSkyHopModal() {
      closeGamesHubModal();
      const modal = document.getElementById('skyhop-modal');
      if (modal) modal.classList.remove('hidden');
    }
    window.openSkyHopModal = openSkyHopModal;

    function closeSkyHopModal() {
      skyHopRunning = false;
      const modal = document.getElementById('skyhop-modal');
      if (modal) modal.classList.add('hidden');
    }
    window.closeSkyHopModal = closeSkyHopModal;

    function startSkyHopGame() {
      const canvas = document.getElementById('skyhop-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const container = document.getElementById('skyhop-canvas-container');
      canvas.width = container.clientWidth || 300;
      canvas.height = container.clientHeight || 280;

      skyHopScoreVal = 0;
      skyHopRunning = true;
      let catX = canvas.width / 2;
      let targetX = canvas.width / 2;
      let catY = canvas.height - 50;
      let vy = -12.5;

      canvas.onpointerdown = (e) => {
        const rect = canvas.getBoundingClientRect();
        targetX = Math.max(16, Math.min(canvas.width - 16, e.clientX - rect.left));
      };

      let platforms = [
        { x: canvas.width / 2 - 40, y: canvas.height - 35, w: 80 },
        { x: canvas.width * 0.15, y: canvas.height - 95, w: 70 },
        { x: canvas.width * 0.60, y: canvas.height - 155, w: 70 },
        { x: canvas.width * 0.25, y: canvas.height - 215, w: 68 }
      ];

      function loop() {
        if (!skyHopRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        catX += (targetX - catX) * 0.42;
        vy += 0.62;
        catY += vy;

        platforms.forEach(p => {
          ctx.fillStyle = '#fff8ed';
          ctx.strokeStyle = '#2b1111';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(p.x, p.y, p.w, 16, [10]);
          ctx.fill();
          ctx.stroke();

          if (vy > 0 && catY >= p.y - 16 && catY <= p.y + 8 && (catX + 12 >= p.x && catX - 12 <= p.x + p.w)) {
            vy = -12.2;
            skyHopScoreVal += 1;
            const scoreEl = document.getElementById('skyhop-score');
            if (scoreEl) scoreEl.innerText = skyHopScoreVal;
          }
        });

        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐱', catX, catY);

        if (catY < canvas.height * 0.45) {
          const delta = canvas.height * 0.45 - catY;
          catY = canvas.height * 0.45;
          platforms.forEach(p => {
            p.y += delta;
            if (p.y > canvas.height) {
              p.y = -10;
              p.x = Math.random() * (canvas.width - 75);
            }
          });
        }

        if (catY > canvas.height + 25) {
          skyHopRunning = false;
          window.getMyWallet().paws += Math.max(2, skyHopScoreVal);
          window.saveStateToCloud(true);
          showBannerToast(`Pouso Cosmonauta! Altitude: ${skyHopScoreVal} (+${Math.max(2, skyHopScoreVal)} Rublos 🐾)!`);
          return;
        }

        requestAnimationFrame(loop);
      }
      loop();
    }
    window.startSkyHopGame = startSkyHopGame;
