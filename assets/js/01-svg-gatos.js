/* 1. GERADOR SVG DOS GATOS */
    function generateCatSvg(options) {
      const {
        breed = 'white',
        outfit = 'none',
        outfitColor = '#e63946',
        accessory = 'none',
        accessoryColor = '#e76f51',
        expression = 'happy',
        eyeShape = 'almond',
        eyeColor = '#2b2725',
        pupil = 'round',
        pupilColor = '#ffffff',
        mouth = 'cat',
        isFlipped = false
      } = options;
      
      let bodyFill = '#fffdf9';
      let strokeCol = '#2b2725';
      let earInner = '#f7c2c2';

      if (breed === 'orange') {
        bodyFill = '#f4a261';
        earInner = '#e76f51';
      } else if (breed === 'tuxedo') {
        bodyFill = '#3d3a37';
      } else if (breed === 'siamese') {
        bodyFill = '#ebdcc9';
        earInner = '#5d4037';
      }

      let extraMarkings = '';
      if (breed === 'tuxedo') {
        extraMarkings = `
          <polygon points="98,90 80,120 116,120" fill="#fffdf9" />
          <ellipse cx="98" cy="148" rx="20" ry="14" fill="#fffdf9" />
        `;
      } else if (breed === 'orange') {
        extraMarkings = `
          <path d="M 98,62 L 98,72 M 88,58 Q 92,68 86,75 M 108,58 Q 104,68 110,75" stroke="#b3581d" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          <ellipse cx="98" cy="144" rx="14" ry="10" fill="#fffdf9" />
        `;
      } else if (breed === 'siamese') {
        extraMarkings = `
          <polygon points="40,30 65,70 30,70" fill="#3d281d" opacity="0.8"/>
          <polygon points="156,30 131,70 166,70" fill="#3d281d" opacity="0.8"/>
          <path d="M 64,112 Q 98,78 132,112 Q 98,140 64,112 Z" fill="#3d281d" opacity="0.85"/>
        `;
      }

      // Vestidos e Roupas Vermelhas (Lisos, sem estrelas nas roupas)
      const mainRed = outfitColor || '#e63946';
      let outfitSvg = '';
      if (outfit === 'red_dress') {
        outfitSvg = `
          <g>
            <!-- Barra de renda branca delicada -->
            <path d="M 52,167 Q 60,173 68,167 Q 76,173 84,167 Q 92,173 100,167 Q 108,173 116,167 Q 124,173 132,167 Q 140,173 146,167" fill="none" stroke="#fffdf9" stroke-width="4" stroke-linecap="round"/>
            <!-- Saia rodada vermelha lisa -->
            <path d="M 70,134 L 52,166 Q 98,174 146,166 L 128,134 Z" fill="${mainRed}" stroke="${strokeCol}" stroke-width="3" stroke-linejoin="round"/>
            <!-- Pregas suaves do tecido -->
            <path d="M 84,142 L 74,165 M 98,143 L 98,167 M 112,142 L 122,165" stroke="#9e1b24" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
            <!-- Faixa da cintura e lacinho -->
            <path d="M 69,136 Q 98,141 129,136" fill="none" stroke="#800f17" stroke-width="4.5" stroke-linecap="round"/>
            <polygon points="98,138 89,133 89,143" fill="#b51724" stroke="${strokeCol}" stroke-width="1.6"/>
            <polygon points="98,138 107,133 107,143" fill="#b51724" stroke="${strokeCol}" stroke-width="1.6"/>
            <circle cx="98" cy="138" r="3" fill="#fffdf9" stroke="${strokeCol}" stroke-width="1.5"/>
          </g>
        `;
      } else if (outfit === 'red_gown') {
        outfitSvg = `
          <g>
            <!-- Babado creme inferior de gala -->
            <path d="M 46,168 Q 58,176 72,168 Q 86,176 98,168 Q 112,176 126,168 Q 140,176 152,168" fill="#fff8eb" stroke="${strokeCol}" stroke-width="2.5" stroke-linejoin="round"/>
            <!-- Saia longa de gala vermelha lisa -->
            <path d="M 68,134 C 54,144 46,158 46,168 Q 98,175 152,168 C 152,158 144,144 130,134 Z" fill="${mainRed}" stroke="${strokeCol}" stroke-width="3" stroke-linejoin="round"/>
            <!-- Painel central acetinado sem estampas -->
            <path d="M 88,136 L 78,169 Q 98,172 118,169 L 108,136 Z" fill="#f7cad0" stroke="${strokeCol}" stroke-width="2"/>
            <!-- Babado ombro a ombro -->
            <path d="M 66,135 Q 82,142 98,136 Q 114,142 132,135" fill="none" stroke="#b51724" stroke-width="5" stroke-linecap="round"/>
          </g>
        `;
      } else if (outfit === 'red_sweater') {
        outfitSvg = `
          <g>
            <!-- Corpo do suéter de tricô vermelho liso -->
            <path d="M 64,134 C 56,146 58,164 66,166 L 132,166 C 140,164 142,146 134,134 Z" fill="${mainRed}" stroke="${strokeCol}" stroke-width="3" stroke-linejoin="round"/>
            <!-- Gola alta quentinha -->
            <rect x="70" y="130" width="56" height="9" rx="4.5" fill="#b51724" stroke="${strokeCol}" stroke-width="2.5"/>
            <!-- Textura de linhas de tricô (sem estrela) -->
            <line x1="80" y1="140" x2="78" y2="164" stroke="#9e1b24" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
            <line x1="92" y1="140" x2="92" y2="164" stroke="#9e1b24" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
            <line x1="104" y1="140" x2="104" y2="164" stroke="#9e1b24" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
            <line x1="116" y1="140" x2="118" y2="164" stroke="#9e1b24" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
          </g>
        `;
      } else if (outfit === 'red_hoodie') {
        outfitSvg = `
          <g>
            <!-- Moletom vermelho liso -->
            <path d="M 63,134 C 55,148 57,164 66,166 L 132,166 C 141,164 143,148 135,134 Z" fill="${mainRed}" stroke="${strokeCol}" stroke-width="3" stroke-linejoin="round"/>
            <!-- Bolso canguru frontal liso -->
            <path d="M 80,150 L 116,150 L 120,163 L 76,163 Z" fill="#b51724" stroke="${strokeCol}" stroke-width="2" stroke-linejoin="round"/>
            <!-- Cordões brancos do capuz -->
            <path d="M 91,136 Q 89,145 91,151" fill="none" stroke="#fffdf9" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M 105,136 Q 107,145 105,151" fill="none" stroke="#fffdf9" stroke-width="2.5" stroke-linecap="round"/>
          </g>
        `;
      } else if (outfit === 'red_overalls') {
        outfitSvg = `
          <g>
            <!-- Camisetinha creme por baixo -->
            <path d="M 65,135 C 58,148 60,162 68,165 L 130,165 C 138,162 140,148 133,135 Z" fill="#fffdf9" stroke="${strokeCol}" stroke-width="2.5"/>
            <!-- Jardineira vermelha lisa -->
            <path d="M 74,142 L 122,142 L 128,166 L 68,166 Z" fill="${mainRed}" stroke="${strokeCol}" stroke-width="3" stroke-linejoin="round"/>
            <!-- Alças da jardineira -->
            <rect x="75" y="133" width="8" height="13" rx="2" fill="${mainRed}" stroke="${strokeCol}" stroke-width="2.2"/>
            <rect x="113" y="133" width="8" height="13" rx="2" fill="${mainRed}" stroke="${strokeCol}" stroke-width="2.2"/>
            <!-- Botões redondos simples -->
            <circle cx="79" cy="143" r="2.5" fill="#ffd166" stroke="${strokeCol}" stroke-width="1.2"/>
            <circle cx="117" cy="143" r="2.5" fill="#ffd166" stroke="${strokeCol}" stroke-width="1.2"/>
            <!-- Bolsinho frontal liso -->
            <rect x="88" y="149" width="20" height="12" rx="3" fill="#b51724" stroke="${strokeCol}" stroke-width="1.8"/>
          </g>
        `;
      } else if (outfit === 'red_cape') {
        outfitSvg = `
          <g>
            <!-- Capinha vermelha lisa -->
            <path d="M 66,133 C 50,144 46,160 52,167 Q 75,171 94,166 L 98,140 L 102,166 Q 121,171 144,167 C 150,160 146,144 130,133 Z" fill="${mainRed}" stroke="${strokeCol}" stroke-width="3" stroke-linejoin="round"/>
            <!-- Gola arredondada da capa -->
            <path d="M 68,133 Q 83,142 98,137 Q 113,142 128,133" fill="#b51724" stroke="${strokeCol}" stroke-width="2.5" stroke-linecap="round"/>
            <!-- Laço simples no pescoço -->
            <circle cx="98" cy="137" r="3.2" fill="#ffd166" stroke="${strokeCol}" stroke-width="1.6"/>
            <path d="M 96,139 L 91,148 M 100,139 L 105,148" stroke="#b51724" stroke-width="2.2" stroke-linecap="round"/>
          </g>
        `;
      }

      let accessorySvg = '';
      if (accessory === 'bowtie') {
        accessorySvg = `
          <g transform="translate(0, 10)">
            <polygon points="85,122 85,136 98,129" fill="${accessoryColor}" stroke="${strokeCol}" stroke-width="2"/>
            <polygon points="111,122 111,136 98,129" fill="${accessoryColor}" stroke="${strokeCol}" stroke-width="2"/>
            <circle cx="98" cy="129" r="4" fill="#f4a261" stroke="${strokeCol}" stroke-width="1.5"/>
          </g>
        `;
      } else if (accessory === 'glasses') {
        accessorySvg = `
          <g>
            <circle cx="72" cy="98" r="18" fill="none" stroke="${accessoryColor}" stroke-width="3"/>
            <circle cx="124" cy="98" r="18" fill="none" stroke="${accessoryColor}" stroke-width="3"/>
            <path d="M 90,98 Q 98,92 106,98" fill="none" stroke="${accessoryColor}" stroke-width="3"/>
          </g>
        `;
      } else if (accessory === 'flower') {
        accessorySvg = `
          <g transform="translate(10, -5)">
            <circle cx="58" cy="50" r="5" fill="${accessoryColor}" stroke="${strokeCol}" stroke-width="1.5"/>
            <circle cx="66" cy="46" r="5" fill="${accessoryColor}" stroke="${strokeCol}" stroke-width="1.5"/>
            <circle cx="72" cy="54" r="5" fill="${accessoryColor}" stroke="${strokeCol}" stroke-width="1.5"/>
            <circle cx="66" cy="60" r="5" fill="${accessoryColor}" stroke="${strokeCol}" stroke-width="1.5"/>
            <circle cx="58" cy="58" r="5" fill="${accessoryColor}" stroke="${strokeCol}" stroke-width="1.5"/>
            <circle cx="64" cy="54" r="3.5" fill="#f4a261"/>
          </g>
        `;
      } else if (accessory === 'star') {
        const starFill = (accessoryColor && accessoryColor !== '#e76f51') ? accessoryColor : '#ffd166';
        accessorySvg = `
          <g transform="translate(8, -6)">
            <polygon points="64,38 68,46 77,47 70,53 72,62 64,57 56,62 58,53 51,47 60,46" fill="${starFill}" stroke="${strokeCol}" stroke-width="2" stroke-linejoin="round"/>
            <circle cx="62" cy="48" r="2" fill="#fffdf9" opacity="0.9"/>
          </g>
        `;
      } else if (accessory === 'crown') {
        // Boina / Ushanka Revolucionária com Estrela Vermelha e Dourada
        accessorySvg = `
          <g transform="translate(0, -6)">
            <path d="M 66,54 Q 98,28 130,54 L 126,66 Q 98,58 70,66 Z" fill="${accessoryColor}" stroke="${strokeCol}" stroke-width="2.5" stroke-linejoin="round"/>
            <polygon points="98,38 100.5,43.5 106.5,44 102,48 103.5,54 98,50.5 92.5,54 94,48 89.5,44 95.5,43.5" fill="#fbbf24" stroke="${strokeCol}" stroke-width="1.2"/>
          </g>
        `;
      } else if (accessory === 'half_heart_left') {
        accessorySvg = `
          <g transform="translate(0, 10)">
            <path d="M 98,124 C 98,118 86,114 86,124 C 86,132 98,138 98,140 Z" fill="${accessoryColor}" stroke="${strokeCol}" stroke-width="2"/>
            <line x1="72" y1="126" x2="86" y2="124" stroke="${strokeCol}" stroke-width="2" stroke-dasharray="2,2"/>
          </g>
        `;
      } else if (accessory === 'half_heart_right') {
        accessorySvg = `
          <g transform="translate(0, 10)">
            <path d="M 98,124 C 98,118 110,114 110,124 C 110,132 98,138 98,140 Z" fill="${accessoryColor}" stroke="${strokeCol}" stroke-width="2"/>
            <line x1="124" y1="126" x2="110" y2="124" stroke="${strokeCol}" stroke-width="2" stroke-dasharray="2,2"/>
          </g>
        `;
      } else if (accessory === 'ribbon_pair') {
        accessorySvg = `
          <g transform="translate(0, 12)">
            <circle cx="98" cy="132" r="5" fill="#fbbf24" stroke="${strokeCol}" stroke-width="1.8"/>
            <path d="M 94,136 L 86,146 M 102,136 L 110,146" stroke="${accessoryColor}" stroke-width="3" stroke-linecap="round"/>
          </g>
        `;
      }

      let eyeBaseShape = '';
      if (eyeShape === 'round') {
        eyeBaseShape = `
          <circle cx="72" cy="98" r="17" fill="${eyeColor}" />
          <circle cx="124" cy="98" r="17" fill="${eyeColor}" />
        `;
      } else if (eyeShape === 'anime') {
        eyeBaseShape = `
          <path d="M 56,92 Q 72,82 88,96 Q 72,114 56,92 Z" fill="${eyeColor}" stroke="${strokeCol}" stroke-width="1.5" />
          <path d="M 140,92 Q 124,82 108,96 Q 124,114 140,92 Z" fill="${eyeColor}" stroke="${strokeCol}" stroke-width="1.5" />
        `;
      } else {
        eyeBaseShape = `
          <ellipse cx="72" cy="98" rx="14" ry="18" fill="${eyeColor}" />
          <ellipse cx="124" cy="98" rx="14" ry="18" fill="${eyeColor}" />
        `;
      }

      let pupilDetail = '';
      if (pupil === 'slit') {
        pupilDetail = `
          <ellipse cx="72" cy="98" rx="3.5" ry="16" fill="${pupilColor}" />
          <ellipse cx="124" cy="98" rx="3.5" ry="16" fill="${pupilColor}" />
        `;
      } else if (pupil === 'sparkle') {
        pupilDetail = `
          <polygon points="72,90 74,94 78,95 74,97 72,101 70,97 66,95 70,94" fill="${pupilColor}"/>
          <polygon points="124,90 126,94 130,95 126,97 124,101 122,97 118,95 122,94" fill="${pupilColor}"/>
        `;
      } else if (pupil === 'heart') {
        pupilDetail = `
          <path d="M 72,96 C 72,92 68,90 66,94 C 64,98 72,102 72,104 C 72,102 80,98 78,94 C 76,90 72,92 72,96 Z" fill="${pupilColor}" />
          <path d="M 124,96 C 124,92 120,90 118,94 C 116,98 124,102 124,104 C 124,102 132,98 130,94 C 128,90 124,92 124,96 Z" fill="${pupilColor}" />
        `;
      } else {
        pupilDetail = `
          <circle cx="76" cy="94" r="5" fill="${pupilColor}" />
          <circle cx="128" cy="94" r="5" fill="${pupilColor}" />
        `;
      }

      let eyesSvg = `${eyeBaseShape}${pupilDetail}`;
      let mouthSvg = `<path d="M 94,118 Q 98,122 102,118" fill="none" stroke="${strokeCol}" stroke-width="2.5" stroke-linecap="round" />`;

      if (expression === 'pet') {
        eyesSvg = `
          <path d="M 60,100 Q 72,86 84,100" fill="none" stroke="${strokeCol}" stroke-width="4.5" stroke-linecap="round" />
          <path d="M 112,100 Q 124,86 136,100" fill="none" stroke="${strokeCol}" stroke-width="4.5" stroke-linecap="round" />
          <ellipse cx="58" cy="110" rx="6" ry="3.5" fill="#e89c9c" opacity="0.8" />
          <ellipse cx="138" cy="110" rx="6" ry="3.5" fill="#e89c9c" opacity="0.8" />
        `;
      }

      if (mouth === 'tongue') {
        mouthSvg = `
          <path d="M 94,118 Q 98,122 102,118" fill="none" stroke="${strokeCol}" stroke-width="2.5"/>
          <path d="M 96,120 C 96,125 100,125 100,120 Z" fill="#e74c3c" stroke="${strokeCol}" stroke-width="1.5"/>
        `;
      } else if (mouth === 'vampire') {
        mouthSvg = `
          <path d="M 93,118 Q 98,122 103,118" fill="none" stroke="${strokeCol}" stroke-width="2.5"/>
          <polygon points="95,118 96,122 97,118" fill="#fff" stroke="${strokeCol}" stroke-width="1"/>
          <polygon points="99,118 100,122 101,118" fill="#fff" stroke="${strokeCol}" stroke-width="1"/>
        `;
      } else if (mouth === 'smile') {
        mouthSvg = `<path d="M 92,116 Q 98,124 104,116" fill="none" stroke="${strokeCol}" stroke-width="2.8" stroke-linecap="round"/>`;
      }

      const flipTransform = isFlipped ? 'transform="scale(-1, 1) translate(-200, 0)"' : '';

      return `
        <svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-md select-none transition-transform duration-200">
          <g ${flipTransform}>
            <g class="anim-tail">
              <path d="M 134,152 C 162,150 180,134 172,118 C 165,106 152,114 148,126 C 144,136 134,146 130,154 Z" 
                    fill="${bodyFill}" stroke="${strokeCol}" stroke-width="3.8" stroke-linejoin="round" stroke-linecap="round" />
            </g>
            <g class="anim-body">
              <path d="M 64,136 C 56,152 56,168 68,172 C 78,175 84,164 88,152 C 94,152 104,152 110,152 C 114,164 120,175 130,172 C 142,168 140,152 134,136 Z" 
                    fill="${bodyFill}" stroke="${strokeCol}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" />
              <path d="M 44,82 C 40,54 44,38 52,42 C 64,48 82,70 98,70 C 114,70 132,48 144,42 C 152,38 156,54 152,82 C 160,112 142,138 98,138 C 54,138 36,112 44,82 Z" 
                    fill="${bodyFill}" stroke="${strokeCol}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" />
              <polygon points="52,46 64,54 52,68" fill="${earInner}" opacity="0.65" />
              <polygon points="144,46 132,54 144,68" fill="${earInner}" opacity="0.65" />
              ${extraMarkings}
              <g class="anim-blink">${eyesSvg}</g>
              <polygon points="95,112 101,112 98,116" fill="#e76f51" />
              ${mouthSvg}
              ${outfitSvg}
              <ellipse cx="82" cy="165" rx="8" ry="6" fill="${bodyFill}" stroke="${strokeCol}" stroke-width="3" />
              <ellipse cx="114" cy="165" rx="8" ry="6" fill="${bodyFill}" stroke="${strokeCol}" stroke-width="3" />
              ${accessorySvg}
            </g>
          </g>
        </svg>
      `;
    }
    window.generateCatSvg = generateCatSvg;
