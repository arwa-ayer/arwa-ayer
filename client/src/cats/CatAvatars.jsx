// 9 circular cat avatars — cartoon style, colored backgrounds

export const AVATARS = [
  { id: 0, name: 'Luna',   bg: '#7C3AED', fur: '#F5F0E8', iris: '#7C3AED' },
  { id: 1, name: 'Milo',   bg: '#EA580C', fur: '#F4A460', iris: '#16A34A' },
  { id: 2, name: 'Shadow', bg: '#0F766E', fur: '#2D3748', iris: '#FBBF24' },
  { id: 3, name: 'Cleo',   bg: '#DB2777', fur: '#F9A8D4', iris: '#1D4ED8' },
  { id: 4, name: 'Max',    bg: '#2563EB', fur: '#94A3B8', iris: '#F97316' },
  { id: 5, name: 'Zoe',    bg: '#D97706', fur: '#FB923C', iris: '#15803D' },
  { id: 6, name: 'Mochi',  bg: '#0284C7', fur: '#FEF3C7', iris: '#1D4ED8' },
  { id: 7, name: 'Nori',   bg: '#059669', fur: '#92400E', iris: '#DC2626' },
  { id: 8, name: 'Cookie', bg: '#DC2626', fur: '#1E293B', iris: '#10B981' },
];

function CatFace({ fur, iris, x = 50, y = 50, r = 28 }) {
  const earH = r * 0.55;
  const eyeY = y - r * 0.1;
  const eyeX = r * 0.38;
  const noseY = y + r * 0.22;
  return (
    <>
      {/* Body */}
      <ellipse cx={x} cy={y + r * 0.75} rx={r * 0.85} ry={r * 0.6} fill={fur} />
      {/* Head */}
      <circle cx={x} cy={y} r={r} fill={fur} />
      {/* Ears */}
      <polygon points={`${x - r * 0.7},${y - r * 0.65} ${x - r * 0.95},${y - r - earH * 0.4} ${x - r * 0.35},${y - r * 0.8}`} fill={fur} />
      <polygon points={`${x + r * 0.7},${y - r * 0.65} ${x + r * 0.95},${y - r - earH * 0.4} ${x + r * 0.35},${y - r * 0.8}`} fill={fur} />
      {/* Inner ears */}
      <polygon points={`${x - r * 0.68},${y - r * 0.68} ${x - r * 0.88},${y - r - earH * 0.2} ${x - r * 0.4},${y - r * 0.82}`} fill="#FFB5B5" opacity="0.7" />
      <polygon points={`${x + r * 0.68},${y - r * 0.68} ${x + r * 0.88},${y - r - earH * 0.2} ${x + r * 0.4},${y - r * 0.82}`} fill="#FFB5B5" opacity="0.7" />
      {/* Eyes */}
      <ellipse cx={x - eyeX} cy={eyeY} rx={r * 0.22} ry={r * 0.25} fill="white" />
      <ellipse cx={x + eyeX} cy={eyeY} rx={r * 0.22} ry={r * 0.25} fill="white" />
      <circle cx={x - eyeX} cy={eyeY} r={r * 0.15} fill={iris} />
      <circle cx={x + eyeX} cy={eyeY} r={r * 0.15} fill={iris} />
      <circle cx={x - eyeX} cy={eyeY} r={r * 0.08} fill="#111" />
      <circle cx={x + eyeX} cy={eyeY} r={r * 0.08} fill="#111" />
      <circle cx={x - eyeX - r * 0.05} cy={eyeY - r * 0.06} r={r * 0.04} fill="white" />
      <circle cx={x + eyeX - r * 0.05} cy={eyeY - r * 0.06} r={r * 0.04} fill="white" />
      {/* Nose */}
      <ellipse cx={x} cy={noseY} rx={r * 0.09} ry={r * 0.07} fill="#FF8FA3" />
      {/* Mouth */}
      <path d={`M ${x - r * 0.12} ${noseY + r * 0.08} Q ${x} ${noseY + r * 0.2} ${x + r * 0.12} ${noseY + r * 0.08}`}
        stroke="#C06070" strokeWidth={r * 0.04} fill="none" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1={x - r * 0.8} y1={noseY - r * 0.04} x2={x - r * 0.15} y2={noseY} stroke="#999" strokeWidth="0.8" />
      <line x1={x - r * 0.8} y1={noseY + r * 0.1} x2={x - r * 0.15} y2={noseY + r * 0.08} stroke="#999" strokeWidth="0.8" />
      <line x1={x + r * 0.15} y1={noseY} x2={x + r * 0.8} y2={noseY - r * 0.04} stroke="#999" strokeWidth="0.8" />
      <line x1={x + r * 0.15} y1={noseY + r * 0.08} x2={x + r * 0.8} y2={noseY + r * 0.1} stroke="#999" strokeWidth="0.8" />
    </>
  );
}

export function CatAvatar({ id, size = 64 }) {
  const av = AVATARS[id] ?? AVATARS[0];
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, borderRadius: '50%', display: 'block' }}>
      <circle cx="50" cy="50" r="50" fill={av.bg} />
      <CatFace fur={av.fur} iris={av.iris} x={50} y={48} r={28} />
    </svg>
  );
}
