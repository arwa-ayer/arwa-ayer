import { useState, useEffect } from 'react';

const CARD_DATA = {
  '1':  { emoji: '🐱', color: '#00D4FF' },
  '2':  { emoji: '😺', color: '#00FF88' },
  '3':  { emoji: '😸', color: '#7FEE64' },
  '5':  { emoji: '😻', color: '#FFE000' },
  '8':  { emoji: '😹', color: '#FF9900' },
  '13': { emoji: '😼', color: '#FF6B6B' },
  '21': { emoji: '🙀', color: '#AA44FF' },
  '?':  { emoji: '🐈', color: '#20C9A8' },
  '☕': { emoji: '😴', color: '#C4935A' },
};

function CardBack() {
  return (
    <div className="w-full h-full rounded-xl flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1E1E32 0%, #13131F 100%)', border: '2px solid #2A2A40' }}>
      <div style={{ fontSize: '1.6rem', opacity: 0.25 }}>🐱</div>
    </div>
  );
}

export default function PlayerCard({ player, isMe, hasVoted, vote, revealed }) {
  const [flipped, setFlipped] = useState(false);
  const card = vote ? (CARD_DATA[vote] || { emoji: '🐱', color: 'white' }) : null;

  useEffect(() => {
    if (revealed && vote) {
      const t = setTimeout(() => setFlipped(true), 100 + Math.random() * 400);
      return () => clearTimeout(t);
    } else {
      setFlipped(false);
    }
  }, [revealed, vote]);

  return (
    <div
      className={`comic-card p-3 flex flex-col items-center gap-2 transition-all duration-300 ${
        isMe ? 'border-violet-500/60' : ''
      }`}
      style={isMe ? { boxShadow: '0 0 15px rgba(124,58,237,0.2)' } : {}}
    >
      <div className="flex items-center gap-1.5 w-full justify-center">
        <span className="text-sm font-body text-white truncate max-w-[80px]">{player.name}</span>
        {isMe && <span className="text-xs text-violet-400 font-comic">(moi)</span>}
        {player.isAdmin && <span className="text-xs">👑</span>}
      </div>

      <div className="w-full" style={{ height: 90 }}>
        {!hasVoted && !revealed ? (
          <div className="w-full h-full rounded-xl border-2 border-dashed border-dark-border flex items-center justify-center text-gray-600 text-2xl">
            ?
          </div>
        ) : !revealed ? (
          <div className="w-full h-full rounded-xl border-2 border-neon-green/40 bg-neon-green/5 flex items-center justify-center"
            style={{ boxShadow: '0 0 10px rgba(0,255,136,0.1)' }}>
            <div className="w-2.5 h-2.5 rounded-full bg-neon-green animate-pulse" />
          </div>
        ) : (
          <div className="card-3d-wrapper w-full h-full">
            <div className={`card-3d-inner ${flipped ? 'flipped' : ''}`}>
              <div className="card-face"><CardBack /></div>
              <div className="card-face card-face-back">
                <div className="w-full h-full rounded-xl flex flex-col items-center justify-center gap-1"
                  style={{
                    background: card ? `linear-gradient(135deg, ${card.color}18 0%, #13131F 100%)` : '#13131F',
                    border: `2px solid ${card?.color ?? '#2A2A40'}55`,
                  }}>
                  <div style={{ fontSize: '2rem' }}>{card?.emoji}</div>
                  <div className="font-comic text-xl" style={{ color: card?.color ?? 'white', textShadow: `0 0 12px ${card?.color ?? 'white'}66` }}>
                    {vote}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
