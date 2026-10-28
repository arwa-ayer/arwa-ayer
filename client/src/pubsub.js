import PubNub from 'pubnub';

export function getPlayerId() {
  // sessionStorage so each browser tab has its own identity (localStorage was
  // shared across tabs → two tabs in the same browser collided on the same id
  // and only ever saw themselves in the room)
  let id = sessionStorage.getItem('pp_player_id');
  if (!id) {
    id = 'p' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    sessionStorage.setItem('pp_player_id', id);
  }
  return id;
}

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function getChannel(roomCode) {
  return `pp-cats-v3-${roomCode.toUpperCase()}`;
}

export function createPubNub(userId) {
  // Shorter heartbeat so ghost sessions (closed tabs, dropped network) time
  // out in ~60s instead of PubNub's 300s default
  return new PubNub({
    publishKey: 'demo', subscribeKey: 'demo', userId,
    heartbeatInterval: 20,
    presenceTimeout: 60,
  });
}
