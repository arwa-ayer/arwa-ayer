export default function VoteCard({ value, selected, disabled, onClick }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`vote-card ${selected ? 'vote-card-selected' : ''} ${disabled ? 'vote-card-disabled' : ''}`}
    >
      <span className={`vote-card-corner ${selected ? 'text-indigo-600' : 'text-gray-400'}`}>{value}</span>
      <span className={`text-3xl font-extrabold leading-none ${selected ? 'text-indigo-600' : 'text-gray-800'}`}>
        {value}
      </span>
      <span className={`vote-card-corner rotate-180 ${selected ? 'text-indigo-600' : 'text-gray-400'}`}>{value}</span>
    </div>
  );
}
