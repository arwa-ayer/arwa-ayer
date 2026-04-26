import { useState, useEffect } from 'react';

const CARD_EMOJIS = {
  '1': '🐱', '2': '😺', '3': '😸', '5': '😻',
  '8': '😹', '13': '😼', '21': '🙀', '?': '🐈', '☕': '😴',
};

function CardBack() {
  return (
    <div className="w-full h-full rounded-xl bg-indigo-600 flex items-center justify-center">
      <span className="text-white text-2xl opacity-40 font-extrabold">?</span>
    </div>
  );
}

export default function PlayerCard({ player, isMe, hasVoted, vote, revealed }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (revealed && vote) {
      const t = setTimeout(() => setFlipped(true), 100 + Math.random() * 400);
      return () => clearTimeout(t);
    } else {
      setFlipped(false);
    }
  }, [revealed, vote]);

  return (
    <div className={`card p-3 flex flex-col items-center gap-2 ${
      isMe ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
    }`}>
      {/* Name row */}
      <div className="flex items-center gap-1.5 w-full justify-center">
        <span className="text-sm font-semibold text-gray-800 truncate max-w-[80px]">{player.name}</span>
        {isMe && <span className="text-xs text-indigo-500 font-medium">(moi)</span>}
        {player.isAdmin && <span className="text-xs">👑</span>}
      </div>

      {/* Card area */}
      <div className="w-full" style={{ height: 80 }}>
        {!hasVoted && !revealed ? (
          <div className="w-full h-full rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-xl font-bold">
            —
          </div>
        ) : !revealed ? (
          <div className="w-full h-full rounded-xl bg-indigo-600 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white opacity-60 animate-bounce" />
          </div>
        ) : (
          <div className="card-3d-wrapper w-full h-full">
            <div className={`card-3d-inner ${flipped ? 'flipped' : ''}`}>
              <div className="card-face"><CardBack /></div>
              <div className="card-face card-face-back">
                <div className="w-full h-full rounded-xl bg-white border-2 border-gray-200 flex flex-col items-center justify-center gap-1">
                  <span style={{ fontSize: '1.4rem' }}>{CARD_EMOJIS[vote] || '🐱'}</span>
                  <span className="text-lg font-extrabold text-gray-900">{vote}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
