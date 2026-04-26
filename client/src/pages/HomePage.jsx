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
    if (!name.trim()) { setError('Entre ton prénom pour continuer.'); return; }
    setError('');
    navigate(`/room/${generateRoomCode()}`);
  }

  function handleJoin() {
    if (!name.trim()) { setError('Entre ton prénom pour continuer.'); return; }
    if (roomCode.trim().length < 4) { setError('Entre le code du salon.'); return; }
    setError('');
    navigate(`/room/${roomCode.trim().toUpperCase()}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="text-4xl">🃏</span>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Planning <span className="text-indigo-600">Poker</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm">Estimez vos stories en équipe, en temps réel</p>
      </div>

      {/* Card */}
      <div className="card w-full max-w-md p-8">

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {['create', 'join'].map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                tab === t ? 'tab-active' : 'tab-inactive'
              }`}>
              {t === 'create' ? 'Créer un salon' : 'Rejoindre'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Prénom
            </label>
            <input
              className="input"
              placeholder="Ex : Alex"
              value={name}
              onChange={(e) => saveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (tab === 'create' ? handleCreate() : handleJoin())}
              maxLength={24}
              autoFocus
            />
          </div>

          {tab === 'join' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Code du salon
              </label>
              <input
                className="input uppercase tracking-widest text-center text-lg font-bold"
                placeholder="ABC123"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                maxLength={6}
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            onClick={tab === 'create' ? handleCreate : handleJoin}
            className="btn btn-primary btn-lg w-full mt-2"
          >
            {tab === 'create' ? 'Créer le salon' : 'Rejoindre'}
          </button>
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400">Scrum Poker · Fibonacci · Temps réel</p>
    </div>
  );
}
