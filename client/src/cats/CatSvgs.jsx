// Bande dessinée style cats — bold outlines, flat colours, expressive faces

const S = '#111111'; // stroke colour
const SW = 3;        // default stroke-width

/* ──────────── SHARED HELPERS ──────────── */

function Ears({ cx, cy, fur, inner = '#FFAABB', size = 1 }) {
  const lx = cx - 24 * size, rx = cx + 24 * size;
  const ty = cy - 26 * size, my = cy - 14 * size;
  return (
    <>
      {/* left ear outer */}
      <polygon points={`${lx},${my} ${lx - 12 * size},${ty - 5 * size} ${lx + 12 * size},${my - 6 * size}`}
        fill={fur} stroke={S} strokeWidth={SW - 0.5} strokeLinejoin="round" />
      {/* left ear inner */}
      <polygon points={`${lx},${my - 2} ${lx - 7 * size},${ty} ${lx + 7 * size},${my - 5 * size}`}
        fill={inner} stroke="none" />
      {/* right ear outer */}
      <polygon points={`${rx},${my} ${rx + 12 * size},${ty - 5 * size} ${rx - 12 * size},${my - 6 * size}`}
        fill={fur} stroke={S} strokeWidth={SW - 0.5} strokeLinejoin="round" />
      {/* right ear inner */}
      <polygon points={`${rx},${my - 2} ${rx + 7 * size},${ty} ${rx - 7 * size},${my - 5 * size}`}
        fill={inner} stroke="none" />
    </>
  );
}

function Eyes({ cx, cy, iris = '#4A3AFF', size = 1, shape = 'round', expression = 'happy' }) {
  const lx = cx - 12 * size, rx = cx + 12 * size;
  const ry_outer = shape === 'almond' ? 8 * size : 9 * size;
  const rx_outer = shape === 'almond' ? 10 * size : 9 * size;
  return (
    <>
      {/* whites */}
      <ellipse cx={lx} cy={cy} rx={rx_outer} ry={ry_outer} fill="white" stroke={S} strokeWidth={2} />
      <ellipse cx={rx} cy={cy} rx={rx_outer} ry={ry_outer} fill="white" stroke={S} strokeWidth={2} />
      {/* irises */}
      <circle cx={lx} cy={cy} r={6 * size} fill={iris} />
      <circle cx={rx} cy={cy} r={6 * size} fill={iris} />
      {/* pupils */}
      <circle cx={lx} cy={cy} r={3 * size} fill="#111" />
      <circle cx={rx} cy={cy} r={3 * size} fill="#111" />
      {/* shine */}
      <circle cx={lx - 2 * size} cy={cy - 2 * size} r={1.8 * size} fill="white" />
      <circle cx={rx - 2 * size} cy={cy - 2 * size} r={1.8 * size} fill="white" />
      {/* extra sparkle */}
      <circle cx={lx + 3 * size} cy={cy + 3 * size} r={0.9 * size} fill="white" opacity="0.8" />
      <circle cx={rx + 3 * size} cy={cy + 3 * size} r={0.9 * size} fill="white" opacity="0.8" />
    </>
  );
}

function Nose({ cx, cy }) {
  return (
    <ellipse cx={cx} cy={cy} rx={4} ry={3} fill="#FF88AA" stroke={S} strokeWidth={1.5} />
  );
}

function Mouth({ cx, cy, type = 'smile' }) {
  if (type === 'grin')
    return <path d={`M ${cx - 8} ${cy} Q ${cx} ${cy + 9} ${cx + 8} ${cy}`} stroke={S} strokeWidth={2} fill="none" strokeLinecap="round" />;
  if (type === 'open')
    return (
      <>
        <path d={`M ${cx - 7} ${cy} Q ${cx} ${cy + 8} ${cx + 7} ${cy}`} stroke={S} strokeWidth={2} fill="#CC3344" strokeLinecap="round" />
        <ellipse cx={cx} cy={cy + 4} rx={5} ry={3} fill="#CC3344" stroke="none" />
      </>
    );
  if (type === 'neutral')
    return <path d={`M ${cx - 6} ${cy + 2} Q ${cx} ${cy + 4} ${cx + 6} ${cy + 2}`} stroke={S} strokeWidth={2} fill="none" strokeLinecap="round" />;
  if (type === 'zzz')
    return <path d={`M ${cx - 5} ${cy + 3} L ${cx + 5} ${cy + 3}`} stroke={S} strokeWidth={2} strokeLinecap="round" />;
  // default smile
  return <path d={`M ${cx - 7} ${cy} Q ${cx} ${cy + 8} ${cx + 7} ${cy}`} stroke={S} strokeWidth={2} fill="none" strokeLinecap="round" />;
}

