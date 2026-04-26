const CAT_API = 'https://cat-avatars.vercel.app/api/cat';

export const AVATARS = [
  { id: 0, name: 'Luna'   },
  { id: 1, name: 'Milo'   },
  { id: 2, name: 'Shadow' },
  { id: 3, name: 'Cleo'   },
  { id: 4, name: 'Max'    },
  { id: 5, name: 'Zoe'    },
  { id: 6, name: 'Mochi'  },
  { id: 7, name: 'Nori'   },
  { id: 8, name: 'Cookie' },
];

export function CatAvatar({ id, size = 64 }) {
  const av = AVATARS[id] ?? AVATARS[0];
  return (
    <img
      src={`${CAT_API}?name=${av.name}`}
      alt={av.name}
      width={size}
      height={size}
      style={{ borderRadius: '50%', display: 'block', objectFit: 'cover', flexShrink: 0 }}
      draggable={false}
    />
  );
}
