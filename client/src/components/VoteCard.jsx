const CARD_DATA = {
  '1':  { emoji: '🐱', label: 'Évident',  color: '#00D4FF', bg: 'rgba(0,212,255,0.08)'   },
  '2':  { emoji: '😺', label: 'Simple',   color: '#00FF88', bg: 'rgba(0,255,136,0.08)'   },
  '3':  { emoji: '😸', label: 'Facile',   color: '#7FEE64', bg: 'rgba(127,238,100,0.08)' },
  '5':  { emoji: '😻', label: 'Moyen',    color: '#FFE000', bg: 'rgba(255,224,0,0.08)'   },
  '8':  { emoji: '😹', label: 'Grand',    color: '#FF9900', bg: 'rgba(255,153,0,0.08)'   },
  '13': { emoji: '😼', label: 'Complexe', color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)' },
  '21': { emoji: '🙀', label: 'Énorme',   color: '#AA44FF', bg: 'rgba(170,68,255,0.08)'  },
  '?':  { emoji: '🐈', label: 'Inconnu',  color: '#20C9A8', bg: 'rgba(32,201,168,0.08)'  },
  '☕': { emoji: '😴', label: 'Pause',    color: '#C4935A', bg: 'rgba(196,147,90,0.08)'  },
};

export default function VoteCard({ value, selected, disabled, onClick }) {
  const card = CARD_DATA[value] || { emoji: '🐱', label: '', color: '#00D4FF', bg: 'rgba(0,212,255,0.08)' };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`cat-voting-card relative flex flex-col overflow-hidden select-none
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
      style={{
        borderColor: selected ? '#FFE000' : card.color + '55',
        background: selected
          ? 'linear-gradient(160deg, #1c1800 0%, #2a2200 100%)'
          : `linear-gradient(160deg, #14141F 0%, #0D0D18 100%)`,
        minHeight: 130,
        padding: '10px 8px',
      }}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t"
        style={{ background: selected ? '#FFE000' : card.color }} />

      {/* Corner value — top left */}
      <div className="font-comic text-sm leading-none mb-auto"
        style={{ color: selected ? '#FFE000' : card.color }}>
        {value}
      </div>

      {/* Cat emoji — centre */}
      <div className="flex flex-col items-center justify-center flex-1 py-1">
        <div style={{ fontSize: '2.2rem', lineHeight: 1, filter: selected ? 'drop-shadow(0 0 8px rgba(255,224,0,0.6))' : 'none' }}>
          {card.emoji}
        </div>
        <div className="text-xs mt-1 font-body tracking-wide"
          style={{ color: selected ? '#FFE000' : card.color, opacity: 0.8 }}>
          {card.label}
        </div>
      </div>

      {/* Corner value — bottom right */}
      <div className="font-comic text-sm leading-none mt-auto self-end rotate-180"
        style={{ color: selected ? '#FFE000' : card.color }}>
        {value}
      </div>

      {/* Selected glow */}
      {selected && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ boxShadow: 'inset 0 0 25px rgba(255,224,0,0.12)' }} />
      )}
    </div>
  );
}