function Whiskers({ cx, cy }) {
  return (
    <>
      <line x1={cx - 22} y1={cy - 2} x2={cx - 6} y2={cy + 1} stroke={S} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={cx - 22} y1={cy + 4} x2={cx - 6} y2={cy + 3} stroke={S} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={cx + 6} y1={cy + 1} x2={cx + 22} y2={cy - 2} stroke={S} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={cx + 6} y1={cy + 3} x2={cx + 22} y2={cy + 4} stroke={S} strokeWidth={1.5} strokeLinecap="round" />
    </>
  );
}

/* ──────────── LUNA ♀  (value 1) ──────────── */
export function LunaCat() {
  const fur = '#D9A8CC';
  return (
    <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* tail */}
      <path d="M 65 105 Q 92 80 84 58" stroke="#C090BA" strokeWidth={8} fill="none" strokeLinecap="round" />
      {/* body */}
      <ellipse cx={50} cy={93} rx={24} ry={18} fill={fur} stroke={S} strokeWidth={SW} />
      {/* tummy */}
      <ellipse cx={50} cy={95} rx={14} ry={10} fill="#ECC8E0" stroke="none" />
      {/* head */}
      <circle cx={50} cy={53} r={27} fill={fur} stroke={S} strokeWidth={SW} />
      <Ears cx={50} cy={53} fur={fur} inner="#F4B8DC" />
      {/* big bow */}
      <g transform="translate(78 18)">
        <path d="M 0 0 Q -10 -8 -14 0 Q -10 8 0 0" fill="#FF4499" stroke={S} strokeWidth={1.5} />
        <path d="M 0 0 Q 10 -8 14 0 Q 10 8 0 0" fill="#FF4499" stroke={S} strokeWidth={1.5} />
        <circle cx={0} cy={0} r={4} fill="#FF88CC" stroke={S} strokeWidth={1.5} />
      </g>
      {/* blush */}
      <ellipse cx={33} cy={62} rx={7} ry={4} fill="#FF99BB" opacity={0.65} />
      <ellipse cx={67} cy={62} rx={7} ry={4} fill="#FF99BB" opacity={0.65} />
      <Eyes cx={50} cy={51} iris="#7B3FD9" />
      <Nose cx={50} cy={60} />
      <Mouth cx={50} cy={63} />
      <Whiskers cx={50} cy={60} />
    </svg>
  );
}

/* ──────────── MILO ♂  (value 2) ──────────── */
export function MiloCat() {
  const fur = '#7AAFD0';
  return (
    <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path d="M 62 106 Q 88 78 80 55" stroke="#5A90B8" strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={50} cy={93} rx={25} ry={18} fill={fur} stroke={S} strokeWidth={SW} />
      <ellipse cx={50} cy={96} rx={14} ry={9} fill="#A0D0EE" stroke="none" />
      <circle cx={50} cy={52} r={27} fill={fur} stroke={S} strokeWidth={SW} />
      <Ears cx={50} cy={52} fur={fur} inner="#AADDFF" />
      {/* tabby stripes on head */}
      <path d="M 30 42 Q 50 38 70 42" stroke="#5A90B8" strokeWidth={2} fill="none" opacity={0.6} />
      <path d="M 28 48 Q 50 44 72 48" stroke="#5A90B8" strokeWidth={1.5} fill="none" opacity={0.4} />
      {/* glasses */}
      <circle cx={39} cy={52} r={11} fill="none" stroke="#2060A8" strokeWidth={2.5} />
      <circle cx={61} cy={52} r={11} fill="none" stroke="#2060A8" strokeWidth={2.5} />
      <line x1={50} y1={52} x2={50} y2={52} stroke="#2060A8" strokeWidth={2.5} />
      <path d="M 50 51 L 50 53" stroke="#2060A8" strokeWidth={2} />
      <line x1={28} y1={50} x2={24} y2={48} stroke="#2060A8" strokeWidth={2} />
      <line x1={72} y1={50} x2={76} y2={48} stroke="#2060A8" strokeWidth={2} />
      {/* eyes through glasses */}
      <circle cx={39} cy={52} r={6} fill="#1A3A6A" />
      <circle cx={61} cy={52} r={6} fill="#1A3A6A" />
      <circle cx={37} cy={50} r={2} fill="white" />
      <circle cx={59} cy={50} r={2} fill="white" />
      <Nose cx={50} cy={61} />
      <Mouth cx={50} cy={64} type="neutral" />
      <Whiskers cx={50} cy={61} />
    </svg>
  );
}

