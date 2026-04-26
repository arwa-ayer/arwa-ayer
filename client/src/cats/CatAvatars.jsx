const TWEMOJI = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg';

export const AVATARS = [
  { id: 0, name: 'Luna',   code: '1f431', bg: '#7C3AED' },
  { id: 1, name: 'Milo',   code: '1f63a', bg: '#EA580C' },
  { id: 2, name: 'Shadow', code: '1f638', bg: '#0F766E' },
  { id: 3, name: 'Cleo',   code: '1f63b', bg: '#DB2777' },
  { id: 4, name: 'Max',    code: '1f639', bg: '#2563EB' },
  { id: 5, name: 'Zoe',    code: '1f63c', bg: '#D97706' },
  { id: 6, name: 'Mochi',  code: '1f640', bg: '#0284C7' },
  { id: 7, name: 'Nori',   code: '1f63f', bg: '#059669' },
  { id: 8, name: 'Cookie', code: '1f63e', bg: '#DC2626' },
];

export function CatAvatar({ id, size = 64 }) {
  const av = AVATARS[id] ?? AVATARS[0];
  const pad = Math.round(size * 0.16);
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: av.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      <img
        src={`${TWEMOJI}/${av.code}.svg`}
        alt={av.name}
        width={size - pad * 2}
        height={size - pad * 2}
        style={{ display: 'block' }}
        draggable={false}
      />
    </div>
  );
}
