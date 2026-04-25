import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import { CAT_VALUES, CAT_DATA } from '../cats/CatSvgs';
import CatCard from '../components/CatCard';
import PlayerCard from '../components/PlayerCard';
import FelixScreen from '../components/FelixScreen';

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [playerName] = useState(() => localStorage.getItem('playerName') || '');
  const [showNamePrompt, setShowNamePrompt] = useState(!localStorage.getItem('playerName'));
  const [nameInput, setNameInput] = useState('');

  const [players, setPlayers] = useState([]);
  const [myId, setMyId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [votes, setVotes] = useState({});       // playerId → value (after reveal)
  const [votedPlayers, setVotedPlayers] = useState(new Set()); // who has voted (before reveal)
  const [myVote, setMyVote] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [story, setStory] = useState('');
  const [storyInput, setStoryInput] = useState('');
  const [showFelix, setShowFelix] = useState(false);
  const [consensusValue, setConsensusValue] = useState(null);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const storyDebounce = useRef(null);
  const hasJoined = useRef(false);

  const applyRoomState = useCallback((state, admin, id) => {
    setPlayers(state.players);
    setRevealed(state.revealed);
    setStory(state.story);
    setStoryInput(state.story);
    setIsAdmin(admin);
    setMyId(id || socket.id);

    if (state.revealed) {
      setVotes(state.fullVotes || {});
      const myV = (state.fullVotes || {})[id || socket.id];
      if (myV) setMyVote(myV);
    } else {
      const voted = new Set(Object.keys(state.votes || {}));
      setVotedPlayers(voted);
      if (voted.has(id || socket.id)) {
        setMyVote(state.votes[id || socket.id] === 'voted' ? null : state.votes[id || socket.id]);
      }
    }
  }, []);

  const joinRoom = useCallback((name) => {
    if (hasJoined.current) return;
    hasJoined.current = true;

    socket.emit('join-room', { name, roomId }, ({ success, isAdmin: admin, state, error: err }) => {
      if (!success) {
        alert(err || 'Impossible de rejoindre ce salon');
        navigate('/');
        return;
      }
      setConnected(true);
      applyRoomState(state, admin, socket.id);
    });
  }, [roomId, navigate, applyRoomState]);

  useEffect(() => {
    if (showNamePrompt) return;
    if (!socket.connected) {
      socket.connect();
      socket.once('connect', () => joinRoom(playerName));
    } else {
      joinRoom(playerName);
    }

    socket.on('player-joined', ({ id, name }) => {
      setPlayers((prev) => {
        if (prev.find((p) => p.id === id)) return prev;
        return [...prev, { id, name, isAdmin: false }];
      });
    });

    socket.on('player-left', ({ id }) => {
      setPlayers((prev) => prev.filter((p) => p.id !== id));
      setVotedPlayers((prev) => { const s = new Set(prev); s.delete(id); return s; });
      setVotes((prev) => { const v = { ...prev }; delete v[id]; return v; });
    });

    socket.on('admin-changed', ({ adminId }) => {
      setIsAdmin(adminId === socket.id);
      setPlayers((prev) =>
        prev.map((p) => ({ ...p, isAdmin: p.id === adminId }))
      );
    });

    socket.on('vote-cast', ({ playerId }) => {
      setVotedPlayers((prev) => new Set([...prev, playerId]));
    });

    socket.on('vote-removed', ({ playerId }) => {
      setVotedPlayers((prev) => { const s = new Set(prev); s.delete(playerId); return s; });
    });

    socket.on('votes-revealed', ({ votes: v, consensus, consensusValue: cv }) => {
      setVotes(v);
      setRevealed(true);
      if (consensus) {
        setConsensusValue(cv);
        setTimeout(() => setShowFelix(true), 400);
      }
    });

    socket.on('round-reset', ({ story: s }) => {
      setVotes({});
      setVotedPlayers(new Set());
      setMyVote(null);
      setRevealed(false);
      setStory(s);
      setStoryInput(s);
      setConsensusValue(null);
      setShowFelix(false);
    });

    socket.on('story-updated', ({ story: s }) => {
      setStory(s);
      setStoryInput(s);
    });

    socket.on('disconnect', () => setConnected(false));
    socket.on('connect', () => setConnected(true));

    return () => {
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('admin-changed');
      socket.off('vote-cast');
      socket.off('vote-removed');
      socket.off('votes-revealed');
      socket.off('round-reset');
      socket.off('story-updated');
      socket.off('disconnect');
      socket.off('connect');
    };
  }, [showNamePrompt, playerName, joinRoom]);

  function handleVote(value) {
    if (revealed) return;
    if (myVote === value) {
      setMyVote(null);
      socket.emit('unvote');
    } else {
      setMyVote(value);
      socket.emit('vote', { value });
    }
  }

  function handleReveal() {
    socket.emit('reveal');
  }

  function handleReset() {
    socket.emit('reset', { story: storyInput });
    setShowFelix(false);
  }

  function handleStoryInput(v) {
    setStoryInput(v);
    clearTimeout(storyDebounce.current);
    storyDebounce.current = setTimeout(() => {
      socket.emit('set-story', { story: v });
    }, 500);
  }

  function copyCode() {
    navigator.clipboard.writeText(roomId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleNamePromptSubmit() {
    const n = nameInput.trim();
    if (!n) return;
    localStorage.setItem('playerName', n);
    setShowNamePrompt(false);
  }

  const votedCount = votedPlayers.size;
  const totalCount = players.length;

  // Stats after reveal
  const revealedValues = Object.values(votes);
  const numericVals = revealedValues.filter((v) => !isNaN(Number(v))).map(Number);
  const avg = numericVals.length ? (numericVals.reduce((a, b) => a + b, 0) / numericVals.length).toFixed(1) : null;

  if (showNamePrompt) {
    return (
      <div className="min-h-screen bg-dark halftone flex items-center justify-center p-4">
        <div className="comic-card w-full max-w-sm p-8 text-center">
          <div className="text-5xl mb-4">🐱</div>
          <h2 className="font-comic text-3xl text-neon-yellow mb-6">Ton prénom ?</h2>
          <input
            className="comic-input text-center text-xl mb-4"
            placeholder="Ex: Félix"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNamePromptSubmit()}
            autoFocus
          />
          <button onClick={handleNamePromptSubmit} className="btn-neon-pink w-full">
            Entrer 🐾
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark halftone flex flex-col">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          <span className="font-comic text-2xl text-neon-yellow tracking-wider">🐱 POKER CATS</span>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-gray-400 text-sm font-body hidden sm:block">Code:</span>
            <button
              onClick={copyCode}
              className="font-comic text-lg tracking-[0.2em] px-4 py-1.5 rounded-lg border-2 border-dark-border hover:border-neon-blue text-neon-blue transition-all duration-200"
            >
              {copied ? '✓ Copié!' : roomId}
            </button>
          </div>

          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-neon-green' : 'bg-red-500'} animate-pulse`} title={connected ? 'Connecté' : 'Déconnecté'} />
        </div>
      </header>

      {/* Story bar */}
      <div className="border-b border-dark-border bg-dark/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-gray-400 text-sm font-body whitespace-nowrap">📋 Story:</span>
          {isAdmin ? (
            <input
              className="flex-1 bg-transparent border-b-2 border-dark-border focus:border-neon-blue outline-none text-white font-body px-1 py-0.5 transition-colors"
              placeholder="Titre de la story..."
              value={storyInput}
              onChange={(e) => handleStoryInput(e.target.value)}
              maxLength={80}
            />
          ) : (
            <span className="flex-1 text-white font-body">{story || <span className="text-gray-500 italic">En attente...</span>}</span>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* LEFT — voting cards */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-comic text-2xl text-white tracking-wider">
              {revealed ? '🎉 Résultats' : myVote ? `✅ Voté: ${myVote}` : '🐾 Choisir une carte'}
            </h2>
            {revealed && avg && (
              <div className="bg-dark-card border-2 border-neon-yellow/50 rounded-xl px-4 py-2 font-comic text-neon-yellow text-xl">
                Moy. {avg}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {CAT_VALUES.map((value) => (
              <CatCard
                key={value}
                value={value}
                selected={myVote === value}
                disabled={revealed}
                onClick={() => handleVote(value)}
              />
            ))}
          </div>

          {/* Vote progress */}
          {!revealed && (
            <div className="mt-6 comic-card p-4">
              <div className="flex items-center justify-between mb-2 text-sm font-body">
                <span className="text-gray-400">{votedCount} / {totalCount} votes</span>
                <span className="text-neon-green">{totalCount > 0 ? Math.round((votedCount / totalCount) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-dark-border rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-neon-pink to-neon-blue transition-all duration-500"
                  style={{ width: `${totalCount > 0 ? (votedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {/* Admin controls */}
          {isAdmin && (
            <div className="mt-4 flex gap-3 flex-wrap">
              {!revealed ? (
                <button
                  onClick={handleReveal}
                  disabled={votedCount === 0}
                  className={`btn-neon-pink flex-1 ${votedCount === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  👁 Révéler ({votedCount})
                </button>
              ) : (
                <button onClick={handleReset} className="btn-neon-green flex-1">
                  🔄 Nouvelle manche
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — players */}
        <div className="lg:w-80">
          <h2 className="font-comic text-2xl text-white tracking-wider mb-4">
            👥 Joueurs ({players.length})
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isMe={player.id === myId}
                hasVoted={votedPlayers.has(player.id) || (revealed && votes[player.id] != null)}
                vote={revealed ? votes[player.id] : null}
                revealed={revealed}
              />
            ))}
          </div>

          {!isAdmin && !revealed && (
            <p className="mt-6 text-center text-gray-500 text-sm font-body">
              En attente que l'admin révèle les cartes…
            </p>
          )}
        </div>
      </div>

      {/* FELIX full screen */}
      {showFelix && (
        <FelixScreen
          value={consensusValue}
          onDismiss={() => setShowFelix(false)}
        />
      )}
    </div>
  );
}