/* ──────────── ZOÉ ♀  (value 3) ──────────── */
export function ZoeCat() {
  const fur = '#F4885A';
  return (
    <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path d="M 64 106 Q 90 80 82 56" stroke="#D4683A" strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={50} cy={93} rx={26} ry={18} fill={fur} stroke={S} strokeWidth={SW} />
      <ellipse cx={50} cy={95} rx={15} ry={9} fill="#F8B090" stroke="none" />
      <circle cx={50} cy={52} r={27} fill={fur} stroke={S} strokeWidth={SW} />
      <Ears cx={50} cy={52} fur={fur} inner="#FFD0A0" />
      {/* headband */}
      <path d="M 23 46 Q 50 36 77 46" stroke="#DD2244" strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M 23 46 Q 50 36 77 46" stroke="#FF4466" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
      {/* energy lines */}
      <line x1={15} y1={35} x2={22} y2={42} stroke="#FFD700" strokeWidth={2} strokeLinecap="round" />
      <line x1={11} y1={42} x2={20} y2={45} stroke="#FFD700" strokeWidth={2} strokeLinecap="round" />
      {/* blush */}
      <ellipse cx={33} cy={62} rx={7} ry={4} fill="#FF8860" opacity={0.5} />
      <ellipse cx={67} cy={62} rx={7} ry={4} fill="#FF8860" opacity={0.5} />
      <Eyes cx={50} cy={52} iris="#2D6A2D" />
      <Nose cx={50} cy={61} />
      <Mouth cx={50} cy={64} type="grin" />
      <Whiskers cx={50} cy={61} />
    </svg>
  );
}

/* ──────────── MAX ♂  (value 5) ──────────── */
export function MaxCat() {
  const fur = '#C4935A';
  return (
    <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path d="M 63 106 Q 89 82 81 60" stroke="#A07040" strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={50} cy={93} rx={26} ry={19} fill={fur} stroke={S} strokeWidth={SW} />
      <ellipse cx={50} cy={96} rx={15} ry={10} fill="#E0C090" stroke="none" />
      <circle cx={50} cy={51} r={27} fill={fur} stroke={S} strokeWidth={SW} />
      <Ears cx={50} cy={51} fur={fur} inner="#EEBB88" />
      {/* coffee cup held */}
      <g transform="translate(68 85)">
        <rect x={-10} y={-12} width={20} height={18} rx={3} fill="#E8C870" stroke={S} strokeWidth={2} />
        <path d="M 10 -8 Q 18 -8 18 -2 Q 18 4 10 4" stroke={S} strokeWidth={2} fill="none" />
        <rect x={-8} y={-12} width={16} height={5} rx={1} fill="#CC9920" stroke="none" />
        {/* steam */}
        <path d="M -3 -14 Q -1 -19 -3 -23" stroke="#AAAAAA" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        <path d="M 3 -14 Q 5 -19 3 -23" stroke="#AAAAAA" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </g>
      {/* lazy half-closed eyes */}
      <ellipse cx={39} cy={51} rx={9} ry={9} fill="white" stroke={S} strokeWidth={2} />
      <ellipse cx={61} cy={51} rx={9} ry={9} fill="white" stroke={S} strokeWidth={2} />
      <ellipse cx={39} cy={53} rx={9} ry={5} fill={fur} stroke={S} strokeWidth={2} />
      <ellipse cx={61} cy={53} rx={9} ry={5} fill={fur} stroke={S} strokeWidth={2} />
      <circle cx={39} cy={51} r={5} fill="#7A4A2A" />
      <circle cx={61} cy={51} r={5} fill="#7A4A2A" />
      <circle cx={37} cy={49} r={1.5} fill="white" />
      <circle cx={59} cy={49} r={1.5} fill="white" />
      <Nose cx={50} cy={60} />
      <Mouth cx={50} cy={63} type="neutral" />
      <Whiskers cx={50} cy={60} />
    </svg>
  );
}

