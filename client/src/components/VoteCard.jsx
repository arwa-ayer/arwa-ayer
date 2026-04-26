const CARD_EMOJIS = {
  '1': '🐱', '2': '😺', '3': '😸', '5': '😻',
  '8': '😹', '13': '😼', '21': '🙀', '?': '🐈', '☕': '😴',
};

export default function VoteCard({ value, selected, disabled, onClick }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`vote-card ${selected ? 'vote-card-selected' : ''} ${disabled ? 'vote-card-disabled' : ''}`}
    >
      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{CARD_EMOJIS[value] || '🐱'}</span>
      <span className="text-lg font-extrabold leading-none text-white">{value}</span>
    </div>
  );
}
