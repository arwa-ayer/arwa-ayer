import { useEffect, useRef, useState } from 'react';
import { FelixCat, CAT_DATA } from '../cats/CatSvgs';

const CONFETTI_COLORS = [
  '#FF2D78', '#FFE000', '#00D4FF', '#00FF88', '#FF6B00', '#AA44FF',
  '#FF99CC', '#66FFEE', '#FFAA00', '#FF4444',
];

const LETTERS = ['F', 'E', 'L', 'I', 'X'];
const LETTER_COLORS = ['#FF2D78', '#FFE000', '#00D4FF', '#00FF88', '#AA44FF'];

function Confetti() {
  const pieces = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      size: 6 + Math.random() * 10,
      shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'rect' : 'star',
      rotate: Math.random() * 360,
    }))
  ).current;

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.shape !== 'star' ? p.color : 'transparent',
            color: p.color,
            width: p.size,
            height: p.shape === 'rect' ? p.size * 0.5 : p.size,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            fontSize: p.shape === 'star' ? p.size + 4 : undefined,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          {p.shape === 'star' ? '★' : ''}
        </div>
      ))}
    </>
  );
}

export default function FelixScreen({ value, onDismiss }) {
  const [phase, setPhase] = useState(0); // 0=bg, 1=letters, 2=cat, 3=subtitle
  const catData = value ? CAT_DATA[value] : null;

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') onDismiss();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #FFD700 0%, #FF8800 35%, #FF2D78 65%, #220044 100%)',
        animation: 'felixBgPulse 0.6s ease-in-out infinite alternate',
      }}
      onClick={onDismiss}
    >
      <Confetti />

      {/* Comic burst burst behind title */}
      <div
        className="absolute"
        style={{
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)',
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          pointerEvents: 'none',
        }}
      />

      {/* FELIX letters */}
      {phase >= 1 && (
        <div className="flex gap-2 md:gap-4 mb-4 relative z-10" style={{ userSelect: 'none' }}>
          {LETTERS.map((letter, i) => (
            <span
              key={letter}
              className="font-comic text-7xl md:text-9xl animate-felix-letter"
              style={{
                color: LETTER_COLORS[i],
                textShadow: `4px 4px 0 #111, 8px 8px 0 rgba(0,0,0,0.4)`,
                animationDelay: `${i * 0.1}s`,
                display: 'inline-block',
                WebkitTextStroke: '2px #111',
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      )}

      {/* Exclamation */}
      {phase >= 1 && (
        <div
          className="font-comic text-5xl md:text-7xl text-white animate-bounce-in mb-6 relative z-10"
          style={{
            textShadow: '3px 3px 0 #111',
            animationDelay: '0.5s',
            WebkitTextStroke: '1px #111',
          }}
        >
          !!
        </div>
      )}

      {/* Felix cat */}
      {phase >= 2 && (
        <div className="relative z-10 animate-cat-bounce" style={{ animationDuration: '0.8s' }}>
          <FelixCat size={180} />
        </div>
      )}

      {/* Subtitle */}
      {phase >= 3 && (
        <div className="relative z-10 mt-4 text-center animate-bounce-in px-4">
          <div
            className="font-comic text-2xl md:text-4xl text-white"
            style={{ textShadow: '3px 3px 0 #111', WebkitTextStroke: '1px #111' }}
          >
            TOUT LE MONDE EST D'ACCORD !
          </div>
          {value && (
            <div
              className="font-comic text-5xl md:text-7xl mt-2 animate-bounce-in"
              style={{
                color: catData?.color || '#FFD700',
                textShadow: '3px 3px 0 #111',
                animationDelay: '0.2s',
                WebkitTextStroke: '1px #111',
              }}
            >
              {value} pts
              {catData && (
                <span className="text-2xl ml-2 opacity-80">({catData.name})</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Dismiss hint */}
      <div
        className="absolute bottom-8 text-white/60 text-sm font-body animate-pulse"
        style={{ userSelect: 'none' }}
      >
        Clic ou Espace pour continuer 🐾
      </div>

      {/* Corner stars */}
      {['top-4 left-4', 'top-4 right-4', 'bottom-16 left-4', 'bottom-16 right-4'].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} font-comic text-4xl animate-spin3D pointer-events-none`}
          style={{
            animationDelay: `${i * 0.2}s`,
            color: LETTER_COLORS[i],
            textShadow: '2px 2px 0 #111',
          }}
        >
          ★
        </div>
      ))}
    </div>
  );
}
