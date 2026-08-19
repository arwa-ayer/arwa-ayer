import {
  LunaCat, MiloCat, ShadowCat, CleoCat, MaxCat, ZoeCat,
  MysticaCat, RexCat, CozyCat,
} from './CatSvgs';

export const AVATARS = [
  { id: 0, name: 'Luna',   Component: LunaCat    },
  { id: 1, name: 'Milo',   Component: MiloCat    },
  { id: 2, name: 'Shadow', Component: ShadowCat  },
  { id: 3, name: 'Cleo',   Component: CleoCat    },
  { id: 4, name: 'Max',    Component: MaxCat     },
  { id: 5, name: 'Zoe',    Component: ZoeCat     },
  { id: 6, name: 'Mochi',  Component: CozyCat    },
  { id: 7, name: 'Nori',   Component: MysticaCat },
  { id: 8, name: 'Cookie', Component: RexCat     },
];

export function CatAvatar({ id, size = 64 }) {
  const av = AVATARS[id] ?? AVATARS[0];
  const Cat = av.Component;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#FFF8E7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <Cat />
    </div>
  );
}
