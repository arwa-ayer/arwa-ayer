import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoomCode } from '../pubsub';

export default function HomePage() {
  const navigate = useNavigate();
  const [name, setName] = useState(() => localStorage.getItem('playerName') || '');
  const [roomCode, setRoomCode] = useState('');
  const [tab, setTab] = useState('create');
  const [error, setError] = useState('');

  function saveName(v) {
    setName(v);
    localStorage.setItem('playerName', v);
  }

  function handleCreate() {
    if (!name.trim()) { setError('Entre ton prénom !'); return; }
    setError('');
    localStorage.setItem('playerName', name.trim());
    navigate(`/room/${generateRoomCode()}`);
  }

  function handleJoin() {
    if (!name.trim()) { setError('Entre ton prénom !'); return; }
    if (roomCode.trim().length < 4) { setError('Entre le code du salon !'); return; }
    setError('');
    localStorage.setItem('playerName', name.trim());
    navigate(`/room/${roomCode.trim().toUpperCase()}`);
  }

  return (
    <div className="min-h-screen bg-dark halftone overflow-hidden relative flex flex-col items-center justify-center px-4">

      <div className="text-center mb-10 relative z-10">
        <h1 className="font-comic text-6xl md:text-8xl text-white"
          style={{ textShadow: '4px 4px 0 #FF2D78, 8px 8px 0 rgba(0,212,255,0.3)' }}>
          PLANNING
        </h1>
        <h1 className="font-comic text-6xl md:text-8xl text-neon-yellow"
          style={{ textShadow: '4px 4px 0 #CC8800, 8px 8px 0 rgba(255,45,120,0.3)' }}>
          POKER
        </h1>
      </div>

      <div className="comic-card w-full max-w-md p-8 relative z-10"
        style={{ boxShadow: '6px 6px 0 rgba(255,45,120,0.25), 0 0 40px rgba(255,45,120,0.1)' }}>

        <div className="flex rounded-xl overflow-hidden border-2 border-dark-border mb-8">
          {['create', 'join'].map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-3 font-comic text-xl tracking-wider transition-all duration-200 ${
                tab === t ? 'bg-neon-pink text-white' : 'bg-transparent text-gray-400 hover:text-white'
              }`}>
              {t === 'create' ? '✦ Créer' : '↗ Rejoindre'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 font-comic">Ton prénom</label>
            <input className="comic-input" placeholder="Ex: Alex" value={name}
              onChange={(e) => saveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (tab === 'create' ? handleCreate() : handleJoin())}
              maxLength={24} />
          </div>

          {tab === 'join' && (
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 font-comic">Code du salon</label>
              <input className="comic-input uppercase tracking-[0.3em] text-center text-xl font-comic"
                placeholder="ABC123" value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()} maxLength={6} />
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-xl px-4 py-3 text-red-400 text-sm font-body">{error}</div>
          )}

          <button onClick={tab === 'create' ? handleCreate : handleJoin}
            className={`w-full py-4 rounded-xl font-comic text-2xl tracking-widest transition-all duration-200 mt-2 ${
              tab === 'create' ? 'btn-neon-pink' : 'btn-neon-blue'
            }`}>
            {tab === 'create' ? '✦ Créer le salon' : '↗ Rejoindre'}
          </button>
        </div>
      </div>

      <p className="mt-8 text-gray-600 text-sm font-body relative z-10">Scrum Poker · temps réel · Fibonacci</p>
    </div>
  );
}
