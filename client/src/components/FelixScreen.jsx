import { useEffect, useState } from 'react';

export default function FelixScreen({ value, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape' || e.key === 'Enter') onDismiss();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        transition: 'opacity 0.2s ease',
        opacity: visible ? 1 : 0,
      }}
      onClick={onDismiss}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
          transform: visible ? 'scale(1)' : 'scale(0.92)',
          opacity: visible ? 1 : 0,
        }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-8 text-center"
      >
        {/* Check circle */}
        <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Value */}
        {value && (
          <div className="text-6xl font-extrabold text-gray-900 tracking-tight mb-2">
            {value}
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-1">Consensus !</h2>
        <p className="text-sm text-gray-500 mb-7">Tout le monde est d'accord.</p>

        <button
          onClick={onDismiss}
          className="btn btn-primary w-full"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