/* ──────────── REX ♂  (value 8) ──────────── */
export function RexCat() {
  const fur = '#F4721A';
  return (
    <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path d="M 65 105 Q 93 78 85 52" stroke="#C45010" strokeWidth={9} fill="none" strokeLinecap="round" />
      {/* big body - muscular */}
      <ellipse cx={50} cy={91} rx={30} ry={20} fill={fur} stroke={S} strokeWidth={SW} />
      <ellipse cx={50} cy={93} rx={18} ry={10} fill="#F8AA60" stroke="none" />
      {/* tiger stripes on body */}
      <path d="M 25 85 Q 32 80 35 90" stroke="#9A3800" strokeWidth={3} fill="none" />
      <path d="M 65 85 Q 68 80 75 90" stroke="#9A3800" strokeWidth={3} fill="none" />
      {/* bicep arms */}
      <ellipse cx={22} cy={88} rx={10} ry={8} fill={fur} stroke={S} strokeWidth={2.5} transform="rotate(-20 22 88)" />
      <ellipse cx={78} cy={88} rx={10} ry={8} fill={fur} stroke={S} strokeWidth={2.5} transform="rotate(20 78 88)" />
      {/* fists */}
      <circle cx={14} cy={83} r={8} fill={fur} stroke={S} strokeWidth={2.5} />
      <circle cx={86} cy={83} r={8} fill={fur} stroke={S} strokeWidth={2.5} />
      {/* head */}
      <circle cx={50} cy={50} r={28} fill={fur} stroke={S} strokeWidth={SW} />
      {/* tiger stripes on head */}
      <path d="M 38 28 Q 50 24 62 28" stroke="#9A3800" strokeWidth={3} fill="none" />
      <path d="M 34 36 Q 50 32 66 36" stroke="#9A3800" strokeWidth={2} fill="none" />
      <Ears cx={50} cy={50} fur={fur} inner="#FF9966" />
      {/* fierce eyes */}
      <ellipse cx={38} cy={50} rx={10} ry={8} fill="white" stroke={S} strokeWidth={2} />
      <ellipse cx={62} cy={50} rx={10} ry={8} fill="white" stroke={S} strokeWidth={2} />
      <circle cx={38} cy={50} r={6} fill="#AA3300" />
      <circle cx={62} cy={50} r={6} fill="#AA3300" />
      <circle cx={36} cy={48} r={2} fill="white" />
      <circle cx={60} cy={48} r={2} fill="white" />
      {/* fierce eyebrows */}
      <path d="M 28 42 L 44 46" stroke={S} strokeWidth={3} strokeLinecap="round" />
      <path d="M 56 46 L 72 42" stroke={S} strokeWidth={3} strokeLinecap="round" />
      <Nose cx={50} cy={59} />
      <Mouth cx={50} cy={62} type="grin" />
      <Whiskers cx={50} cy={59} />
    </svg>
  );
}

