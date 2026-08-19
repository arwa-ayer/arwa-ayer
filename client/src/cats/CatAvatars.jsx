import { useState } from 'react';
import {
  LunaCat, MiloCat, ShadowCat, CleoCat, MaxCat, ZoeCat,
  MysticaCat, RexCat, CozyCat,
} from './CatSvgs';

// RoboHash set4 = kittens / cats
const API = 'https://robohash.org';

export const AVATARS = [
  { id: 0, name: 'Luna',   seed: 'luna-planning',   Fallback: LunaCat    },
  { id: 1, name: 'Milo',   seed: 'milo-planning',   Fallback: MiloCat    },
  { id: 2, name: 'Shadow', seed: 'shadow-planning', Fallback: ShadowCat  },
  { id: 3, name: 'Cleo',   seed: 'cleo-planning',   Fallback: CleoCat    },
  { id: 4, name: 'Max',    seed: 'max-planning',    Fallback: MaxCat     },
  { id: 5, name: 'Zoe',    seed: 'zoe-planning',    Fallback: ZoeCat     },
  { id: 6, name: 'Mochi',  seed: 'mochi-planning',  Fallback: CozyCat    },
  { id: 7, name: 'Nori',   seed: 'nori-planning',   Fallback: MysticaCat },
  { id: 8, name: 'Cookie', seed: 'cookie-planning', Fallback: RexCat     },
];

export function CatAvatar({ id, size = 64 }) {
  const av = AVATARS[id] ?? AVATARS[0];
  const [failed, setFailed] = useState(false);
  const Fallback = av.Fallback;

  const wrapper = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: '#FFF8E7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  };

  if (failed) {
    return <div style={wrapper}><Fallback /></div>;
  }

  return (
    <div style={wrapper}>
      <img
        src={`${API}/${av.seed}?set=set4&size=200x200&bgset=bg2`}
        alt={av.name}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        draggable={false}
      />
    </div>
  );
}
