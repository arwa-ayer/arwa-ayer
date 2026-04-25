import PubNub from 'pubnub';

export function getPlayerId() {
  let id = localStorage.getItem('pp_player_id');
  if (!id) {
    id = 'p' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('pp_player_id', id);
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
  return new PubNub({ publishKey: 'demo', subscribeKey: 'demo', userId });
}