/* ──────────── MYSTICA ♀  (value 13) ──────────── */
export function MysticaCat() {
  const fur = '#AA55DD';
  return (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path d="M 63 108 Q 90 80 82 55" stroke="#882ABB" strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={50} cy={95} rx={24} ry={18} fill={fur} stroke={S} strokeWidth={SW} />
      <ellipse cx={50} cy={97} rx={14} ry={9} fill="#CC88FF" stroke="none" />
      {/* stars around */}
      <text x="12" y="44" fontSize="10" fill="#FFD700">✦</text>
      <text x="80" y="38" fontSize="8" fill="#FFD700">✦</text>
      <text x="18" y="68" fontSize="7" fill="#BB88FF">✦</text>
      <text x="76" y="65" fontSize="9" fill="#FFD700">✦</text>
      {/* head */}
      <circle cx={50} cy={57} r={27} fill={fur} stroke={S} strokeWidth={SW} />
      <Ears cx={50} cy={57} fur={fur} inner="#EE88FF" />
      {/* witch hat */}
      <polygon points="50,5 28,38 72,38" fill="#220044" stroke={S} strokeWidth={2.5} strokeLinejoin="round" />
      <rect x={24} y={37} width={52} height={9} rx={4} fill="#440066" stroke={S} strokeWidth={2} />
      {/* hat sparkle */}
      <circle cx={50} cy={18} r={4} fill="#FFD700" stroke={S} strokeWidth={1.5} />
      {/* moon symbol */}
      <path d="M 40 50 Q 36 56 40 62 Q 33 59 33 56 Q 33 53 40 50" fill="#FFD700" stroke="none" />
      {/* mysterious eyes */}
      <ellipse cx={39} cy={57} rx={9} ry={10} fill="white" stroke={S} strokeWidth={2} />
      <ellipse cx={61} cy={57} rx={9} ry={10} fill="white" stroke={S} strokeWidth={2} />
      <circle cx={39} cy={57} r={6} fill="#6600CC" />
      <circle cx={61} cy={57} r={6} fill="#6600CC" />
      <circle cx={37} cy={55} r={2} fill="white" />
      <circle cx={59} cy={55} r={2} fill="white" />
      {/* glowing pupils */}
      <circle cx={39} cy={57} r={1.5} fill="#FF99FF" opacity={0.9} />
      <circle cx={61} cy={57} r={1.5} fill="#FF99FF" opacity={0.9} />
      <Nose cx={50} cy={66} />
      <Mouth cx={50} cy={69} type="smile" />
      <Whiskers cx={50} cy={66} />
    </svg>
  );
}

/* ──────────── SHADOW ♂  (value 21) ──────────── */
export function ShadowCat() {
  const fur = '#1C2A3A';
  return (
    <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path d="M 63 106 Q 90 78 82 52" stroke="#0A1520" strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={50} cy={93} rx={25} ry={18} fill={fur} stroke={S} strokeWidth={SW} />
      {/* ninja outfit lines */}
      <path d="M 40 78 L 40 108" stroke="#2A3A4A" strokeWidth={2} />
      <path d="M 60 78 L 60 108" stroke="#2A3A4A" strokeWidth={2} />
      {/* head */}
      <circle cx={50} cy={52} r={27} fill={fur} stroke={S} strokeWidth={SW} />
      <Ears cx={50} cy={52} fur={fur} inner="#2A4050" />
      {/* ninja mask - covers most of face */}
      <rect x={23} y={52} width={54} height={26} rx={8} fill="#111820" stroke={S} strokeWidth={2} />
      {/* eye slits in mask */}
      <ellipse cx={38} cy={52} rx={10} ry={8} fill="#111820" stroke={S} strokeWidth={2} />
      <ellipse cx={62} cy={52} rx={10} ry={8} fill="#111820" stroke={S} strokeWidth={2} />
      {/* glowing eyes */}
      <ellipse cx={38} cy={52} rx={7} ry={5} fill="#CC2222" />
      <ellipse cx={62} cy={52} rx={7} ry={5} fill="#CC2222" />
      <circle cx={36} cy={51} r={2} fill="white" opacity={0.6} />
      <circle cx={60} cy={51} r={2} fill="white" opacity={0.6} />
      {/* headband */}
      <rect x={23} y={36} width={54} height={10} rx={5} fill="#CC2222" stroke={S} strokeWidth={2} />
      <text x="42" y="45" fontSize="8" fill="#FFD700" fontWeight="bold">忍</text>
      {/* throwing star */}
      <g transform="translate(82 30)">
        <polygon points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" fill="#AAAAAA" stroke={S} strokeWidth={1} />
      </g>
    </svg>
  );
}

