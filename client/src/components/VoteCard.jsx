const CARD_DATA = {
  '1':  { emoji: '🐱', label: 'Trivial'  },
  '2':  { emoji: '😺', label: 'Simple'   },
  '3':  { emoji: '😸', label: 'Facile'   },
  '5':  { emoji: '😻', label: 'Moyen'    },
  '8':  { emoji: '😹', label: 'Grand'    },
  '13': { emoji: '😼', label: 'Complexe' },
  '21': { emoji: '🙀', label: 'Énorme'   },
  '?':  { emoji: '🐈', label: 'Inconnu'  },
  '☕': { emoji: '😴', label: 'Pause'    },
};

export default function VoteCard({ value, selected, disabled, onClick }) {
  const card = CARD_DATA[value] || { emoji: '🐱', label: '' };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`vote-card
        ${selected ? 'vote-card-selected' : ''}
        ${disabled ? 'vote-card-disabled' : ''}
      `}
      style={{ minHeight: 120, padding: '10px 8px' }}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t transition-colors ${
        selected ? 'bg-indigo-500' : 'bg-gray-100'
      }`} />

      {/* Corner — top left */}
      <div className={`text-xs font-bold leading-none ${selected ? 'text-indigo-600' : 'text-gray-400'}`}>
        {value}
      </div>

      {/* Center */}
      <div className="flex flex-col items-center justify-center flex-1 py-1 gap-1">
        <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{card.emoji}</span>
        <span className={`text-2xl font-extrabold tracking-tight leading-none ${
          selected ? 'text-indigo-600' : 'text-gray-800'
        }`}>
          {value}
        </span>
        <span className={`text-xs font-medium ${selected ? 'text-indigo-400' : 'text-gray-400'}`}>
          {card.label}
        </span>
      </div>

      {/* Corner — bottom right */}
      <div className={`text-xs font-bold leading-none self-end rotate-180 ${
        selected ? 'text-indigo-600' : 'text-gray-400'
      }`}>
        {value}
      </div>
    </div>
  );
}
