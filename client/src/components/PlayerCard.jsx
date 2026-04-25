import { CAT_DATA, CardBack } from '../cats/CatSvgs';
import { useState, useEffect } from 'react';

export default function PlayerCard({ player, isMe, hasVoted, vote, revealed }) {
  const [flipped, setFlipped] = useState(false);
  const catData = vote ? CAT_DATA[vote] : null;
  const CatComponent = catData?.component;

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
      {/* Player name */}
      <div className="flex items-center gap-1.5 w-full justify-center">
        <span className="text-sm font-body text-white truncate max-w-[80px]">{player.name}</span>
        {isMe && <span className="text-xs text-neon-pink font-comic">(moi)</span>}
        {player.isAdmin && <span className="text-xs">👑</span>}
      </div>

      {/* Card display */}
      <div className="w-full" style={{ height: 90 }}>
        {!hasVoted && !revealed ? (
          /* Not voted yet */
          <div className="w-full h-full rounded-xl border-2 border-dashed border-dark-border flex items-center justify-center text-gray-600 text-3xl">
            ?
          </div>
        ) : !revealed ? (
          /* Voted but not revealed */
          <div className="w-full h-full rounded-xl border-2 border-neon-green/50 bg-neon-green/5 flex items-center justify-center"
            style={{ boxShadow: '0 0 10px rgba(0,255,136,0.15)' }}>
            <span className="text-3xl animate-bounce-in">🐾</span>
          </div>
        ) : (
          /* Revealed — 3D flip */
          <div className="card-3d-wrapper w-full h-full">
            <div className={`card-3d-inner ${flipped ? 'flipped' : ''}`}>
              {/* Front = card back pattern (before flip) */}
              <div className="card-face">
                <CardBack />
              </div>
              {/* Back = actual cat (after flip) */}
              <div className="card-face card-face-back">
                {CatComponent ? (
                  <div
                    className="w-full h-full rounded-xl flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${catData.color}22 0%, #13131F 100%)`,
                      border: `2px solid ${catData.color}66`,
                    }}
                  >
                    <div className="w-full h-full p-1">
                      <CatComponent />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full rounded-xl bg-dark-card border-2 border-dark-border flex items-center justify-center font-comic text-3xl text-white">
                    {vote}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vote value (after reveal) */}
      {revealed && vote && (
        <div
          className="font-comic text-xl animate-pop-in"
          style={{ color: catData?.color || 'white' }}
        >
          {vote}
        </div>
      )}
    </div>
  );
}
