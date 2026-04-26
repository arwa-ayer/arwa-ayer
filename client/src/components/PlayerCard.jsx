import { useState, useEffect } from 'react';
import { CatAvatar } from '../cats/CatAvatars';

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

  const avatarId = player.avatarId ?? 0;

  return (
    <div className={`flex flex-col items-center gap-2 transition-transform duration-150 ${isMe ? 'scale-110' : ''}`}>

      {/* Avatar */}
      <div className={`relative ${isMe ? 'ring-2 ring-indigo-500 ring-offset-2 rounded-full' : ''}`}>
        <CatAvatar id={avatarId} size={50} />
        {player.isAdmin && (
          <span className="absolute -top-1 -right-1 text-xs leading-none">👑</span>
        )}
      </div>

      {/* Name */}
      <span className={`text-xs font-semibold truncate max-w-[72px] text-center ${
        isMe ? 'text-indigo-600' : 'text-gray-700'
      }`}>
        {player.name}
      </span>

      {/* Vote card */}
      <div className="w-[52px] h-[72px]">
        {!hasVoted && !revealed ? (
          <div className="w-full h-full rounded-xl border-2 border-dashed border-gray-300 bg-white/60 flex items-center justify-center text-gray-300 text-xl font-bold">
            —
          </div>
        ) : !revealed ? (
          <div className="w-full h-full rounded-xl bg-indigo-600 shadow-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white opacity-70 animate-bounce" />
          </div>
        ) : (
          <div className="card-3d-wrapper w-full h-full">
            <div className={`card-3d-inner ${flipped ? 'flipped' : ''}`}>
              <div className="card-face">
                <div className="w-full h-full rounded-xl bg-indigo-600 shadow-md" />
              </div>
              <div className="card-face card-face-back">
                <div className="w-full h-full rounded-xl bg-white border-2 border-gray-200 shadow flex items-center justify-center">
                  <span className="text-xl font-extrabold text-gray-900">{vote ?? '—'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
