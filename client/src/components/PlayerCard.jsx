import { useState, useEffect } from 'react';

const VALUE_COLORS = {
  '1':  '#00D4FF', '2':  '#00FF88', '3':  '#FFE000',
  '5':  '#FF9900', '8':  '#FF2D78', '13': '#AA44FF',
  '21': '#FF44AA', '?':  '#20C9A8', '☕': '#C4935A',
};

function CardBack() {
  return (
    <div className="w-full h-full rounded-xl flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #1E1E30 0%, #13131F 100%)',
        border: '2px solid #2A2A40',
      }}>
      <div className="font-comic text-2xl opacity-30" style={{ color: '#FF2D78' }}>?</div>
    </div>
  );
}

export default function PlayerCard({ player, isMe, hasVoted, vote, revealed }) {
  const [flipped, setFlipped] = useState(false);
  const color = vote ? (VALUE_COLORS[vote] || 'white') : 'white';

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
        isMe ? 'border-neon-pink/60' : ''
      }`}
      style={isMe ? { boxShadow: '0 0 15px rgba(255,45,120,0.2)' } : {}}
    >
      <div className="flex items-center gap-1.5 w-full justify-center">
        <span className="text-sm font-body text-white truncate max-w-[80px]">{player.name}</span>
        {isMe && <span className="text-xs text-neon-pink font-comic">(moi)</span>}
        {player.isAdmin && <span className="text-xs">👑</span>}
      </div>

      <div className="w-full" style={{ height: 90 }}>
        {!hasVoted && !revealed ? (
          <div className="w-full h-full rounded-xl border-2 border-dashed border-dark-border flex items-center justify-center text-gray-600 text-3xl">
            ?
          </div>
        ) : !revealed ? (
          <div className="w-full h-full rounded-xl border-2 border-neon-green/50 bg-neon-green/5 flex items-center justify-center"
            style={{ boxShadow: '0 0 10px rgba(0,255,136,0.15)' }}>
            <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
          </div>
        ) : (
          <div className="card-3d-wrapper w-full h-full">
            <div className={`card-3d-inner ${flipped ? 'flipped' : ''}`}>
              <div className="card-face"><CardBack /></div>
              <div className="card-face card-face-back">
                <div className="w-full h-full rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${color}18 0%, #13131F 100%)`,
                    border: `2px solid ${color}55`,
                  }}>
                  <span className="font-comic text-3xl" style={{
                    color,
                    textShadow: `0 0 20px ${color}88`,
                  }}>
                    {vote}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {revealed && vote && (
        <div className="font-comic text-xl animate-pop-in" style={{ color }}>
          {vote}
        </div>
      )}
    </div>
  );
}
