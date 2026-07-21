// Arte vectorial de las mascotas de Lengua Viva.
// Yaku (delfín rosado amazónico con corona de plumas) y el Cóndor bebé
// (con chullo andino). Renderizados con react-native-svg para verse
// nítidos en cualquier tamaño y plataforma.

export const YAKU_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 244">
  <defs>
    <g id="pluma">
      <path d="M0 0 C-11 -26 -10 -60 0 -84 C10 -60 11 -26 0 0 Z"/>
      <path d="M0 -10 L0 -74" stroke="#00000026" stroke-width="2.5" fill="none"/>
    </g>
  </defs>
  <g transform="translate(100 100)">
    <use href="#pluma" fill="#1F8FA8" transform="rotate(-68) translate(0 -30)"/>
    <use href="#pluma" fill="#E23A2E" transform="rotate(-45) translate(0 -34)"/>
    <use href="#pluma" fill="#2D6FC2" transform="rotate(-22) translate(0 -37)"/>
    <use href="#pluma" fill="#2E9E4C" transform="rotate(0) translate(0 -38)"/>
    <use href="#pluma" fill="#F5C400" transform="rotate(22) translate(0 -37)"/>
    <use href="#pluma" fill="#F0A11B" transform="rotate(45) translate(0 -34)"/>
    <use href="#pluma" fill="#E23A2E" transform="rotate(68) translate(0 -30)"/>
  </g>
  <g>
    <ellipse cx="34" cy="128" rx="5" ry="14" fill="#2E9BB5" transform="rotate(12 34 128)"/>
    <ellipse cx="42" cy="136" rx="5" ry="14" fill="#F0A11B" transform="rotate(6 42 136)"/>
    <ellipse cx="166" cy="128" rx="5" ry="14" fill="#E23A2E" transform="rotate(-12 166 128)"/>
    <ellipse cx="158" cy="136" rx="5" ry="14" fill="#2E9BB5" transform="rotate(-6 158 136)"/>
    <circle cx="40" cy="116" r="4.5" fill="#F5C400"/>
    <circle cx="160" cy="116" r="4.5" fill="#F5C400"/>
  </g>
  <path d="M42 152 C22 164 14 184 20 200 C38 194 52 180 58 166 Z" fill="#EE5FA0"/>
  <path d="M158 152 C178 164 186 184 180 200 C162 194 148 180 142 166 Z" fill="#EE5FA0"/>
  <path d="M100 46 C144 46 165 78 163 114 C161 150 134 190 106 218 C104 220 96 220 94 218 C66 190 39 150 37 114 C35 78 56 46 100 46 Z" fill="#F0699E"/>
  <path d="M64 136 C76 124 124 124 136 136 C132 172 116 198 101 212 C99 214 96 210 90 202 C76 186 66 158 64 136 Z" fill="#FBC2D8"/>
  <path d="M96 216 C84 224 74 236 76 242 C86 240 96 234 100 228 C104 234 114 240 124 242 C126 236 116 224 104 216 C102 214 98 214 96 216 Z" fill="#EE5FA0"/>
  <path d="M40 98 C58 84 142 84 160 98 L160 114 C142 100 58 100 40 114 Z" fill="#7A4A21"/>
  <g fill="#F0A11B">
    <path d="M56 94 l7 -5 7 5 -7 5 Z"/><path d="M76 91 l7 -5 7 5 -7 5 Z"/>
    <path d="M96 90 l7 -5 7 5 -7 5 Z"/><path d="M116 91 l7 -5 7 5 -7 5 Z"/>
    <path d="M136 94 l7 -5 7 5 -7 5 Z"/>
  </g>
  <g fill="#2E9E4C">
    <path d="M66 97 l5 -3.5 5 3.5 -5 3.5 Z"/><path d="M86 94 l5 -3.5 5 3.5 -5 3.5 Z"/>
    <path d="M106 94 l5 -3.5 5 3.5 -5 3.5 Z"/><path d="M126 97 l5 -3.5 5 3.5 -5 3.5 Z"/>
  </g>
  <path d="M62 118 C68 113 78 113 84 117" stroke="#4A2B33" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M116 117 C122 113 132 113 138 118" stroke="#4A2B33" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="73" cy="133" rx="13" ry="14" fill="#FFFFFF"/>
  <ellipse cx="127" cy="133" rx="13" ry="14" fill="#FFFFFF"/>
  <circle cx="75" cy="134" r="8.5" fill="#2A1A2E"/>
  <circle cx="125" cy="134" r="8.5" fill="#2A1A2E"/>
  <circle cx="78" cy="131" r="3" fill="#FFFFFF"/>
  <circle cx="128" cy="131" r="3" fill="#FFFFFF"/>
  <circle cx="57" cy="148" r="7" fill="#F595BE"/>
  <circle cx="143" cy="148" r="7" fill="#F595BE"/>
  <path d="M84 148 C92 156 108 156 116 148" stroke="#C2416F" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M96 162 C99 165 101 165 104 162" stroke="#E88AB0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

