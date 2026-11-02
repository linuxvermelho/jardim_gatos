/* 3.1 LOJA VIP & ATELIÊ DE BELEZA */
    let currentVipTab = 'roupas';
    let tempPreviewCustoms = {};

    const PALETTE_COLORS = [
      { id: 'c_vermelho', hex: '#e63946', name: 'Vermelho Amor' },
      { id: 'c_vinho', hex: '#9b2226', name: 'Vinho Real' },
      { id: 'c_branco', hex: '#ffffff', name: 'Branco Neve' },
      { id: 'c_preto', hex: '#2b2725', name: 'Carvão' },
      { id: 'c_ouro', hex: '#ffd166', name: 'Ouro Real' },
      { id: 'c_esmeralda', hex: '#06d6a0', name: 'Esmeralda' },
      { id: 'c_ceu', hex: '#118ab2', name: 'Azul Céu' },
      { id: 'c_rubi', hex: '#ef476f', name: 'Rubi Rosa' },
      { id: 'c_roxo', hex: '#9d4edd', name: 'Ametista' },
      { id: 'c_ambar', hex: '#d9822b', name: 'Âmbar' }
    ];

    const VIP_CATALOG = {
      roupas: [
        { id: 'outfit_none', type: 'outfit', val: 'none', name: 'Sem Roupinha', price: 0, icon: '🚫' },
        { id: 'outfit_red_dress', type: 'outfit', val: 'red_dress', name: 'Vestido Vermelho Rodado', price: 0, icon: '👗' },
        { id: 'outfit_red_gown', type: 'outfit', val: 'red_gown', name: 'Vestido de Gala Vermelho', price: 0, icon: '💃' },
        { id: 'outfit_red_sweater', type: 'outfit', val: 'red_sweater', name: 'Suéter Vermelho Tricô', price: 0, icon: '🧶' },
        { id: 'outfit_red_hoodie', type: 'outfit', val: 'red_hoodie', name: 'Moletom Vermelho Fofo', price: 0, icon: '🧥' },
        { id: 'outfit_red_overalls', type: 'outfit', val: 'red_overalls', name: 'Jardineira Vermelha', price: 0, icon: '👖' },
        { id: 'outfit_red_cape', type: 'outfit', val: 'red_cape', name: 'Capinha Vermelha', price: 0, icon: '🧣' },
        { id: 'acc_star', type: 'accessory', val: 'star', name: 'Estrelinha ⭐ (Acessório)', price: 0, icon: '⭐' }
      ],
      pupilas: [
        { id: 'pupil_round', type: 'pupil', val: 'round', name: 'Redonda Fofa', price: 0, icon: '👀' },
        { id: 'pupil_slit', type: 'pupil', val: 'slit', name: 'Fenda Felina', price: 5, icon: '👁️' },
        { id: 'pupil_sparkle', type: 'pupil', val: 'sparkle', name: 'Brilho Anime', price: 8, icon: '✨' },
        { id: 'pupil_heart', type: 'pupil', val: 'heart', name: 'Pupila Coração', price: 10, icon: '💖' }
      ],
      olhos: [
        { id: 'shape_almond', type: 'eyeShape', val: 'almond', name: 'Olhos Clássicos', price: 0, icon: '😺' },
        { id: 'shape_round', type: 'eyeShape', val: 'round', name: 'Olhos Grandes', price: 6, icon: '🥺' },
        { id: 'shape_anime', type: 'eyeShape', val: 'anime', name: 'Olhos Estilizados', price: 8, icon: '🌟' }
      ],
      metadinhas: [
        { id: 'acc_half_heart_left', type: 'accessory', val: 'half_heart_left', name: 'Metadinha Esquerda', price: 5, currency: 'couple', icon: '💔' },
        { id: 'acc_half_heart_right', type: 'accessory', val: 'half_heart_right', name: 'Metadinha Direita', price: 5, currency: 'couple', icon: '❤️' },
        { id: 'acc_ribbon_pair', type: 'accessory', val: 'ribbon_pair', name: 'Laço do Casal', price: 6, currency: 'couple', icon: '🎀' }
      ],
      acessorios: [
        { id: 'acc_none', type: 'accessory', val: 'none', name: 'Nenhum', price: 0, icon: '🚫' },
        { id: 'acc_star', type: 'accessory', val: 'star', name: 'Estrelinha ⭐', price: 0, icon: '⭐' },
        { id: 'acc_bowtie', type: 'accessory', val: 'bowtie', name: 'Gravatinha', price: 6, icon: '🎀' },
        { id: 'acc_glasses', type: 'accessory', val: 'glasses', name: 'Óculos Fofo', price: 8, icon: '👓' },
        { id: 'acc_flower', type: 'accessory', val: 'flower', name: 'Florzinha', price: 6, icon: '🌸' },
        { id: 'acc_crown', type: 'accessory', val: 'crown', name: 'Coroa Real', price: 15, icon: '👑' }
      ],
      racas: [
        { id: 'breed_white', type: 'breed', val: 'white', name: 'Branco da Sibéria', price: 0, icon: '🐱' },
        { id: 'breed_orange', type: 'breed', val: 'orange', name: 'Tigre Dourado', price: 8, icon: '🐈' },
        { id: 'breed_tuxedo', type: 'breed', val: 'tuxedo', name: 'Comissário Frajola', price: 8, icon: '🐧' },
        { id: 'breed_siamese', type: 'breed', val: 'siamese', name: 'Guarda de Moscou', price: 12, icon: '🐾' }
      ],
      bocas: [
        { id: 'mouth_cat', type: 'mouth', val: 'cat', name: 'Sereno', price: 0, icon: '😺' },
        { id: 'mouth_tongue', type: 'mouth', val: 'tongue', name: 'Saudação Fofa', price: 5, icon: '👅' },
        { id: 'mouth_vampire', type: 'mouth', val: 'vampire', name: 'Feroz Defensor', price: 6, icon: '🧛' },
        { id: 'mouth_smile', type: 'mouth', val: 'smile', name: 'Sorriso Proletário', price: 5, icon: '😸' }
      ]
    };

    function openVipShopModal() {
      const myRole = window.sharedState.myRole || 'cat1';
      const myCat = window.sharedState[myRole] || window.sharedState.cat1;
      tempPreviewCustoms = { ...myCat };

      const wallet = window.getMyWallet();
      const fishEl = document.getElementById('shop-fish-count');
      if (fishEl) fishEl.innerText = `${wallet.fish} 🐟`;

      const coupleEl = document.getElementById('shop-couple-coin-count');
      if (coupleEl) coupleEl.innerText = `${wallet.coupleCoins} ☭💖`;

      renderShopPreview();
      switchShopTab(currentVipTab);

      const modal = document.getElementById('vip-shop-modal');
      if (modal) modal.classList.remove('hidden');
    }
    window.openVipShopModal = openVipShopModal;

    function closeVipShopModal() {
      const modal = document.getElementById('vip-shop-modal');
      if (modal) modal.classList.add('hidden');
    }
    window.closeVipShopModal = closeVipShopModal;

    function renderShopPreview() {
      const box = document.getElementById('shop-live-preview-box');
      if (box) {
        box.innerHTML = generateCatSvg({
          ...tempPreviewCustoms,
          expression: 'happy',
          isFlipped: false
        });
      }
    }
    window.renderShopPreview = renderShopPreview;

    function switchShopTab(tabKey) {
      currentVipTab = tabKey;
      ['roupas', 'pupilas', 'olhos', 'metadinhas', 'acessorios', 'racas', 'bocas'].forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        if (btn) btn.className = (t === tabKey) ? 'px-2.5 py-1 rounded-lg bg-amber-200 border border-pencil font-bold' : 'px-2.5 py-1 rounded-lg bg-white border border-pencil';
      });

      const grid = document.getElementById('shop-items-grid');
      if (!grid) return;
      grid.innerHTML = '';
      const items = VIP_CATALOG[tabKey] || [];
      const unlockedList = window.getMyUnlockedItems();

      items.forEach(item => {
        const isUnlocked = unlockedList.includes(item.id) || item.price === 0;
        const myCat = window.sharedState[window.sharedState.myRole] || window.sharedState.cat1;
        const isEquipped = (myCat[item.type] || 'none') === item.val;
        const priceLabel = item.price === 0 ? 'Grátis ✨' : (item.currency === 'couple' ? `${item.price} 💖` : `${item.price} 🐟`);

        const card = document.createElement('div');
        card.className = 'bg-white p-2.5 rounded-xl border-2 border-pencil flex flex-col items-center justify-between text-center shadow-sm';
        card.innerHTML = `
          <div class="flex items-center justify-center h-12 w-full mb-1">
            ${getVipItemSvgPreview(item.type, item.val)}
          </div>
          <span class="text-xs font-bold mt-1">${item.name}</span>
          <span class="text-[11px] ${item.price === 0 ? 'text-emerald-700' : 'text-amber-800'} font-bold mb-1">${item.price === 0 ? 'Grátis ✨' : (isUnlocked ? 'Desbloqueado' : priceLabel)}</span>

          <div class="w-full space-y-1">
            <button onclick="previewItem('${item.type}', '${item.val}')" class="w-full text-[10px] bg-stone-100 hover:bg-stone-200 py-1 rounded border border-pencil font-semibold">
              🔍 Testar no Provador
            </button>
            ${(item.type === 'pupil' || item.type === 'accessory' || item.type === 'eyeShape' || (item.type === 'outfit' && item.val !== 'none')) ? `
              <button onclick="openColorPaletteFor('${item.type}')" class="w-full text-[10px] bg-rose-50 hover:bg-rose-100 py-1 rounded border border-pencil font-bold text-rose-800">
                🎨 Mudar Cor (${item.type === 'pupil' ? 'Pupila' : (item.type === 'outfit' ? 'Roupa' : 'Item')})
              </button>
            ` : ''}
            <button onclick="handleVipItemAction('${item.id}', '${item.type}', '${item.val}', ${item.price}, '${item.currency || 'fish'}')" class="sketch-btn w-full ${isEquipped ? 'bg-amber-300' : 'bg-amber-100 hover:bg-amber-200'} text-xs py-1 rounded-lg font-bold">
              ${isUnlocked ? (isEquipped ? 'Equipado ✓' : 'Vestir') : 'Comprar'}
            </button>
          </div>
        `;
        grid.appendChild(card);
      });
    }
    window.switchShopTab = switchShopTab;

    function previewItem(type, val) {
      tempPreviewCustoms[type] = val;
      renderShopPreview();
      const descEl = document.getElementById('preview-item-description');
      if (descEl) descEl.innerText = `Testando: ${val}`;
    }
    window.previewItem = previewItem;

    function handleVipItemAction(itemId, type, val, price, currency) {
      const unlockedList = window.getMyUnlockedItems();
      const wallet = window.getMyWallet();
      const isUnlocked = unlockedList.includes(itemId) || price === 0;

      if (isUnlocked) {
        const myRole = window.sharedState.myRole;
        window.sharedState[myRole][type] = val;
        tempPreviewCustoms[type] = val;
        renderShopPreview();
        switchShopTab(currentVipTab);
        window.saveStateToCloud();
        showBannerToast(`Indumentária equipada com orgulho proletário! ☭✨`);
      } else {
        if (currency === 'couple') {
          if (wallet.coupleCoins >= price) {
            wallet.coupleCoins -= price;
            unlockedList.push(itemId);

            const myRole = window.sharedState.myRole;
            window.sharedState[myRole][type] = val;

            const coupleEl = document.getElementById('shop-couple-coin-count');
            if (coupleEl) coupleEl.innerText = `${wallet.coupleCoins} ☭💖`;

            renderShopPreview();
            switchShopTab(currentVipTab);
            window.saveStateToCloud();
            createHeartsParticles(window.innerWidth / 2, window.innerHeight / 2, 14);
            showBannerToast(`Insígnia do Casal desbloqueada! ☭💖✨`);
          } else {
            showBannerToast(`Medalhas do Partido insuficientes! Batam o Ponto do Sindicato diariamente ☭`);
          }
        } else {
          if (wallet.fish >= price) {
            wallet.fish -= price;
            unlockedList.push(itemId);

            const myRole = window.sharedState.myRole;
            window.sharedState[myRole][type] = val;

            const fishEl = document.getElementById('shop-fish-count');
            if (fishEl) fishEl.innerText = `${wallet.fish} 🐟`;

            renderShopPreview();
            switchShopTab(currentVipTab);
            window.saveStateToCloud();
            createHeartsParticles(window.innerWidth / 2, window.innerHeight / 2, 12);
            showBannerToast(`Item coletivizado e salvo no Kremlin! 🐟☭`);
          } else {
            showBannerToast(`Peixes do Estado insuficientes! Retire sua Ração Diária 🎁`);
          }
        }
      }
    }
    window.handleVipItemAction = handleVipItemAction;

    let activePaletteTarget = 'pupil';

    function openColorPaletteFor(targetType) {
      activePaletteTarget = targetType;
      const title = document.getElementById('palette-title');
      const subtitle = document.getElementById('palette-subtitle');

      if (targetType === 'pupil') {
        if (title) title.innerText = 'Tintas para a Pupila';
        if (subtitle) subtitle.innerText = 'Escolha ou compre uma cor para sua pupila (1 🐟):';
      } else if (targetType === 'eyeShape') {
        if (title) title.innerText = 'Cor dos Olhos (Íris)';
        if (subtitle) subtitle.innerText = 'Escolha a cor de fundo dos olhos do seu gatinho (1 🐟):';
      } else if (targetType === 'outfit') {
        if (title) title.innerText = 'Tom do Vestido / Roupa';
        if (subtitle) subtitle.innerText = 'Escolha o tom de vermelho ou outra cor para a roupa:';
      } else {
        if (title) title.innerText = 'Tinta para Acessório';
        if (subtitle) subtitle.innerText = 'Escolha ou compre uma cor para o seu acessório (1 🐟):';
      }

      const grid = document.getElementById('palette-swatches-grid');
      if (grid) {
        grid.innerHTML = '';
        PALETTE_COLORS.forEach(c => {
          const swatch = document.createElement('div');
          swatch.className = 'flex flex-col items-center cursor-pointer p-1.5 rounded-lg border border-pencil hover:bg-amber-50 transition-all';
          swatch.innerHTML = `
            <div class="w-7 h-7 rounded-full border border-pencil shadow-inner" style="background-color: ${c.hex}"></div>
            <span class="text-[10px] mt-1 font-semibold">${c.name}</span>
          `;
          swatch.onclick = () => applySelectedColor(c.hex);
          grid.appendChild(swatch);
        });
      }

      const modal = document.getElementById('palette-modal');
      if (modal) modal.classList.remove('hidden');
    }
    window.openColorPaletteFor = openColorPaletteFor;

    function closePaletteModal() {
      const modal = document.getElementById('palette-modal');
      if (modal) modal.classList.add('hidden');
    }
    window.closePaletteModal = closePaletteModal;

    function applySelectedColor(hexColor) {
      const myRole = window.sharedState.myRole;
      if (activePaletteTarget === 'pupil') {
        window.sharedState[myRole].pupilColor = hexColor;
        tempPreviewCustoms.pupilColor = hexColor;
      } else if (activePaletteTarget === 'eyeShape') {
        window.sharedState[myRole].eyeColor = hexColor;
        tempPreviewCustoms.eyeColor = hexColor;
      } else if (activePaletteTarget === 'outfit') {
        window.sharedState[myRole].outfitColor = hexColor;
        tempPreviewCustoms.outfitColor = hexColor;
      } else {
        window.sharedState[myRole].accessoryColor = hexColor;
        tempPreviewCustoms.accessoryColor = hexColor;
      }

      window.saveStateToCloud();
      renderShopPreview();
      closePaletteModal();
      showBannerToast(`Nova cor aplicada com sucesso! 🎨`);
    }
    window.applySelectedColor = applySelectedColor;

    function buyCustomHexColor() {
      const wallet = window.getMyWallet();
      if (wallet.fish >= 1) {
        wallet.fish -= 1;
        const hex = document.getElementById('custom-color-picker').value;
        applySelectedColor(hex);
        const fishEl = document.getElementById('shop-fish-count');
        if (fishEl) fishEl.innerText = `${wallet.fish} 🐟`;
        showBannerToast(`Tintura especial requisitada por 1 🐟!`);
      } else {
        showBannerToast(`Você precisa de 1 🐟 Peixe do Estado para requisitar tinta!`);
      }
    }
    window.buyCustomHexColor = buyCustomHexColor;

    function getVipItemSvgPreview(type, val) {
      const myRole = window.sharedState.myRole || 'cat1';
      const myCat = window.sharedState[myRole] || window.sharedState.cat1;
      const stroke = '#2b2725';
      const fill = myCat.accessoryColor || '#e76f51';
      const outfitFill = myCat.outfitColor || '#e63946';
      const pupilCol = myCat.pupilColor || '#ffffff';
      const eyeCol = myCat.eyeColor || '#2b2725';

      if (type === 'outfit') {
        if (val === 'red_dress') {
          return `<svg viewBox="0 0 80 56" class="w-16 h-12 drop-shadow-sm"><path d="M 26,12 L 14,44 Q 40,52 66,44 L 54,12 Z" fill="${outfitFill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/><path d="M 25,14 Q 40,18 55,14" fill="none" stroke="#800f17" stroke-width="4"/><circle cx="40" cy="15" r="3" fill="#fffdf9" stroke="${stroke}" stroke-width="1.5"/></svg>`;
        }
        if (val === 'red_gown') {
          return `<svg viewBox="0 0 80 56" class="w-16 h-12 drop-shadow-sm"><path d="M 24,12 C 14,22 10,36 10,46 Q 40,54 70,46 C 70,36 66,22 56,12 Z" fill="${outfitFill}" stroke="${stroke}" stroke-width="2.5"/><path d="M 34,13 L 28,48 Q 40,50 52,48 L 46,13 Z" fill="#f7cad0" stroke="${stroke}" stroke-width="1.8"/></svg>`;
        }
        if (val === 'red_sweater') {
          return `<svg viewBox="0 0 80 56" class="w-16 h-12 drop-shadow-sm"><path d="M 20,14 C 14,24 14,42 22,46 L 58,46 C 66,42 66,24 60,14 Z" fill="${outfitFill}" stroke="${stroke}" stroke-width="2.5"/><rect x="24" y="9" width="32" height="8" rx="4" fill="#b51724" stroke="${stroke}" stroke-width="2"/></svg>`;
        }
        if (val === 'red_hoodie') {
          return `<svg viewBox="0 0 80 56" class="w-16 h-12 drop-shadow-sm"><path d="M 20,14 C 14,24 14,42 22,46 L 58,46 C 66,42 66,24 60,14 Z" fill="${outfitFill}" stroke="${stroke}" stroke-width="2.5"/><path d="M 28,30 L 52,30 L 55,43 L 25,43 Z" fill="#b51724" stroke="${stroke}" stroke-width="1.8"/><path d="M 36,15 L 36,26 M 44,15 L 44,26" stroke="#fffdf9" stroke-width="2.2" stroke-linecap="round"/></svg>`;
        }
        if (val === 'red_overalls') {
          return `<svg viewBox="0 0 80 56" class="w-16 h-12 drop-shadow-sm"><path d="M 24,20 L 56,20 L 60,46 L 20,46 Z" fill="${outfitFill}" stroke="${stroke}" stroke-width="2.5"/><rect x="25" y="10" width="7" height="12" rx="2" fill="${outfitFill}" stroke="${stroke}" stroke-width="2"/><rect x="48" y="10" width="7" height="12" rx="2" fill="${outfitFill}" stroke="${stroke}" stroke-width="2"/><circle cx="28.5" cy="20" r="2" fill="#ffd166"/><circle cx="51.5" cy="20" r="2" fill="#ffd166"/></svg>`;
        }
        if (val === 'red_cape') {
          return `<svg viewBox="0 0 80 56" class="w-16 h-12 drop-shadow-sm"><path d="M 24,12 C 12,22 10,38 14,46 Q 28,49 38,44 L 40,20 L 42,44 Q 52,49 66,46 C 70,38 68,22 56,12 Z" fill="${outfitFill}" stroke="${stroke}" stroke-width="2.5"/><circle cx="40" cy="16" r="3.5" fill="#ffd166" stroke="${stroke}" stroke-width="1.5"/></svg>`;
        }
        return `<span class="text-2xl">🚫</span>`;
      }

      if (type === 'accessory') {
        if (val === 'star') {
          const starCol = (fill && fill !== '#e76f51') ? fill : '#ffd166';
          return `<svg viewBox="0 0 60 60" class="w-12 h-12 drop-shadow-sm"><polygon points="30,8 36,21 50,23 40,33 42,47 30,40 18,47 20,33 10,23 24,21" fill="${starCol}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="27" cy="24" r="2.5" fill="#fffdf9"/></svg>`;
        }
        if (val === 'bowtie') {
          return `<svg viewBox="0 0 80 50" class="w-16 h-10 drop-shadow-sm"><polygon points="12,10 12,40 40,25" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><polygon points="68,10 68,40 40,25" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><circle cx="40" cy="25" r="7" fill="#fbbf24" stroke="${stroke}" stroke-width="2"/></svg>`;
        }
        if (val === 'glasses') {
          return `<svg viewBox="0 0 80 40" class="w-16 h-10 drop-shadow-sm"><circle cx="24" cy="20" r="14" fill="none" stroke="${fill}" stroke-width="3"/><circle cx="56" cy="20" r="14" fill="none" stroke="${fill}" stroke-width="3"/><path d="M 38,18 Q 40,14 42,18" fill="none" stroke="${fill}" stroke-width="3"/></svg>`;
        }
        if (val === 'flower') {
          return `<svg viewBox="0 0 60 60" class="w-12 h-12 drop-shadow-sm"><circle cx="20" cy="24" r="9" fill="${fill}" stroke="${stroke}" stroke-width="2"/><circle cx="34" cy="18" r="9" fill="${fill}" stroke="${stroke}" stroke-width="2"/><circle cx="44" cy="28" r="9" fill="${fill}" stroke="${stroke}" stroke-width="2"/><circle cx="36" cy="40" r="9" fill="${fill}" stroke="${stroke}" stroke-width="2"/><circle cx="22" cy="38" r="9" fill="${fill}" stroke="${stroke}" stroke-width="2"/><circle cx="31" cy="30" r="6" fill="#fbbf24" stroke="${stroke}" stroke-width="2"/></svg>`;
        }
        if (val === 'crown') {
          return `<svg viewBox="0 0 70 50" class="w-14 h-10 drop-shadow-sm"><path d="M 10,36 Q 35,10 60,36 L 56,44 Q 35,38 14,44 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/><polygon points="35,20 37,25 42,25 38,28 39,33 35,30 31,33 32,28 28,25 33,25" fill="#fbbf24" stroke="${stroke}" stroke-width="1"/></svg>`;
        }
        if (val === 'half_heart_left') {
          return `<svg viewBox="0 0 60 50" class="w-12 h-10 drop-shadow-sm"><path d="M 30,14 C 30,6 16,3 16,14 C 16,24 30,36 30,38 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><line x1="8" y1="12" x2="18" y2="10" stroke="${stroke}" stroke-width="2" stroke-dasharray="2,2"/></svg>`;
        }
        if (val === 'half_heart_right') {
          return `<svg viewBox="0 0 60 50" class="w-12 h-10 drop-shadow-sm"><path d="M 30,14 C 30,6 44,3 44,14 C 44,24 30,36 30,38 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><line x1="52" y1="12" x2="42" y2="10" stroke="${stroke}" stroke-width="2" stroke-dasharray="2,2"/></svg>`;
        }
        if (val === 'ribbon_pair') {
          return `<svg viewBox="0 0 60 50" class="w-12 h-10 drop-shadow-sm"><circle cx="30" cy="20" r="7" fill="#fbbf24" stroke="${stroke}" stroke-width="2"/><path d="M 25,25 L 15,40 M 35,25 L 45,40" stroke="${fill}" stroke-width="4" stroke-linecap="round"/></svg>`;
        }
        return `<span class="text-2xl">🚫</span>`;
      }

      if (type === 'pupil') {
        let pupilInner = '';
        if (val === 'slit') {
          pupilInner = `<ellipse cx="30" cy="25" rx="3.5" ry="16" fill="${pupilCol}" />`;
        } else if (val === 'sparkle') {
          pupilInner = `<polygon points="30,16 32,21 37,22 32,25 30,30 28,25 23,22 28,21" fill="${pupilCol}"/><circle cx="37" cy="30" r="2.5" fill="${pupilCol}"/>`;
        } else if (val === 'heart') {
          pupilInner = `<path d="M 30,22 C 30,18 25,16 23,20 C 21,24 30,29 30,31 C 30,29 39,24 37,20 C 35,16 30,18 30,22 Z" fill="${pupilCol}" />`;
        } else {
          pupilInner = `<circle cx="33" cy="21" r="5" fill="${pupilCol}" /><circle cx="27" cy="29" r="2.5" fill="${pupilCol}" opacity="0.8"/>`;
        }
        return `<svg viewBox="0 0 60 50" class="w-12 h-10"><ellipse cx="30" cy="25" rx="16" ry="19" fill="${eyeCol}" stroke="${stroke}" stroke-width="2"/>${pupilInner}</svg>`;
      }

      if (type === 'eyeShape') {
        if (val === 'round') {
          return `<svg viewBox="0 0 60 50" class="w-12 h-10"><circle cx="30" cy="25" r="17" fill="${eyeCol}" stroke="${stroke}" stroke-width="2"/><circle cx="34" cy="22" r="4.5" fill="#fff"/></svg>`;
        }
        if (val === 'anime') {
          return `<svg viewBox="0 0 60 50" class="w-12 h-10"><path d="M 12,22 Q 30,10 48,24 Q 30,42 12,22 Z" fill="${eyeCol}" stroke="${stroke}" stroke-width="2"/><circle cx="35" cy="22" r="4" fill="#fff"/></svg>`;
        }
        return `<svg viewBox="0 0 60 50" class="w-12 h-10"><ellipse cx="30" cy="25" rx="14" ry="18" fill="${eyeCol}" stroke="${stroke}" stroke-width="2"/><circle cx="34" cy="21" r="4" fill="#fff"/></svg>`;
      }

      if (type === 'breed') {
        if (val === 'orange') {
          return `<svg viewBox="0 0 50 40" class="w-12 h-10"><circle cx="25" cy="20" r="16" fill="#f4a261" stroke="${stroke}" stroke-width="2"/><path d="M 25,10 L 25,18 M 20,9 Q 22,15 19,19 M 30,9 Q 28,15 31,19" stroke="#b3581d" stroke-width="2.5" fill="none"/></svg>`;
        }
        if (val === 'tuxedo') {
          return `<svg viewBox="0 0 50 40" class="w-12 h-10"><circle cx="25" cy="20" r="16" fill="#3d3a37" stroke="${stroke}" stroke-width="2"/><polygon points="25,16 20,28 30,28" fill="#fffdf9"/></svg>`;
        }
        if (val === 'siamese') {
          return `<svg viewBox="0 0 50 40" class="w-12 h-10"><circle cx="25" cy="20" r="16" fill="#ebdcc9" stroke="${stroke}" stroke-width="2"/><ellipse cx="25" cy="22" rx="10" ry="7" fill="#3d281d" opacity="0.85"/></svg>`;
        }
        return `<svg viewBox="0 0 50 40" class="w-12 h-10"><circle cx="25" cy="20" r="16" fill="#fffdf9" stroke="${stroke}" stroke-width="2"/><polygon points="18,10 22,15 18,18" fill="#f7c2c2"/><polygon points="32,10 28,15 32,18" fill="#f7c2c2"/></svg>`;
      }

      if (type === 'mouth') {
        if (val === 'tongue') {
          return `<svg viewBox="0 0 50 30" class="w-12 h-8"><path d="M 18,12 Q 25,18 32,12" fill="none" stroke="${stroke}" stroke-width="2.5"/><path d="M 23,15 C 23,23 27,23 27,15 Z" fill="#e74c3c" stroke="${stroke}" stroke-width="1.5"/></svg>`;
        }
        if (val === 'vampire') {
          return `<svg viewBox="0 0 50 30" class="w-12 h-8"><path d="M 18,12 Q 25,18 32,12" fill="none" stroke="${stroke}" stroke-width="2.5"/><polygon points="21,14 22,20 23,14" fill="#fff" stroke="${stroke}" stroke-width="1"/><polygon points="27,14 28,20 29,14" fill="#fff" stroke="${stroke}" stroke-width="1"/></svg>`;
        }
        if (val === 'smile') {
          return `<svg viewBox="0 0 50 30" class="w-12 h-8"><path d="M 16,10 Q 25,24 34,10" fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/></svg>`;
        }
        return `<svg viewBox="0 0 50 30" class="w-12 h-8"><path d="M 18,14 Q 25,20 32,14" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round"/></svg>`;
      }

      return `<span class="text-2xl">☭</span>`;
    }
    window.getVipItemSvgPreview = getVipItemSvgPreview;
