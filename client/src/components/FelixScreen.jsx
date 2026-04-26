import { useEffect, useState } from 'react';

const PAWS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: 5 + (i * 7) % 90,
  delay: (i * 0.15) % 1.8,
  duration: 2 + (i * 0.3) % 1.5,
  size: 20 + (i * 4) % 14,
}));

const BLACK_CAT_IMG = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f408-200d-2b1b.svg';

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

  const glow = phase >= 3
    ? '0 0 0 4px #FCD34D, 0 0 50px rgba(252,211,77,0.5), 0 0 100px rgba(252,211,77,0.2)'
    : '0 4px 30px rgba(0,0,0,0.5)';

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

        {/* Cat + costume */}
        <div className="relative flex items-center justify-center"
          style={{
            transform: phase >= 1 ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>

          {/* Cape */}
          {phase >= 3 && (
            <div className="absolute -bottom-5 left-1/2 -z-10"
              style={{
                transform: 'translateX(-50%)',
                animation: 'capeUnfurl 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
              }}>
              <div style={{
                width: 0, height: 0,
                borderLeft: '72px solid transparent',
                borderRight: '72px solid transparent',
                borderTop: '115px solid #DC2626',
                filter: 'drop-shadow(0 8px 16px rgba(220,38,38,0.6))',
              }} />
            </div>
          )}

          {/* Cat image in circle */}
          <div style={{
            width: 164,
            height: 164,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #1E293B, #0F172A)',
            border: `4px solid ${phase >= 3 ? '#FCD34D' : '#334155'}`,
            boxShadow: glow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transition: 'border 0.3s, box-shadow 0.4s',
            position: 'relative',
          }}>
            <img
              src={BLACK_CAT_IMG}
              alt="Captain Felix"
              width={130}
              height={130}
              style={{
                display: 'block',
                filter: phase >= 3
                  ? 'drop-shadow(0 0 12px rgba(252,211,77,0.7))'
                  : 'none',
                transition: 'filter 0.3s',
                marginTop: 8,
              }}
              draggable={false}
            />
          </div>

          {/* Hero mask overlay */}
          {phase >= 3 && (
            <div className="absolute"
              style={{
                top: '34%', left: '50%',
                transform: 'translateX(-50%)',
                width: '68%',
                animation: 'maskSlide 0.3s ease-out forwards',
              }}>
              <svg viewBox="0 0 100 28" width="100%">
                <path d="M5,14 Q25,2 50,14 Q75,2 95,14 L95,22 Q75,10 50,20 Q25,10 5,22 Z" fill="#1E3A8A" opacity="0.88"/>
                <ellipse cx="22" cy="12" rx="13" ry="9" fill="#1E3A8A" opacity="0.88"/>
                <ellipse cx="78" cy="12" rx="13" ry="9" fill="#1E3A8A" opacity="0.88"/>
              </svg>
            </div>
          )}

          {/* Star badge */}
          {phase >= 3 && (
            <div className="absolute -bottom-1 -right-1 text-2xl"
              style={{ animation: 'badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
              ⭐
            </div>
          )}
        </div>

        {/* Value + FELIX */}
        {phase >= 4 && (
          <div className="text-center" style={{ animation: 'heroTextIn 0.45s ease-out forwards' }}>
            <div className="text-7xl font-extrabold text-white tracking-tight drop-shadow-lg leading-none mb-3">
              {value}
            </div>
            <div className="text-yellow-400 font-extrabold text-2xl tracking-widest uppercase"
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