/* ──────────── CLEO ♀  (value ?) ──────────── */
export function CleoCat() {
  const fur = '#20C9A8';
  return (
    <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* tilted body */}
      <g transform="rotate(-8 50 90)">
        <path d="M 62 106 Q 88 82 80 58" stroke="#10A888" strokeWidth={8} fill="none" strokeLinecap="round" />
        <ellipse cx={50} cy={93} rx={24} ry={17} fill={fur} stroke={S} strokeWidth={SW} />
      </g>
      {/* head slightly tilted */}
      <g transform="rotate(-8 50 52)">
        <circle cx={50} cy={52} r={27} fill={fur} stroke={S} strokeWidth={SW} />
        <Ears cx={50} cy={52} fur={fur} inner="#80FFE8" />
      </g>
      {/* floating question marks */}
      <text x="12" y="30" fontSize="16" fill="#FFD700" fontWeight="bold" fontFamily="Bangers, cursive">?</text>
      <text x="76" y="25" fontSize="12" fill="#FFD700" fontWeight="bold" fontFamily="Bangers, cursive">?</text>
      <text x="82" y="60" fontSize="10" fill="#AAFFEE" fontFamily="Bangers, cursive">?</text>
      {/* confused eyes — one squinting */}
      <ellipse cx={38} cy={52} rx={9} ry={9} fill="white" stroke={S} strokeWidth={2} />
      <circle cx={38} cy={52} r={6} fill="#008870" />
      <circle cx={36} cy={50} r={2} fill="white" />
      {/* squinting eye */}
      <ellipse cx={62} cy={52} rx={9} ry={5} fill="white" stroke={S} strokeWidth={2} />
      <ellipse cx={62} cy={52} rx={5} ry={3} fill="#008870" />
      <circle cx={60} cy={51} r={1.5} fill="white" />
      {/* raised eyebrow */}
      <path d="M 52 44 Q 62 40 72 43" stroke={S} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M 28 44 L 44 46" stroke={S} strokeWidth={2} fill="none" strokeLinecap="round" />
      <Nose cx={50} cy={61} />
      <Mouth cx={50} cy={64} type="neutral" />
      <Whiskers cx={50} cy={61} />
    </svg>
  );
}

/* ──────────── COZY  (value ☕) ──────────── */
export function CozyCat() {
  const fur = '#B8905A';
  return (
    <svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path d="M 63 106 Q 88 86 83 65" stroke="#8A6030" strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={50} cy={93} rx={27} ry={19} fill={fur} stroke={S} strokeWidth={SW} />
      <ellipse cx={50} cy={96} rx={17} ry={10} fill="#DDBB88" stroke="none" />
      {/* big coffee mug */}
      <g transform="translate(50 88)">
        <rect x={-16} y={-14} width={32} height={24} rx={5} fill="#E8C870" stroke={S} strokeWidth={2.5} />
        <path d="M 16 -10 Q 26 -10 26 -2 Q 26 6 16 6" stroke={S} strokeWidth={2.5} fill="none" />
        <rect x={-14} y={-14} width={28} height={7} rx={2} fill="#CC9920" stroke="none" />
        {/* steam */}
        <path d="M -5 -16 Q -3 -22 -5 -28" stroke="#BBBBBB" strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M 2 -16 Q 4 -22 2 -28" stroke="#BBBBBB" strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M 9 -16 Q 11 -22 9 -28" stroke="#BBBBBB" strokeWidth={2} fill="none" strokeLinecap="round" />
      </g>
      {/* head */}
      <circle cx={50} cy={52} r={27} fill={fur} stroke={S} strokeWidth={SW} />
      <Ears cx={50} cy={52} fur={fur} inner="#DDAA77" />
      {/* sleeping eyes (closed) */}
      <path d="M 30 51 Q 38 46 46 51" stroke={S} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M 54 51 Q 62 46 70 51" stroke={S} strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* eyelashes */}
      <line x1={32} y1={50} x2={31} y2={46} stroke={S} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={38} y1={47} x2={38} y2={43} stroke={S} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={62} y1={47} x2={62} y2={43} stroke={S} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={68} y1={50} x2={69} y2={46} stroke={S} strokeWidth={1.5} strokeLinecap="round" />
      {/* zzz */}
      <text x="72" y="30" fontSize="14" fill="#AACCFF" fontWeight="bold" fontFamily="Bangers, cursive">z</text>
      <text x="80" y="20" fontSize="11" fill="#AACCFF" fontWeight="bold" fontFamily="Bangers, cursive">z</text>
      <text x="86" y="12" fontSize="8" fill="#AACCFF" fontWeight="bold" fontFamily="Bangers, cursive">z</text>
      <Nose cx={50} cy={62} />
      <Mouth cx={50} cy={65} type="zzz" />
      <Whiskers cx={50} cy={62} />
    </svg>
  );
}