export const CONDOR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260">
  <g>
    <circle cx="93" cy="14" r="9" fill="#D8342C"/>
    <circle cx="107" cy="12" r="9" fill="#1F7A8C"/>
    <circle cx="100" cy="20" r="9" fill="#F0A11B"/>
  </g>
  <path d="M52 160 C52 128 148 128 148 160 C148 206 130 236 100 236 C70 236 52 206 52 160 Z" fill="#232733"/>
  <path d="M50 150 C60 138 140 138 150 150 C152 160 148 166 140 168 C144 174 138 180 130 178 C132 186 122 190 114 186 C114 192 106 196 100 192 C94 196 86 192 86 186 C78 190 68 186 70 178 C62 180 56 174 60 168 C52 166 48 160 50 150 Z" fill="#F5F2E8"/>
  <ellipse cx="100" cy="112" rx="47" ry="46" fill="#F2A3B3"/>
  <path d="M48 92 C46 48 70 22 100 22 C130 22 154 48 152 92 L152 96 L48 96 Z" fill="#C42B57"/>
  <g fill="#F3E9D2">
    <path d="M60 54 l10 -8 10 8 -10 8 Z"/><path d="M90 46 l10 -8 10 8 -10 8 Z"/><path d="M120 54 l10 -8 10 8 -10 8 Z"/>
  </g>
  <g fill="#F0A11B">
    <path d="M64 57 l6 -5 6 5 -6 5 Z"/><path d="M94 49 l6 -5 6 5 -6 5 Z"/><path d="M124 57 l6 -5 6 5 -6 5 Z"/>
  </g>
  <g fill="#1F7A8C">
    <path d="M74 74 l8 -6 8 6 -8 6 Z"/><path d="M106 74 l8 -6 8 6 -8 6 Z"/>
  </g>
  <path d="M46 92 L154 92 L154 106 L46 106 Z" fill="#F3E9D2"/>
  <g fill="#D8342C">
    <path d="M54 99 l6 -4.5 6 4.5 -6 4.5 Z"/><path d="M74 99 l6 -4.5 6 4.5 -6 4.5 Z"/>
    <path d="M94 99 l6 -4.5 6 4.5 -6 4.5 Z"/><path d="M114 99 l6 -4.5 6 4.5 -6 4.5 Z"/>
    <path d="M134 99 l6 -4.5 6 4.5 -6 4.5 Z"/>
  </g>
  <path d="M46 106 L72 106 L66 134 C58 136 50 132 46 122 Z" fill="#C42B57"/>
  <path d="M154 106 L128 106 L134 134 C142 136 150 132 154 122 Z" fill="#C42B57"/>
  <path d="M57 134 C55 146 55 154 58 162" stroke="#C42B57" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M143 134 C145 146 145 154 142 162" stroke="#C42B57" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="58" cy="166" r="5" fill="#F0A11B"/>
  <circle cx="142" cy="166" r="5" fill="#F0A11B"/>
  <ellipse cx="78" cy="126" rx="14" ry="15" fill="#FFFFFF"/>
  <ellipse cx="122" cy="126" rx="14" ry="15" fill="#FFFFFF"/>
  <circle cx="81" cy="127" r="9" fill="#231A20"/>
  <circle cx="119" cy="127" r="9" fill="#231A20"/>
  <circle cx="84" cy="124" r="3" fill="#FFF"/>
  <circle cx="122" cy="124" r="3" fill="#FFF"/>
  <circle cx="61" cy="140" r="7" fill="#E87F96"/>
  <circle cx="139" cy="140" r="7" fill="#E87F96"/>
  <path d="M92 132 C92 124 108 124 108 132 C108 142 104 148 100 148 C96 148 92 142 92 132 Z" fill="#F5B90A"/>
  <path d="M100 144 C104 144 108 146 108 150 C106 156 94 156 92 150 C92 146 96 144 100 144 Z" fill="#E8930A"/>
  <circle cx="103" cy="133" r="1.8" fill="#B26E06"/>
  <g stroke="#F08A1D" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M80 234 L82 248"/>
    <path d="M82 248 L74 252 M82 248 L82 254 M82 248 L90 252"/>
    <path d="M120 234 L118 248"/>
    <path d="M118 248 L110 252 M118 248 L118 254 M118 248 L126 252"/>
  </g>
</svg>`;
