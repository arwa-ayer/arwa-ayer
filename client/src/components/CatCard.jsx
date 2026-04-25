import { CAT_DATA } from '../cats/CatSvgs';

export default function CatCard({ value, selected, disabled, onClick }) {
  const cat = CAT_DATA[value];
  if (!cat) return null;
  const CatComponent = cat.component;

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`cat-voting-card relative flex flex-col items-center bg-dark-card overflow-hidden
        ${selected ? 'selected' : 'border-dark-border hover:border-opacity-80'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        borderColor: selected ? '#FFE000' : cat.color + '55',
        background: selected
          ? `linear-gradient(135deg, #1a1a00 0%, #2a2200 100%)`
          : `linear-gradient(135deg, #13131F 0%, #0D0D18 100%)`,
      }}
    >
      {/* Top colour stripe */}
      <div className="w-full h-1.5 rounded-t" style={{ background: cat.color }} />

      {/* Cat SVG */}
      <div className="w-full px-2 pt-2 pb-0" style={{ aspectRatio: '1/1.1' }}>
        <CatComponent />
      </div>

      {/* Cat name */}
      <div className="text-xs font-body text-center pb-1 truncate w-full px-1"
        style={{ color: cat.color }}>
        {cat.label}
      </div>

      {/* Value badge */}
      <div
        className="font-comic text-2xl tracking-wider pb-2 leading-none"
        style={{ color: selected ? '#FFE000' : 'white' }}
      >
        {value}
      </div>

      {/* Selected glow overlay */}
      {selected && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ boxShadow: 'inset 0 0 20px rgba(255,224,0,0.15)' }}
        />
      )}
    </div>
  );
}
