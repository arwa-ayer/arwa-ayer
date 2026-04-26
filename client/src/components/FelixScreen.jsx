import { useEffect, useState, useRef } from 'react';

const PAWS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: 5 + (i * 7) % 90,
  delay: (i * 0.15) % 1.8,
  duration: 2 + (i * 0.3) % 1.5,
  size: 18 + (i * 5) % 16,
}));

export default function FelixScreen({ value, onDismiss }) {
  const [phase, setPhase] = useState(0);
  // 0=hidden 1=cat-in 2=flash 3=hero 4=text 5=stars

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
      {/* White transformation flash */}
      {phase === 2 && (
        <div className="absolute inset-0 pointer-events-none" style={{ animation: 'heroFlash 0.35s ease-out forwards' }} />
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

      {/* Main content */}
      <div className="flex flex-col items-center gap-5 px-6" onClick={e => e.stopPropagation()}>

        {/* Cat + superhero costume */}
        <div className="relative flex items-center justify-center"
          style={{
            transform: phase >= 1 ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Cape behind cat */}
          {phase >= 3 && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 -z-10"
              style={{ animation: 'capeUnfurl 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
              <div style={{
                width: 0, height: 0,
                borderLeft: '70px solid transparent',
                borderRight: '70px solid transparent',
                borderTop: '110px solid #DC2626',
                filter: 'drop-shadow(0 6px 12px rgba(220,38,38,0.5))',
              }} />
            </div>
          )}

          {/* Cat avatar */}
          <img
            src="https://cat-avatars.vercel.app/api/cat?name=CaptainFelix"
            alt="Captain Felix"
            width={148}
            height={148}
            style={{
              borderRadius: '50%',
              display: 'block',
              filter: 'grayscale(1) brightness(0.42) contrast(1.3)',
              border: phase >= 3 ? '4px solid #FCD34D' : '4px solid white',
              boxShadow: phase >= 3
                ? '0 0 0 4px rgba(252,211,77,0.3), 0 0 40px rgba(252,211,77,0.5)'
                : '0 4px 20px rgba(0,0,0,0.4)',
              transition: 'border 0.2s, box-shadow 0.3s',
            }}
          />

          {/* Eye mask */}
          {phase >= 3 && (
            <div className="absolute"
              style={{
                top: '38%', left: '50%',
                transform: 'translateX(-50%)',
                width: '72%',
                animation: 'maskSlide 0.3s ease-out forwards',
              }}>
              <svg viewBox="0 0 100 28" width="100%" height="auto">
                <path d="M5,14 Q25,2 50,14 Q75,2 95,14 L95,22 Q75,10 50,20 Q25,10 5,22 Z" fill="#111827" opacity="0.92" />
                <ellipse cx="22" cy="12" rx="13" ry="9" fill="#111827" />
                <ellipse cx="78" cy="12" rx="13" ry="9" fill="#111827" />
                <ellipse cx="19" cy="10" rx="4" ry="3" fill="white" opacity="0.15" />
                <ellipse cx="75" cy="10" rx="4" ry="3" fill="white" opacity="0.15" />
              </svg>
            </div>
          )}

          {/* Star badge on chest */}
          {phase >= 3 && (
            <div className="absolute -bottom-1 -right-1 text-2xl leading-none select-none"
              style={{ animation: 'badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
              ⭐
            </div>
          )}
        </div>

        {/* Consensus value + labels */}
        {phase >= 4 && (
          <div className="text-center" style={{ animation: 'heroTextIn 0.45s ease-out forwards' }}>
            <div className="text-7xl font-extrabold text-white tracking-tight drop-shadow-lg leading-none mb-2">
              {value}
            </div>
            <div className="text-yellow-400 font-extrabold text-2xl tracking-widest uppercase" style={{ letterSpacing: '0.18em' }}>
              F E L I X
            </div>
          </div>
        )}

        {phase >= 4 && (
          <p className="text-white/60 text-sm font-medium" style={{ animation: 'heroTextIn 0.45s 0.15s ease-out both' }}>
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
