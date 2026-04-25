import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

const rooms = new Map();

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getRoomState(roomId) {
  const room = rooms.get(roomId);
  if (!room) return null;

  const votesState = {};
  for (const [playerId] of room.votes) {
    votesState[playerId] = room.revealed ? room.votes.get(playerId) : 'voted';
  }

  return {
    players: Array.from(room.players.values()),
    votes: votesState,
    fullVotes: room.revealed ? Object.fromEntries(room.votes) : {},
    revealed: room.revealed,
    story: room.story,
    adminId: room.adminId,
  };
}

io.on('connection', (socket) => {
  let currentRoom = null;
  let playerName = null;

  socket.on('create-room', ({ name }, callback) => {
    const roomId = generateRoomId();
    rooms.set(roomId, {
      players: new Map([[socket.id, { id: socket.id, name, isAdmin: true }]]),
      votes: new Map(),
      revealed: false,
      story: '',
      adminId: socket.id,
    });
    currentRoom = roomId;
    playerName = name;
    socket.join(roomId);
    callback({ success: true, roomId, isAdmin: true, state: getRoomState(roomId) });
  });

  socket.on('join-room', ({ name, roomId }, callback) => {
    const id = roomId.toUpperCase().trim();
    const room = rooms.get(id);
    if (!room) {
      callback({ success: false, error: 'Salon introuvable 😿' });
      return;
    }
    room.players.set(socket.id, { id: socket.id, name, isAdmin: false });
    currentRoom = id;
    playerName = name;
    socket.join(id);
    socket.to(id).emit('player-joined', { id: socket.id, name });
    callback({ success: true, roomId: id, isAdmin: false, state: getRoomState(id) });
  });

  socket.on('vote', ({ value }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || room.revealed) return;
    room.votes.set(socket.id, value);
    io.to(currentRoom).emit('vote-cast', { playerId: socket.id });
  });

  socket.on('unvote', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || room.revealed) return;
    room.votes.delete(socket.id);
    io.to(currentRoom).emit('vote-removed', { playerId: socket.id });
  });

  socket.on('reveal', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;
    room.revealed = true;
    const votes = Object.fromEntries(room.votes);
    const values = Object.values(votes);
    const consensus = values.length > 0 && values.every((v) => v === values[0]);
    io.to(currentRoom).emit('votes-revealed', {
      votes,
      consensus,
      consensusValue: consensus ? values[0] : null,
    });
  });

  socket.on('reset', ({ story = '' }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;
    room.votes.clear();
    room.revealed = false;
    room.story = story;
    io.to(currentRoom).emit('round-reset', { story });
  });

  socket.on('set-story', ({ story }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;
    room.story = story;
    socket.to(currentRoom).emit('story-updated', { story });
  });

  socket.on('disconnect', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;
    room.players.delete(socket.id);
    room.votes.delete(socket.id);

    if (room.players.size === 0) {
      rooms.delete(currentRoom);
    } else {
      if (room.adminId === socket.id) {
        const newAdmin = room.players.values().next().value;
        newAdmin.isAdmin = true;
        room.adminId = newAdmin.id;
        io.to(currentRoom).emit('admin-changed', { adminId: newAdmin.id });
      }
      io.to(currentRoom).emit('player-left', { id: socket.id, name: playerName });
    }
  });
});

if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, 'client', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🐱 Planning Poker Cats running on port ${PORT}`);
});
