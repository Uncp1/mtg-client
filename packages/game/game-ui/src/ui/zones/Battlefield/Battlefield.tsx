import { type PlayerId, zoneId } from '@mtg/game-core';

import { useAppSelector } from '../../../store/hooks';
import Card from '../../card/Card';

import styles from './Battlefield.module.css';

interface Props {
  playerId: PlayerId;
}

export default function Battlefield({ playerId }: Props) {
  const zone = useAppSelector(
    (state) => state.board.zones[zoneId(playerId, 'battlefield')],
  );
  const cards = useAppSelector((s) => s.board.cards);
  const cardDefs = useAppSelector((s) => s.board.cardDefs);

  return (
    <div className={styles.battlefield}>
      {zone.cardsId.map((id) => {
        const inst = cards[id];
        const def = cardDefs[inst.definitionId];
        if (!def) return null;
        return (
          <div
            key={id}
            className={styles.slot}
            style={{ left: inst.x ?? 0, top: inst.y ?? 0 }}
          >
            <Card instance={inst} definition={def} />
          </div>
        );
      })}
    </div>
  );
}
