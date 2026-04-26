import { useEffect, useState } from 'react';

const PAWS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: 5 + (i * 7) % 90,
  delay: (i * 0.15) % 1.8,
  duration: 2 + (i * 0.3) % 1.5,
  size: 20 + (i * 4) % 14,
}));

function HappyTuxedoCat({ size = 152, showCape }) {
  return (
    <svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, display: 'block', borderRadius: '50%' }}>

      {/* Beige background */}
      <circle cx="100" cy="100" r="100" fill="#E8D4A8" />

      {/* Left ear */}
      <polygon points="46,84 32,16 80,70" fill="#232323" />
      <polygon points="51,80 40,28 74,68" fill="#5A3535" opacity="0.55" />
      {/* Right ear */}
      <polygon points="154,84 168,16 120,70" fill="#232323" />
      <polygon points="149,80 160,28 126,68" fill="#5A3535" opacity="0.55" />

      {/* Head */}
      <circle cx="100" cy="108" r="68" fill="#232323" />

      {/* White face patch — narrow at top, wide at muzzle */}
      <path d="M100,44 C96,44 80,66 76,92 C73,115 76,146 100,154 C124,146 127,115 124,92 C120,66 104,44 100,44 Z"
        fill="#F0EDE4" />

      {/* Eyebrow marks */}
      <path d="M62,86 Q72,80 82,86" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M118,86 Q128,80 138,86" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />

      {/* Closed happy eyes */}
      <path d="M62,96 Q74,84 86,96" fill="none" stroke="#1a1a1a" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M114,96 Q126,84 138,96" fill="none" stroke="#1a1a1a" strokeWidth="4.5" strokeLinecap="round" />

      {/* Nose */}
      <ellipse cx="100" cy="114" rx="7" ry="5.5" fill="#1a1a1a" />

      {/* Open mouth cavity */}
      <path d="M78,124 Q100,154 122,124 Z" fill="#1a1a1a" />
      {/* Upper lip edge */}
      <path d="M78,124 Q100,120 122,124" fill="none" stroke="#F0EDE4" strokeWidth="2.2" strokeLinecap="round" />
      {/* Tongue */}
      <ellipse cx="100" cy="141" rx="15" ry="9" fill="#E8697A" />
      {/* Tongue center line */}
      <line x1="100" y1="133" x2="100" y2="148" stroke="#D4556A" strokeWidth="1.5" />

      {/* Whiskers left */}
      <line x1="22" y1="112" x2="80" y2="117" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="24" y1="122" x2="80" y2="122" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="28" y1="131" x2="80" y2="128" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
      {/* Whiskers right */}
      <line x1="120" y1="117" x2="178" y2="112" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="120" y1="122" x2="176" y2="122" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="120" y1="128" x2="172" y2="131" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="100" cy="192" rx="56" ry="38" fill="#232323" />
      {/* White chest */}
      <ellipse cx="100" cy="188" rx="32" ry="30" fill="#F0EDE4" />

      {/* Cape */}
      {showCape && (
        <polygon points="52,172 100,210 148,172 136,185 100,205 64,185"
          fill="#B91C1C" opacity="0.95" />
      )}
    </svg>
  );
}

export default function FelixScreen({ value, onDismiss }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 60),
      setTimeout(() => setPhase(2), 850),
      setTimeout(() => setPhase(3), 1050),
      setTimeout(() => setPhase(4), 1450),
      setTimeout(() => setPhase(5), 1750),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' || e.key === 'Enter') onDismiss(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      onClick={onDismiss}
    >
      {/* Flash */}
      {phase === 2 && (
        <div className="absolute inset-0 pointer-events-none bg-white"
          style={{ animation: 'heroFlash 0.35s ease-out forwards' }} />
      )}

      {/* Floating paws */}
      {phase >= 5 && PAWS.map(p => (
        <div key={p.id} className="absolute pointer-events-none select-none"
          style={{
            left: `${p.left}%`, bottom: '-10px',
            fontSize: p.size,
            animation: `starRise ${p.duration}s ease-out ${p.delay}s infinite`,
          }}>🐾</div>
      ))}

      <div className="flex flex-col items-center gap-6 px-6" onClick={e => e.stopPropagation()}>

        {/* Cat */}
        <div
          style={{
            transform: phase >= 1 ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
            borderRadius: '50%',
            boxShadow: phase >= 3
              ? '0 0 0 5px #FCD34D, 0 0 50px rgba(252,211,77,0.5)'
              : '0 4px 30px rgba(0,0,0,0.5)',
            transition: 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
          }}
        >
          <HappyTuxedoCat size={160} showCape={phase >= 3} />
        </div>

        {/* Value + FELIX */}
        {phase >= 4 && (
          <div className="text-center" style={{ animation: 'heroTextIn 0.45s ease-out forwards' }}>
            <div className="text-7xl font-extrabold text-white tracking-tight drop-shadow-lg leading-none mb-3">
              {value}
            </div>
            <div className="text-yellow-400 font-extrabold text-2xl tracking-widest"
              style={{ letterSpacing: '0.2em' }}>
              F E L I X
            </div>
          </div>
        )}

        {phase >= 4 && (
          <p className="text-white/60 text-sm font-medium"
            style={{ animation: 'heroTextIn 0.45s 0.15s ease-out both' }}>
            Tout le monde est d'accord 🐾
          </p>
        )}

        {phase >= 4 && (
          <button onClick={onDismiss}
            className="px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl text-base
                       hover:bg-yellow-300 transition-colors shadow-lg"
            style={{ animation: 'heroTextIn 0.45s 0.3s ease-out both' }}>
            Continuer
          </button>
        )}
      </div>
    </div>
  );
}
