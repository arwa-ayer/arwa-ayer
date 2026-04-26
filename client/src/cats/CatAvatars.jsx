export const AVATARS = [
  { id: 0, name: 'Luna',   bg1: '#C4B5FD', bg2: '#7C3AED', fur1: '#F5F0E8', fur2: '#C8BDAA', eye1: '#DDD6FE', eye2: '#7C3AED' },
  { id: 1, name: 'Milo',   bg1: '#FDBA74', bg2: '#EA580C', fur1: '#FED7AA', fur2: '#C2773A', eye1: '#BBF7D0', eye2: '#15803D' },
  { id: 2, name: 'Shadow', bg1: '#5EEAD4', bg2: '#0F766E', fur1: '#6B7280', fur2: '#111827', eye1: '#FDE68A', eye2: '#D97706' },
  { id: 3, name: 'Cleo',   bg1: '#F9A8D4', bg2: '#DB2777', fur1: '#FDF2F8', fur2: '#F0ABCB', eye1: '#BFDBFE', eye2: '#2563EB' },
  { id: 4, name: 'Max',    bg1: '#93C5FD', bg2: '#2563EB', fur1: '#E2E8F0', fur2: '#94A3B8', eye1: '#FED7AA', eye2: '#EA580C' },
  { id: 5, name: 'Zoe',    bg1: '#FDE68A', bg2: '#D97706', fur1: '#FEF3C7', fur2: '#E8A317', eye1: '#A7F3D0', eye2: '#059669' },
  { id: 6, name: 'Mochi',  bg1: '#7DD3FC', bg2: '#0284C7', fur1: '#FFFBEB', fur2: '#FEF3C7', eye1: '#BAE6FD', eye2: '#0369A1' },
  { id: 7, name: 'Nori',   bg1: '#6EE7B7', bg2: '#059669', fur1: '#D97706', fur2: '#78350F', eye1: '#FECACA', eye2: '#DC2626' },
  { id: 8, name: 'Cookie', bg1: '#FCA5A5', bg2: '#DC2626', fur1: '#F8FAFC', fur2: '#1E293B', eye1: '#6EE7B7', eye2: '#059669' },
];

function CatFace({ av }) {
  const { id, bg1, bg2, fur1, fur2, eye1, eye2 } = av;
  const p = `c${id}`;

  return (
    <>
      <defs>
        <clipPath id={`${p}-clip`}>
          <circle cx="100" cy="100" r="100" />
        </clipPath>
        <radialGradient id={`${p}-bg`} cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor={bg1} />
          <stop offset="100%" stopColor={bg2} />
        </radialGradient>
        <radialGradient id={`${p}-fur`} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor={fur1} />
          <stop offset="100%" stopColor={fur2} />
        </radialGradient>
        <radialGradient id={`${p}-eye`} cx="30%" cy="25%" r="78%">
          <stop offset="0%" stopColor={eye1} />
          <stop offset="100%" stopColor={eye2} />
        </radialGradient>
      </defs>

      <g clipPath={`url(#${p}-clip)`}>
        {/* Background */}
        <circle cx="100" cy="100" r="100" fill={`url(#${p}-bg)`} />

        {/* Ears (behind head) */}
        <polygon points="36,96 22,18 80,70" fill={`url(#${p}-fur)`} />
        <polygon points="120,70 178,18 164,96" fill={`url(#${p}-fur)`} />
        {/* Inner ears */}
        <polygon points="46,90 36,32 74,68" fill="#FFB5C8" opacity="0.8" />
        <polygon points="126,68 164,32 154,90" fill="#FFB5C8" opacity="0.8" />

        {/* Head */}
        <ellipse cx="100" cy="122" rx="76" ry="70" fill={`url(#${p}-fur)`} />

        {/* Eye whites */}
        <ellipse cx="72" cy="108" rx="26" ry="24" fill="white" />
        <ellipse cx="128" cy="108" rx="26" ry="24" fill="white" />

        {/* Iris */}
        <circle cx="72" cy="109" r="18" fill={`url(#${p}-eye)`} />
        <circle cx="128" cy="109" r="18" fill={`url(#${p}-eye)`} />

        {/* Pupil — vertical slit */}
        <ellipse cx="72" cy="110" rx="8" ry="14" fill="#0d0d0d" />
        <ellipse cx="128" cy="110" rx="8" ry="14" fill="#0d0d0d" />

        {/* Catch lights */}
        <circle cx="66" cy="102" r="5.5" fill="white" />
        <circle cx="77" cy="105" r="2.5" fill="white" opacity="0.65" />
        <circle cx="122" cy="102" r="5.5" fill="white" />
        <circle cx="133" cy="105" r="2.5" fill="white" opacity="0.65" />

        {/* Eye upper shadow for depth */}
        <ellipse cx="72" cy="99" rx="24" ry="11" fill="#000" opacity="0.09" />
        <ellipse cx="128" cy="99" rx="24" ry="11" fill="#000" opacity="0.09" />

        {/* Nose */}
        <path d="M100,132 L94,125 L106,125 Z" fill="#F9A8D4" />
        {/* Philtrum */}
        <line x1="100" y1="132" x2="100" y2="137" stroke="#C06070" strokeWidth="1.5" strokeLinecap="round" />
        {/* Mouth */}
        <path d="M93,137 Q100,144 107,137" fill="none" stroke="#C06070" strokeWidth="1.5" strokeLinecap="round" />

        {/* Whiskers */}
        <line x1="12" y1="131" x2="84" y2="133" stroke="rgba(80,80,80,0.35)" strokeWidth="1.2" />
        <line x1="14" y1="140" x2="84" y2="138" stroke="rgba(80,80,80,0.35)" strokeWidth="1.2" />
        <line x1="116" y1="133" x2="188" y2="131" stroke="rgba(80,80,80,0.35)" strokeWidth="1.2" />
        <line x1="116" y1="138" x2="186" y2="140" stroke="rgba(80,80,80,0.35)" strokeWidth="1.2" />

        {/* Cheek blush */}
        <ellipse cx="52" cy="130" rx="20" ry="13" fill="#FFB5B5" opacity="0.22" />
        <ellipse cx="148" cy="130" rx="20" ry="13" fill="#FFB5B5" opacity="0.22" />
      </g>
    </>
  );
}

export function CatAvatar({ id, size = 64 }) {
  const av = AVATARS[id] ?? AVATARS[0];
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, display: 'block', borderRadius: '50%' }}>
      <CatFace av={av} />
    </svg>
  );
}
