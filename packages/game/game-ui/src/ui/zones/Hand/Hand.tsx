import { useDroppable } from '@dnd-kit/core';
import type { PlayerId } from '@mtg/game-core';
import { zoneId } from '@mtg/game-core';

import { useAppSelector } from '../../../store/hooks';
import DraggableCard from '../../card/DraggableCard';

import styles from './Hand.module.css';

interface Props {
  playerId: PlayerId;
}

export default function Hand({ playerId }: Props) {
  const targetZoneId = zoneId(playerId, 'hand');
  const hand = useAppSelector((s) => s.board.zones[targetZoneId]);
  const cards = useAppSelector((s) => s.board.cards);
  const cardDefs = useAppSelector((s) => s.board.cardDefs);

  const { setNodeRef, isOver } = useDroppable({
    id: targetZoneId,
    data: { type: 'hand', zoneId: targetZoneId },
  });

  return (
    <section
      ref={setNodeRef}
      className={styles.hand}
      style={isOver ? { outline: '2px solid #7aa2ff' } : undefined}
    >
      <h3>hand ({hand.cardsId.length})</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {hand.cardsId.map((id) => {
          const instance = cards[id];
          const definition = cardDefs[instance.definitionId];
          if (!definition) return null;
          return (
            <DraggableCard
              key={id}
              instance={instance}
              definition={definition}
            />
          );
        })}
      </div>
    </section>
  );
}
