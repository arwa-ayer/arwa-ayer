import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlayerId, getChannel, createPubNub } from '../pubsub';
import VoteCard from '../components/VoteCard';
import PlayerCard from '../components/PlayerCard';
import FelixScreen from '../components/FelixScreen';
import { AVATARS, CatAvatar } from '../cats/CatAvatars';

const VOTE_VALUES = ['1', '2', '3', '5', '8', '13', '21', '?', '☕'];
const MY_ID = getPlayerId();
const MY_AVATAR = parseInt(localStorage.getItem('pp_avatar') || '0');

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
  const [avatarInput, setAvatarInput] = useState(MY_AVATAR);

  const [players, setPlayers]     = useState([]);
  const [isAdmin, setIsAdmin]     = useState(() => localStorage.getItem(`pp_creator_${roomId}`) === '1');
  const [votes, setVotes]         = useState({});
  const [hasVoted, setHasVoted]   = useState(new Set());
  const [myVote, setMyVote]       = useState(null);
  const [revealed, setRevealed]   = useState(false);
  const [story, setStory]         = useState('');
  const [storyInput, setStoryInput] = useState('');
  const [showFelix, setShowFelix] = useState(false);
  const [consensusValue, setConsensusValue] = useState(null);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied]       = useState(false);
  const [showQR, setShowQR]       = useState(false);

  const sRef = useRef({ players: {}, votes: {}, pending: {}, hasVoted: new Set(), revealed: false, story: '', adminId: null });
  const pnRef = useRef(null);
  const storyTimer = useRef(null);
  const started = useRef(false);

  const sync = useCallback(() => {
    const s = sRef.current;
    const arr = Object.values(s.players).sort((a, b) => a.ts - b.ts)
      .map(p => ({ ...p, isAdmin: p.id === s.adminId }));
    setPlayers(arr);
    const amAdmin = s.adminId === MY_ID;
    setIsAdmin(amAdmin);
    if (amAdmin && (s.hasVoted.has(MY_ID) || s.pending[MY_ID] != null || s.votes[MY_ID] != null)) {
      s.hasVoted.delete(MY_ID);
      delete s.pending[MY_ID];
      delete s.votes[MY_ID];
      pub({ type: 'UNVOTE', id: MY_ID });
      setMyVote(null);
    }
    setRevealed(s.revealed);
    setStory(s.story);
    if (s.revealed) { setVotes({ ...s.votes }); setMyVote(s.votes[MY_ID] ?? null); }
    else            { setHasVoted(new Set(s.hasVoted)); }
  }, []);

  function pub(msg) { pnRef.current?.publish({ channel, message: msg }).catch(() => {}); }

  function shareableState() {
    const s = sRef.current;
    return { players: { ...s.players }, adminId: s.adminId, revealed: s.revealed, story: s.story,
             votes: s.revealed ? { ...s.votes } : {}, pending: { ...s.pending }, hasVoted: Array.from(s.hasVoted) };
  }

  const onMsg = useCallback((msg) => {
    const s = sRef.current;
    switch (msg.type) {
      case 'JOIN': {
        if (!s.players[msg.id]) {
          s.players[msg.id] = { id: msg.id, name: msg.name, ts: msg.ts, avatarId: msg.avatarId ?? 0 };
          s.adminId = getAdminId(s.players);
          if (s.adminId === MY_ID && msg.id !== MY_ID)
            setTimeout(() => pub({ type: 'STATE_SYNC', targetId: msg.id, state: shareableState() }), 300);
        }
        sync(); break;
      }
      case 'LEAVE': {
        delete s.players[msg.id]; s.hasVoted.delete(msg.id); delete s.pending[msg.id];
        if (s.revealed) delete s.votes[msg.id];
        s.adminId = getAdminId(s.players); sync(); break;
      }
      case 'VOTE':   { s.hasVoted.add(msg.id); s.pending[msg.id] = msg.value; sync(); break; }
      case 'UNVOTE': { s.hasVoted.delete(msg.id); delete s.pending[msg.id]; sync(); break; }
      case 'REVEAL': {
        s.revealed = true; s.votes = { ...s.pending };
        const nonAdminVals = Object.entries(s.votes).filter(([id]) => id !== s.adminId).map(([, v]) => v);
        const vals = nonAdminVals.length > 0 ? nonAdminVals : Object.values(s.votes);
        const consensus = vals.length > 0 && vals.every(v => v === vals[0]);
        sync();
        if (consensus) { setConsensusValue(vals[0]); setTimeout(() => setShowFelix(true), 400); }
        break;
      }
      case 'RESET': {
        s.revealed = false; s.votes = {}; s.pending = {}; s.hasVoted = new Set(); s.story = msg.story ?? '';
        sync(); setMyVote(null); setConsensusValue(null); setShowFelix(false); break;
      }
      case 'SET_STORY':    { s.story = msg.story; setStory(msg.story); setStoryInput(msg.story); break; }
      case 'STATE_REQUEST':{ if (s.adminId === MY_ID && msg.id !== MY_ID) setTimeout(() => pub({ type: 'STATE_SYNC', targetId: msg.id, state: shareableState() }), 200); break; }
      case 'STATE_SYNC': {
        if (msg.targetId && msg.targetId !== MY_ID) break;
        const inc = msg.state;
        for (const [id, p] of Object.entries(inc.players || {})) if (!s.players[id]) s.players[id] = p;
        s.adminId = inc.adminId || getAdminId(s.players); s.revealed = inc.revealed; s.story = inc.story;
        s.votes = inc.votes || {}; s.pending = inc.pending || {}; s.hasVoted = new Set(inc.hasVoted || []);
        sync(); break;
      }
      default: break;
    }
  }, [sync]);

  function start(name, avatarId) {
    if (started.current) return;
    started.current = true;
    const pn = createPubNub(MY_ID);
    pnRef.current = pn;
    pn.addListener({
      message:  ({ message }) => onMsg(message),
      presence: ({ action, uuid }) => { if ((action === 'leave' || action === 'timeout') && uuid !== MY_ID) onMsg({ type: 'LEAVE', id: uuid }); },
      status: ({ category }) => {
        if (category === 'PNConnectedCategory') {
          setConnected(true);
          const ts = Date.now(); const s = sRef.current;
          s.players[MY_ID] = { id: MY_ID, name, ts, avatarId }; s.adminId = getAdminId(s.players); sync();
          pub({ type: 'JOIN', id: MY_ID, name, ts, avatarId });
          setTimeout(() => pub({ type: 'STATE_REQUEST', id: MY_ID }), 600);
        }
        if (['PNNetworkIssuesCategory', 'PNNetworkDownCategory'].includes(category)) setConnected(false);
        if (category === 'PNNetworkUpCategory') setConnected(true);
      },
    });
    pn.subscribe({ channels: [channel], withPresence: true });
  }

  useEffect(() => {
    if (!showNamePrompt) start(playerName, MY_AVATAR);
    return () => {
      if (pnRef.current) { pub({ type: 'LEAVE', id: MY_ID }); pnRef.current.unsubscribeAll(); pnRef.current.destroy?.(); pnRef.current = null; }
    };
  }, [showNamePrompt]);

  function handleVote(value) {
    if (revealed || isAdmin) return;
    if (myVote === value) { setMyVote(null); pub({ type: 'UNVOTE', id: MY_ID }); }
    else                  { setMyVote(value); pub({ type: 'VOTE', id: MY_ID, value }); }
  }
  function handleReveal() { pub({ type: 'REVEAL' }); }
  function handleReset()  { pub({ type: 'RESET', story: storyInput }); setShowFelix(false); }
  function handleStory(v) {
    setStoryInput(v);
    clearTimeout(storyTimer.current);
    storyTimer.current = setTimeout(() => pub({ type: 'SET_STORY', story: v }), 500);
  }
  function copyCode() {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }
  function submitName() {
    const n = nameInput.trim(); if (!n) return;
    localStorage.setItem('playerName', n);
    localStorage.setItem('pp_avatar', String(avatarInput));
    setShowNamePrompt(false);
  }

  const numVals = Object.values(votes).filter(v => !isNaN(Number(v))).map(Number);
  const avg = numVals.length ? (numVals.reduce((a, b) => a + b, 0) / numVals.length).toFixed(1) : null;

  /* ── Name prompt ── */
  if (showNamePrompt) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-sm p-8 text-center">
        <div className="text-3xl mb-4">🃏</div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Rejoindre la session</h2>
        <p className="text-sm text-gray-500 mb-5">Choisissez votre avatar et entrez votre prénom</p>

        {/* Mini avatar picker */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {AVATARS.map(av => (
            <button key={av.id} onClick={() => setAvatarInput(av.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-150 ${
                avatarInput === av.id
                  ? 'bg-indigo-50 ring-2 ring-indigo-500'
                  : 'hover:bg-gray-50 opacity-60 hover:opacity-100'
              }`}
            >
              <CatAvatar id={av.id} size={44} />
              <span className={`text-xs font-medium ${avatarInput === av.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                {av.name}
              </span>
            </button>
          ))}
        </div>

        <input className="input text-center text-base mb-4" placeholder="Ex : Alex"
          value={nameInput} onChange={e => setNameInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submitName()} autoFocus />
        <button onClick={submitName} className="btn btn-primary btn-lg w-full">Rejoindre</button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-900 font-bold text-base hover:text-indigo-600 transition-colors">
            <span>🃏</span> Planning Poker
          </button>

          {/* Story input (admin) or display */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap hidden sm:block">Story</span>
            {isAdmin
              ? <input
                  className="flex-1 text-sm text-gray-800 bg-transparent border-0 outline-none
                             border-b border-transparent hover:border-gray-300 focus:border-indigo-400
                             px-1 py-0.5 transition-colors placeholder-gray-300"
                  placeholder="Titre de la story en cours..."
                  value={storyInput} onChange={e => handleStory(e.target.value)} maxLength={80} />
              : <span className="flex-1 text-sm text-gray-600 truncate">
                  {story || <span className="text-gray-400 italic text-xs">En attente d'une story…</span>}
                </span>
            }
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-400 hidden sm:block">Salon :</span>
            <span className="font-mono text-sm font-bold text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50">
              {roomId}
            </span>
          </div>

          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${connected ? 'bg-emerald-500' : 'bg-red-400'}`} />
        </div>
      </header>

      {/* ── Invite link bar ── */}
      <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-xs font-semibold text-indigo-400 whitespace-nowrap hidden sm:block">Lien d'invitation</span>
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <input
              readOnly
              value={`${window.location.origin}${window.location.pathname}?room=${roomId}`}
              className="flex-1 text-xs font-mono text-indigo-700 bg-white border border-indigo-200
                         rounded-lg px-3 py-1.5 outline-none select-all cursor-text truncate"
              onClick={e => e.target.select()}
            />
            <button onClick={copyCode}
              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg
                         bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              {copied ? '✓ Copié' : 'Copier'}
            </button>
            <button onClick={() => setShowQR(v => !v)}
              title="QR Code"
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                showQR
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
              }`}>
              QR
            </button>
          </div>
        </div>

        {/* QR code panel */}
        {showQR && (
          <div className="max-w-7xl mx-auto mt-3 mb-1 flex justify-center">
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-md p-4 flex flex-col items-center gap-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=6&data=${encodeURIComponent(`${window.location.origin}${window.location.pathname}?room=${roomId}`)}`}
                alt="QR Code"
                width={180}
                height={180}
                className="rounded-lg"
              />
              <p className="text-xs text-gray-400 font-mono">{roomId}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Participants bar ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">
            👥 {players.length} connecté{players.length > 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {players.map(p => (
              <div key={p.id} className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                p.id === MY_ID ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-700'
              }`}>
                <CatAvatar id={p.avatarId ?? 0} size={18} />
                <span>{p.name}</span>
                {p.isAdmin && <span title="Admin">👑</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Canvas (main playing area) ── */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50">
        <div className="min-h-full flex flex-col items-center justify-center gap-6 p-6 py-10">

          {/* Admin action button */}
          {isAdmin && (
            <div>
              {!revealed ? (
                <button onClick={handleReveal} disabled={hasVoted.size === 0}
                  className="btn btn-primary px-8 py-3 text-base font-bold shadow-lg shadow-indigo-200">
                  Révéler les cartes {hasVoted.size > 0 && `(${hasVoted.size}/${players.length})`}
                </button>
              ) : (
                <button onClick={handleReset} className="btn btn-success px-8 py-3 text-base font-bold shadow-lg shadow-emerald-200">
                  Nouvelle manche
                </button>
              )}
            </div>
          )}

          {/* Waiting message for non-admin */}
          {!isAdmin && !revealed && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-5 py-2 shadow-sm">
              <p className="text-xs text-gray-500 font-medium">
                {hasVoted.size === 0
                  ? 'En attente des votes…'
                  : `${hasVoted.size} / ${players.length} ont voté`
                }
              </p>
            </div>
          )}

          {/* Progress bar (pre-reveal) */}
          {!revealed && players.length > 0 && (
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{hasVoted.size} / {players.length}</span>
                <span>{Math.round((hasVoted.size / players.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/80 rounded-full h-1.5 border border-gray-200">
                <div className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${(hasVoted.size / players.length) * 100}%` }} />
              </div>
            </div>
          )}

          {/* Player cards */}
          <div className="flex flex-wrap justify-center gap-8">
            {players.map(player => (
              <PlayerCard key={player.id} player={player}
                isMe={player.id === MY_ID}
                hasVoted={hasVoted.has(player.id) || (revealed && votes[player.id] != null)}
                vote={revealed ? votes[player.id] : null}
                revealed={revealed} />
            ))}
          </div>

          {/* Average + my vote after reveal */}
          {revealed && (
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {avg && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-3 text-center">
                  <div className="text-xs text-gray-500 font-medium mb-0.5">Moyenne</div>
                  <div className="text-2xl font-extrabold text-gray-900">{avg}</div>
                </div>
              )}
              {myVote && !isAdmin && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-3 text-center">
                  <div className="text-xs text-gray-500 font-medium mb-0.5">Votre vote</div>
                  <div className="text-2xl font-extrabold text-indigo-600">{myVote}</div>
                </div>
              )}
            </div>
          )}

          {/* My vote indicator (pre-reveal) */}
          {!revealed && myVote && (
            <div className="bg-white/90 backdrop-blur-sm border border-indigo-200 rounded-full px-4 py-1.5 shadow-sm">
              <p className="text-xs font-semibold text-indigo-600">Votre vote : {myVote}</p>
            </div>
          )}
        </div>
      </main>

      {/* ── Bottom vote bar ── */}
      {!isAdmin && (
        <div className="vote-bar flex-shrink-0">
          <div className="flex items-center gap-2.5 overflow-x-auto px-4 py-3 justify-center">
            {VOTE_VALUES.map(value => (
              <VoteCard key={value} value={value} selected={myVote === value}
                disabled={revealed} onClick={() => handleVote(value)} />
            ))}
          </div>
        </div>
      )}

      {showFelix && <FelixScreen value={consensusValue} onDismiss={() => setShowFelix(false)} />}
    </div>
  );
}