/* ──────────── FELIX — consensus superhero ──────────── */
export function FelixCat({ size = 200 }) {
  const fur = '#FFD700';
  const s = size / 120;
  return (
    <svg
      viewBox="0 0 120 140"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size * 1.17 }}
    >
      {/* cape */}
      <path d="M 18 70 Q 5 110 30 130 Q 50 140 60 135 Q 70 140 90 130 Q 115 110 102 70 Z"
        fill="#DD2222" stroke={S} strokeWidth={3} />
      <path d="M 30 70 Q 25 100 40 120 Q 55 130 60 128 Q 65 130 80 120 Q 95 100 90 70 Z"
        fill="#FF4444" stroke="none" opacity={0.6} />
      {/* tail */}
      <path d="M 72 105 Q 100 82 93 58" stroke="#E0AA00" strokeWidth={10} fill="none" strokeLinecap="round" />
      {/* body — muscular */}
      <ellipse cx={60} cy={94} rx={30} ry={22} fill={fur} stroke={S} strokeWidth={SW} />
      {/* abs */}
      <ellipse cx={60} cy={96} rx={17} ry={11} fill="#FFEE88" stroke="#CC9900" strokeWidth={1.5} />
      <path d="M 55 90 L 55 106" stroke="#CC9900" strokeWidth={1.5} />
      <path d="M 60 90 L 60 106" stroke="#CC9900" strokeWidth={1.5} />
      <path d="M 65 90 L 65 106" stroke="#CC9900" strokeWidth={1.5} />
      {/* lightning bolt chest */}
      <polygon points="58,78 65,78 61,86 68,86 54,100 58,90 52,90"
        fill="#FFFFFF" stroke="#CC9900" strokeWidth={1.5} />
      {/* BIG bicep arms raised */}
      <ellipse cx={22} cy={80} rx={14} ry={10} fill={fur} stroke={S} strokeWidth={3} transform="rotate(-35 22 80)" />
      <ellipse cx={98} cy={80} rx={14} ry={10} fill={fur} stroke={S} strokeWidth={3} transform="rotate(35 98 80)" />
      {/* fists raised */}
      <circle cx={12} cy={70} r={12} fill={fur} stroke={S} strokeWidth={3} />
      <circle cx={108} cy={70} r={12} fill={fur} stroke={S} strokeWidth={3} />
      {/* knuckles */}
      <path d="M 6 67 Q 12 63 18 67" stroke={S} strokeWidth={1.5} fill="none" />
      <path d="M 102 67 Q 108 63 114 67" stroke={S} strokeWidth={1.5} fill="none" />
      {/* head */}
      <circle cx={60} cy={50} r={32} fill={fur} stroke={S} strokeWidth={SW} />
      <Ears cx={60} cy={50} fur={fur} inner="#FFAAAA" size={1.1} />
      {/* star burst on ear */}
      <polygon points="90,18 93,24 100,24 95,29 97,36 90,32 83,36 85,29 80,24 87,24"
        fill="#FFD700" stroke="#CC8800" strokeWidth={1.5} />
      {/* SUPER EXCITED eyes — massive */}
      <ellipse cx={46} cy={49} rx={13} ry={14} fill="white" stroke={S} strokeWidth={2.5} />
      <ellipse cx={74} cy={49} rx={13} ry={14} fill="white" stroke={S} strokeWidth={2.5} />
      <circle cx={46} cy={49} r={9} fill="#FF4400" />
      <circle cx={74} cy={49} r={9} fill="#FF4400" />
      <circle cx={43} cy={46} r={4} fill="white" />
      <circle cx={71} cy={46} r={4} fill="white" />
      <circle cx={50} cy={53} r={2} fill="white" opacity={0.9} />
      <circle cx={78} cy={53} r={2} fill="white" opacity={0.9} />
      {/* star in each eye */}
      <text x="43" y="51" textAnchor="middle" fontSize="6" fill="#FFD700">★</text>
      <text x="71" y="51" textAnchor="middle" fontSize="6" fill="#FFD700">★</text>
      {/* raised eyebrows (surprised) */}
      <path d="M 33 35 Q 46 29 55 34" stroke={S} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M 65 34 Q 74 29 87 35" stroke={S} strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* big open excited mouth */}
      <ellipse cx={60} cy={64} rx={12} ry={9} fill="#CC2222" stroke={S} strokeWidth={2.5} />
      <ellipse cx={60} cy={68} rx={8} ry={5} fill="#FF4444" stroke="none" />
      {/* nose */}
      <ellipse cx={60} cy={60} rx={5} ry={4} fill="#FF88AA" stroke={S} strokeWidth={2} />
      {/* whiskers */}
      <line x1={25} y1={59} x2={52} y2={62} stroke={S} strokeWidth={2} strokeLinecap="round" />
      <line x1={25} y1={65} x2={52} y2={64} stroke={S} strokeWidth={2} strokeLinecap="round" />
      <line x1={68} y1={62} x2={95} y2={59} stroke={S} strokeWidth={2} strokeLinecap="round" />
      <line x1={68} y1={64} x2={95} y2={65} stroke={S} strokeWidth={2} strokeLinecap="round" />
      {/* sparkles around */}
      <text x="5" y="55" fontSize="16" fill="#FFD700">✦</text>
      <text x="105" y="45" fontSize="12" fill="#FF4499">✦</text>
      <text x="8" y="95" fontSize="10" fill="#00FFAA">✦</text>
      <text x="105" y="100" fontSize="14" fill="#FFD700">✦</text>
    </svg>
  );
}

