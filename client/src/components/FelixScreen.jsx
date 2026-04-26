import { useEffect, useState } from 'react';

const PAWS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: 5 + (i * 7) % 90,
  delay: (i * 0.15) % 1.8,
  duration: 2 + (i * 0.3) % 1.5,
  size: 18 + (i * 5) % 16,
}));

function BlackSuperheroCat({ size = 148, showCostume }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, display: 'block', borderRadius: '50%' }}>
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#0F0F1A" />
        </radialGradient>
        <radialGradient id="eyeGlow" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <circle cx="100" cy="100" r="100" fill="url(#bgGlow)" />

      {/* Cape */}
      {showCostume && (
        <polygon points="62,138 100,196 138,138 128,148 100,180 72,148"
          fill="#B91C1C" opacity="0.95" />
      )}

      {/* Ears */}
      <polygon points="58,82 44,22 86,70" fill="#111" />
      <polygon points="142,82 156,22 114,70" fill="#111" />
      {/* Inner ears */}
      <polygon points="63,78 52,36 82,70" fill="#3B0000" opacity="0.7" />
      <polygon points="137,78 148,36 118,70" fill="#3B0000" opacity="0.7" />

      {/* Head */}
      <circle cx="100" cy="108" r="52" fill="#111" />

      {/* Eye glow halos */}
      <ellipse cx="80" cy="103" rx="17" ry="16" fill="#F59E0B" opacity="0.18" />
      <ellipse cx="120" cy="103" rx="17" ry="16" fill="#F59E0B" opacity="0.18" />

      {/* Eyes — sclera */}
      <ellipse cx="80" cy="103" rx="13" ry="14" fill="#1a1000" />
      <ellipse cx="120" cy="103" rx="13" ry="14" fill="#1a1000" />

      {/* Eyes — iris */}
      <ellipse cx="80" cy="103" rx="11" ry="12" fill="url(#eyeGlow)" />
      <ellipse cx="120" cy="103" rx="11" ry="12" fill="url(#eyeGlow)" />

      {/* Pupils */}
      <ellipse cx="80" cy="104" rx="4" ry="10" fill="#060606" />
      <ellipse cx="120" cy="104" rx="4" ry="10" fill="#060606" />

      {/* Eye catch lights */}
      <circle cx="75" cy="97" r="3.5" fill="white" opacity="0.55" />
      <circle cx="115" cy="97" r="3.5" fill="white" opacity="0.55" />
      <circle cx="83" cy="100" r="1.5" fill="white" opacity="0.3" />
      <circle cx="123" cy="100" r="1.5" fill="white" opacity="0.3" />

      {/* Hero mask */}
      {showCostume && (
        <>
          <path d="M55,96 Q80,82 100,96 Q120,82 145,96 L142,104 Q120,90 100,103 Q80,90 58,104 Z"
            fill="#1E3A8A" opacity="0.9" />
          <ellipse cx="74" cy="94" rx="12" ry="8" fill="#1E3A8A" opacity="0.9" />
          <ellipse cx="126" cy="94" rx="12" ry="8" fill="#1E3A8A" opacity="0.9" />
        </>
      )}

      {/* Nose */}
      <path d="M100,119 L96,114 L104,114 Z" fill="#4B0082" opacity="0.8" />
      {/* Mouth */}
      <path d="M94,122 Q100,128 106,122" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />

      {/* Whiskers */}
      <line x1="20" y1="118" x2="86" y2="120" stroke="rgba(255,255,255,0.22)" strokeWidth="1.3" />
      <line x1="22" y1="126" x2="86" y2="125" stroke="rgba(255,255,255,0.22)" strokeWidth="1.3" />
      <line x1="114" y1="120" x2="180" y2="118" stroke="rgba(255,255,255,0.22)" strokeWidth="1.3" />
      <line x1="114" y1="125" x2="178" y2="126" stroke="rgba(255,255,255,0.22)" strokeWidth="1.3" />

      {/* Body */}
      <ellipse cx="100" cy="168" rx="36" ry="26" fill="#111" />

      {/* Star badge on chest */}
      {showCostume && (
        <text x="100" y="176" textAnchor="middle" fontSize="18" fill="#FCD34D" fontFamily="sans-serif">★</text>
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
      {/* White flash */}
      {phase === 2 && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ animation: 'heroFlash 0.35s ease-out forwards' }} />
      )}

      {/* Floating paw prints */}
      {phase >= 5 && PAWS.map(p => (
        <div key={p.id} className="absolute pointer-events-none select-none"
          style={{
            left: `${p.left}%`, bottom: '-10px',
            fontSize: p.size,
            animation: `starRise ${p.duration}s ease-out ${p.delay}s infinite`,
          }}>
          🐾
        </div>
      ))}

      <div className="flex flex-col items-center gap-5 px-6" onClick={e => e.stopPropagation()}>

        {/* Cat */}
        <div
          style={{
            transform: phase >= 1 ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: phase >= 3 ? '0 0 0 4px #FCD34D, 0 0 40px rgba(252,211,77,0.45)' : 'none',
            borderRadius: '50%',
            transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
          }}
        >
          <BlackSuperheroCat size={152} showCostume={phase >= 3} />
        </div>

        {/* Value + FELIX */}
        {phase >= 4 && (
          <div className="text-center" style={{ animation: 'heroTextIn 0.45s ease-out forwards' }}>
            <div className="text-7xl font-extrabold text-white tracking-tight drop-shadow-lg leading-none mb-2">
              {value}
            </div>
            <div className="text-yellow-400 font-extrabold text-2xl tracking-widest uppercase"
              style={{ letterSpacing: '0.18em' }}>
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
            className="mt-1 px-7 py-2.5 bg-yellow-400 text-gray-900 font-bold rounded-xl
                       hover:bg-yellow-300 transition-colors shadow-lg"
            style={{ animation: 'heroTextIn 0.45s 0.3s ease-out both' }}>
            Continuer
          </button>
        )}
      </div>
    </div>
  );
}
