import { useAppSelector } from '../store/hooks';
import Player from './Player/Player';

export function Board() {
  const playerIds = useAppSelector((s) => Object.keys(s.board.players));

  // todo раскладка под 1/2/4 игроков, сейчас просто колонка
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 16,
        fontFamily: 'sans-serif',
      }}
    >
      {playerIds.map((id) => (
        <Player key={id} playerId={id} />
      ))}
    </div>
  );
}