/* ──────────── CARD BACK PATTERN ──────────── */
export function CardBack() {
  return (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width={100} height={120} fill="#13131F" />
      {/* paw pattern */}
      {[
        [15, 15], [45, 10], [75, 18], [10, 45], [38, 40], [68, 38], [88, 48],
        [20, 72], [50, 68], [80, 75], [12, 98], [42, 95], [72, 100], [88, 90],
      ].map(([x, y], i) => (
        <g key={i} opacity={0.18} transform={`translate(${x} ${y}) scale(0.4)`}>
          {/* paw print */}
          <circle cx={0} cy={0} r={8} fill="#FF2D78" />
          <circle cx={-9} cy={-9} r={5} fill="#FF2D78" />
          <circle cx={0} cy={-12} r={5} fill="#FF2D78" />
          <circle cx={9} cy={-9} r={5} fill="#FF2D78" />
        </g>
      ))}
      {/* center cat icon */}
      <text x="50" y="68" textAnchor="middle" fontSize="32" opacity={0.4}>🐱</text>
      {/* border */}
      <rect x={3} y={3} width={94} height={114} rx={10} fill="none" stroke="#2A2A40" strokeWidth={2} />
    </svg>
  );
}

/* ──────────── DATA MAP ──────────── */
export const CAT_VALUES = ['1', '2', '3', '5', '8', '13', '21', '?', '☕'];

export const CAT_DATA = {
  '1':  { name: 'Luna',    label: 'Luna ♀',    gender: 'f', color: '#D9A8CC', component: LunaCat    },
  '2':  { name: 'Milo',    label: 'Milo ♂',    gender: 'm', color: '#7AAFD0', component: MiloCat    },
  '3':  { name: 'Zoé',     label: 'Zoé ♀',     gender: 'f', color: '#F4885A', component: ZoeCat     },
  '5':  { name: 'Max',     label: 'Max ♂',     gender: 'm', color: '#C4935A', component: MaxCat     },
  '8':  { name: 'Rex',     label: 'Rex ♂',     gender: 'm', color: '#F4721A', component: RexCat     },
  '13': { name: 'Mystica', label: 'Mystica ♀', gender: 'f', color: '#AA55DD', component: MysticaCat },
  '21': { name: 'Shadow',  label: 'Shadow ♂',  gender: 'm', color: '#1C2A3A', component: ShadowCat  },
  '?':  { name: 'Cleo',    label: 'Cleo ♀',    gender: 'f', color: '#20C9A8', component: CleoCat    },
  '☕': { name: 'Cozy',    label: 'Cozy ☕',   gender: 'n', color: '#B8905A', component: CozyCat    },
};
