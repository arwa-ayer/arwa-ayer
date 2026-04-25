import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlayerId, getChannel, createPubNub } from '../pubsub';
import { CAT_VALUES } from '../cats/CatSvgs';
import CatCard from '../components/CatCard';
import PlayerCard from '../components/PlayerCard';
import FelixScreen from '../components/FelixScreen';

const MY_ID = getPlayerId();

function getAdminId(playersMap) {
  const ids = Object.keys(playersMap);
  if (!ids.length) return null;
  return ids.reduce((a, b) => (playersMap[a].ts <= playersMap[b].ts ? a : b));
}

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const channel = getChannel(roomId);

  const [playerName] = useState(() => localStorage.getItem('playerName') || '');
  const [showNamePrompt, setShowNamePrompt] = useState(!localStorage.getItem('playerName'));
  const [nameInput, setNameInput] = useState('');

  const [players, setPlayers]       = useState([]);
  const [isAdmin, setIsAdmin]       = useState(false);
  const [votes, setVotes]           = useState({});
  const [hasVoted, setHasVoted]     = useState(new Set());
  const [myVote, setMyVote]         = useState(null);
  const [revealed, setRevealed]     = useState(false);
  const [story, setStory]           = useState('');
  const [storyInput, setStoryInput] = useState('');
  const [showFelix, setShowFelix]   = useState(false);
  const [consensusValue, setConsensusValue] = useState(null);
  const [connected, setConnected]   = useState(false);
  const [copied, setCopied]         = useState(false);

  const sRef = useRef({              // shared mutable game state
    players: {},
    votes: {},
    pending: {},                     // votes before reveal
    hasVoted: new Set(),
    revealed: false,
    story: '',
    adminId: null,
  });
  const pnRef        = useRef(null);
  const storyTimer   = useRef(null);
  const started      = useRef(false);

  /* ── sync ref state → React state ── */
  const sync = useCallback(() => {
    const s = sRef.current;
    const arr = Object.values(s.players).sort((a, b) => a.ts - b.ts)
      .map(p => ({ ...p, isAdmin: p.id === s.adminId }));
    setPlayers(arr);
    setIsAdmin(s.adminId === MY_ID);
    setRevealed(s.revealed);
    setStory(s.story);
    if (s.revealed) {
      setVotes({ ...s.votes });
      setMyVote(s.votes[MY_ID] ?? null);
    } else {
      setHasVoted(new Set(s.hasVoted));
    }
  }, []);

  /* ── publish helper ── */
  function pub(msg) {
    pnRef.current?.publish({ channel, message: msg }).catch(() => {});
  }

  /* ── serialise state for sync ── */
  function shareableState() {
    const s = sRef.current;
    return {
      players:  { ...s.players },
      adminId:  s.adminId,
      revealed: s.revealed,
      story:    s.story,
      votes:    s.revealed ? { ...s.votes } : {},
      pending:  { ...s.pending },
      hasVoted: Array.from(s.hasVoted),
    };
  }

  /* ── message handler ── */
  const onMsg = useCallback((msg) => {
    const s = sRef.current;

    switch (msg.type) {

      case 'JOIN': {
        if (!s.players[msg.id]) {
          s.players[msg.id] = { id: msg.id, name: msg.name, ts: msg.ts };
          s.adminId = getAdminId(s.players);
          if (s.adminId === MY_ID && msg.id !== MY_ID) {
            setTimeout(() => pub({ type: 'STATE_SYNC', targetId: msg.id, state: shareableState() }), 300);
          }
        }
        sync();
        break;
      }

      case 'LEAVE': {
        delete s.players[msg.id];
        s.hasVoted.delete(msg.id);
        delete s.pending[msg.id];
        if (s.revealed) delete s.votes[msg.id];
        s.adminId = getAdminId(s.players);
        sync();
        break;
      }

      case 'VOTE': {
        s.hasVoted.add(msg.id);
        s.pending[msg.id] = msg.value;
        sync();
        break;
      }

      case 'UNVOTE': {
        s.hasVoted.delete(msg.id);
        delete s.pending[msg.id];
        sync();
        break;
      }

      case 'REVEAL': {
        s.revealed = true;
        s.votes = { ...s.pending };
        const vals = Object.values(s.votes);
        const consensus = vals.length > 0 && vals.every(v => v === vals[0]);
        sync();
        if (consensus) {
          setConsensusValue(vals[0]);
          setTimeout(() => setShowFelix(true), 400);
        }
        break;
      }

      case 'RESET': {
        s.revealed = false;
        s.votes = {};
        s.pending = {};
        s.hasVoted = new Set();
        s.story = msg.story ?? '';
        sync();
        setMyVote(null);
        setConsensusValue(null);
        setShowFelix(false);
        break;
      }

      case 'SET_STORY': {
        s.story = msg.story;
        setStory(msg.story);
        setStoryInput(msg.story);
        break;
      }

      case 'STATE_REQUEST': {
        if (s.adminId === MY_ID && msg.id !== MY_ID) {
          setTimeout(() => pub({ type: 'STATE_SYNC', targetId: msg.id, state: shareableState() }), 200);
        }
        break;
      }

      case 'STATE_SYNC': {
        if (msg.targetId && msg.targetId !== MY_ID) break;
        const inc = msg.state;
        for (const [id, p] of Object.entries(inc.players || {})) {
          if (!s.players[id]) s.players[id] = p;
        }
        s.adminId  = inc.adminId || getAdminId(s.players);
        s.revealed = inc.revealed;
        s.story    = inc.story;
        s.votes    = inc.votes || {};
        s.pending  = inc.pending || {};
        s.hasVoted = new Set(inc.hasVoted || []);
        sync();
        break;
      }

      default: break;
    }
  }, [sync]);

  /* ── start PubNub ── */
  function start(name) {
    if (started.current) return;
    started.current = true;

    const pn = createPubNub(MY_ID);
    pnRef.current = pn;

    pn.addListener({
      message:  ({ message }) => onMsg(message),
      presence: ({ action, uuid }) => {
        if ((action === 'leave' || action === 'timeout') && uuid !== MY_ID) {
          onMsg({ type: 'LEAVE', id: uuid });
        }
      },
      status: ({ category }) => {
        if (category === 'PNConnectedCategory') {
          setConnected(true);
          const ts = Date.now();
          const s = sRef.current;
          s.players[MY_ID] = { id: MY_ID, name, ts };
          s.adminId = getAdminId(s.players);
          sync();
          pub({ type: 'JOIN', id: MY_ID, name, ts });
          setTimeout(() => pub({ type: 'STATE_REQUEST', id: MY_ID }), 600);
        }
        if (['PNNetworkIssuesCategory', 'PNNetworkDownCategory'].includes(category)) setConnected(false);
        if (category === 'PNNetworkUpCategory') setConnected(true);
      },
    });

    pn.subscribe({ channels: [channel], withPresence: true });
  }

  useEffect(() => {
    if (!showNamePrompt) start(playerName);
    return () => {
      if (pnRef.current) {
        pub({ type: 'LEAVE', id: MY_ID });
        pnRef.current.unsubscribeAll();
        pnRef.current.destroy?.();
        pnRef.current = null;
      }
    };
  }, [showNamePrompt]);

  /* ── actions ── */
  function handleVote(value) {
    if (revealed) return;
    if (myVote === value) { setMyVote(null); pub({ type: 'UNVOTE', id: MY_ID }); }
    else                  { setMyVote(value); pub({ type: 'VOTE', id: MY_ID, value }); }
  }
  function handleReveal()  { pub({ type: 'REVEAL' }); }
  function handleReset()   { pub({ type: 'RESET', story: storyInput }); setShowFelix(false); }
  function handleStory(v)  {
    setStoryInput(v);
    clearTimeout(storyTimer.current);
    storyTimer.current = setTimeout(() => pub({ type: 'SET_STORY', story: v }), 500);
  }
  function copyCode() {
    navigator.clipboard.writeText(roomId).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }
  function submitName() {
    const n = nameInput.trim();
    if (!n) return;
    localStorage.setItem('playerName', n);
    setShowNamePrompt(false);
  }

  /* ── stats ── */
  const numVals = Object.values(votes).filter(v => !isNaN(Number(v))).map(Number);
  const avg = numVals.length ? (numVals.reduce((a, b) => a + b, 0) / numVals.length).toFixed(1) : null;

  /* ── name prompt ── */
  if (showNamePrompt) return (
    <div className="min-h-screen bg-dark halftone flex items-center justify-center p-4">
      <div className="comic-card w-full max-w-sm p-8 text-center">
        <div className="text-5xl mb-4">🐱</div>
        <h2 className="font-comic text-3xl text-neon-yellow mb-6">Ton prénom ?</h2>
        <input className="comic-input text-center text-xl mb-4" placeholder="Ex: Félix"
          value={nameInput} onChange={e => setNameInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submitName()} autoFocus />
        <button onClick={submitName} className="btn-neon-pink w-full">Entrer 🐾</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark halftone flex flex-col">

      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          <button onClick={() => navigate('/')} className="font-comic text-2xl text-neon-yellow tracking-wider">
            🐱 POKER CATS
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-gray-400 text-sm hidden sm:block">Code:</span>
            <button onClick={copyCode}
              className="font-comic text-lg tracking-[0.2em] px-4 py-1.5 rounded-lg border-2 border-dark-border hover:border-neon-blue text-neon-blue transition-all">
              {copied ? '✓ Copié!' : roomId}
            </button>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-neon-green' : 'bg-red-500'} animate-pulse`} />
        </div>
      </header>

      {/* Story bar */}
      <div className="border-b border-dark-border bg-dark/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-gray-400 text-sm whitespace-nowrap">📋 Story:</span>
          {isAdmin
            ? <input className="flex-1 bg-transparent border-b-2 border-dark-border focus:border-neon-blue outline-none text-white px-1 py-0.5 transition-colors"
                placeholder="Titre de la story..." value={storyInput}
                onChange={e => handleStory(e.target.value)} maxLength={80} />
            : <span className="flex-1 text-white">{story || <span className="text-gray-500 italic">En attente…</span>}</span>
          }
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* LEFT — voting */}
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
            {CAT_VALUES.map(value => (
              <CatCard key={value} value={value} selected={myVote === value}
                disabled={revealed} onClick={() => handleVote(value)} />
            ))}
          </div>

          {!revealed && (
            <div className="mt-6 comic-card p-4">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-400">{hasVoted.size} / {players.length} votes</span>
                <span className="text-neon-green">
                  {players.length > 0 ? Math.round((hasVoted.size / players.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-dark-border rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-neon-pink to-neon-blue transition-all duration-500"
                  style={{ width: `${players.length > 0 ? (hasVoted.size / players.length) * 100 : 0}%` }} />
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="mt-4 flex gap-3 flex-wrap">
              {!revealed
                ? <button onClick={handleReveal} disabled={hasVoted.size === 0}
                    className={`btn-neon-pink flex-1 ${hasVoted.size === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    👁 Révéler ({hasVoted.size})
                  </button>
                : <button onClick={handleReset} className="btn-neon-green flex-1">
                    🔄 Nouvelle manche
                  </button>
              }
            </div>
          )}
        </div>

        {/* RIGHT — players */}
        <div className="lg:w-80">
          <h2 className="font-comic text-2xl text-white tracking-wider mb-4">
            👥 Joueurs ({players.length})
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {players.map(player => (
              <PlayerCard key={player.id} player={player}
                isMe={player.id === MY_ID}
                hasVoted={hasVoted.has(player.id) || (revealed && votes[player.id] != null)}
                vote={revealed ? votes[player.id] : null}
                revealed={revealed} />
            ))}
          </div>
          {!isAdmin && !revealed && (
            <p className="mt-6 text-center text-gray-500 text-sm">En attente que l'admin révèle les cartes…</p>
          )}
        </div>
      </div>

      {showFelix && <FelixScreen value={consensusValue} onDismiss={() => setShowFelix(false)} />}
    </div>
  );
}
