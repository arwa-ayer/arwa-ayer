const VALUE_COLORS = {
  '1':  '#00D4FF',
  '2':  '#00FF88',
  '3':  '#FFE000',
  '5':  '#FF9900',
  '8':  '#FF2D78',
  '13': '#AA44FF',
  '21': '#FF44AA',
  '?':  '#20C9A8',
  '☕': '#C4935A',
};

export default function VoteCard({ value, selected, disabled, onClick }) {
  const color = VALUE_COLORS[value] || '#00D4FF';

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`cat-voting-card relative flex flex-col items-center justify-between bg-dark-card overflow-hidden py-3 px-2
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
      style={{
        borderColor: selected ? '#FFE000' : color + '44',
        background: selected
          ? 'linear-gradient(160deg, #1a1800 0%, #2a2200 100%)'
          : 'linear-gradient(160deg, #13131F 0%, #0D0D18 100%)',
        minHeight: 110,
      }}
    >
      {/* Top stripe */}
      <div className="w-full h-1 rounded-t absolute top-0 left-0" style={{ background: color }} />

      {/* Corner value (top-left) */}
      <div className="self-start font-comic text-sm leading-none mt-1"
        style={{ color: selected ? '#FFE000' : color }}>
        {value}
      </div>

      {/* Big center value */}
      <div
        className="font-comic leading-none"
        style={{
          fontSize: value.length > 2 ? '2rem' : '2.6rem',
          color: selected ? '#FFE000' : 'white',
          textShadow: selected
            ? `0 0 20px rgba(255,224,0,0.8)`
            : `0 0 15px ${color}66`,
        }}
      >
        {value}
      </div>

      {/* Corner value (bottom-right, rotated) */}
      <div className="self-end font-comic text-sm leading-none mb-1 rotate-180"
        style={{ color: selected ? '#FFE000' : color }}>
        {value}
      </div>

      {selected && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ boxShadow: 'inset 0 0 20px rgba(255,224,0,0.12)' }} />
      )}
    </div>
  );
}
