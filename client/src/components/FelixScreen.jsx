import { useEffect, useState } from 'react';

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: 4 + (i * 6.2) % 92,
  delay: (i * 0.12) % 2,
  duration: 1.8 + (i * 0.25) % 1.4,
  size: 18 + (i * 5) % 16,
  icon: i % 3 === 0 ? '⚡' : '🐾',
}));

function EnergyRing({ visible, size }) {
  if (!visible) return null;
  const r = size / 2 + 14;
  const cx = r + 2;
  return (
    <div className="absolute pointer-events-none" style={{
      top: -(r - size / 2) - 2,
      left: -(r - size / 2) - 2,
      width: cx * 2,
      height: cx * 2,
      animation: 'spin 2.5s linear infinite',
    }}>
      <svg viewBox={`0 0 ${cx * 2} ${cx * 2}`} width={cx * 2} height={cx * 2}>
        <circle cx={cx} cy={cx} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="3.5"
          strokeDasharray="22 10" strokeLinecap="round" />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
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

  const catSize = 172;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #1E1B4B 0%, #0F172A 70%)',
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

      {/* Background energy glow */}
      {phase >= 3 && (
        <div className="absolute pointer-events-none" style={{
          width: 500, height: 500,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -62%)',
          background: 'radial-gradient(circle, rgba(252,211,77,0.12) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)',
          animation: 'bgPulse 2s ease-in-out infinite',
        }} />
      )}

      {/* Particles */}
      {phase >= 5 && PARTICLES.map(p => (
        <div key={p.id} className="absolute pointer-events-none select-none"
          style={{
            left: `${p.left}%`, bottom: '-10px',
            fontSize: p.size,
            animation: `starRise ${p.duration}s ease-out ${p.delay}s infinite`,
          }}>{p.icon}</div>
      ))}

      <div className="flex flex-col items-center gap-6 px-6" onClick={e => e.stopPropagation()}>

        {/* Cat with power effects */}
        <div className="relative flex items-center justify-center"
          style={{
            transform: phase >= 1 ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>

          {/* Rotating energy ring */}
          <EnergyRing visible={phase >= 3} size={catSize} />

          {/* Second slower counter-rotating ring */}
          {phase >= 3 && (
            <div className="absolute pointer-events-none" style={{
              top: -28,
              left: -28,
              width: catSize + 56,
              height: catSize + 56,
              animation: 'spinReverse 4s linear infinite',
            }}>
              <svg viewBox={`0 0 ${catSize + 56} ${catSize + 56}`} width={catSize + 56} height={catSize + 56}>
                <circle cx={(catSize + 56) / 2} cy={(catSize + 56) / 2} r={(catSize + 56) / 2 - 4}
                  fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="2"
                  strokeDasharray="8 18" strokeLinecap="round" />
              </svg>
            </div>
          )}

          {/* Cat image */}
          <div style={{
            width: catSize,
            height: catSize,
            borderRadius: '50%',
            overflow: 'hidden',
            border: phase >= 3 ? '4px solid #FCD34D' : '4px solid #334155',
            boxShadow: phase >= 3
              ? '0 0 0 2px #F97316, 0 0 40px rgba(252,211,77,0.6), 0 0 80px rgba(99,102,241,0.35)'
              : '0 4px 30px rgba(0,0,0,0.5)',
            transition: 'border 0.3s, box-shadow 0.4s',
            animation: phase >= 3 ? 'powerGlow 1.8s ease-in-out infinite' : 'none',
          }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/172px-Cat_August_2010-4.jpg"
              alt="Mighty Felix"
              width={catSize}
              height={catSize}
              style={{ display: 'block', objectFit: 'cover', width: catSize, height: catSize }}
              draggable={false}
            />
          </div>

          {/* Lightning bolts around cat */}
          {phase >= 3 && ['⚡', '✨', '⚡', '✨'].map((icon, i) => (
            <div key={i} className="absolute pointer-events-none select-none text-xl"
              style={{
                top: ['10%', '10%', '75%', '75%'][i],
                left: ['10%', '75%', '10%', '75%'][i],
                animation: `badgePop 0.4s ${i * 0.1}s ease-out both, floatBolt 2s ${i * 0.5}s ease-in-out infinite`,
              }}>{icon}</div>
          ))}
        </div>

        {/* Value + FELIX */}
        {phase >= 4 && (
          <div className="text-center" style={{ animation: 'heroTextIn 0.45s ease-out forwards' }}>
            <div className="font-extrabold text-white tracking-tight leading-none mb-3"
              style={{
                fontSize: '5rem',
                textShadow: '0 0 30px rgba(252,211,77,0.8), 0 0 60px rgba(252,211,77,0.4)',
              }}>
              {value}
            </div>
            <div className="font-extrabold text-2xl tracking-widest"
              style={{
                letterSpacing: '0.22em',
                background: 'linear-gradient(90deg, #FCD34D, #F97316, #A855F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
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
            className="px-8 py-3 font-bold rounded-xl text-base transition-all shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FCD34D, #F97316)',
              color: '#1a1a1a',
              animation: 'heroTextIn 0.45s 0.3s ease-out both',
            }}>
            Continuer
          </button>
        )}
      </div>
    </div>
  );
}
