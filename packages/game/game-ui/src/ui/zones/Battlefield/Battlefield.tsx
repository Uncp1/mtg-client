import { useDroppable } from '@dnd-kit/core';
import { type PlayerId, zoneId } from '@mtg/game-core';

import { useAppSelector } from '../../../store/hooks';
import DraggableCard from '../../card/DraggableCard';

import styles from './Battlefield.module.css';

interface Props {
  playerId: PlayerId;
}

export default function Battlefield({ playerId }: Props) {
  const targetZoneId = zoneId(playerId, 'battlefield');
  const zone = useAppSelector((state) => state.board.zones[targetZoneId]);
  const cards = useAppSelector((s) => s.board.cards);
  const cardDefs = useAppSelector((s) => s.board.cardDefs);

  const { setNodeRef, isOver } = useDroppable({
    id: targetZoneId,
    data: { type: 'battlefield', zoneId: targetZoneId },
  });

  return (
    <div
      ref={setNodeRef}
      className={styles.battlefield}
      style={isOver ? { borderColor: '#7aa2ff' } : undefined}
    >
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
            <DraggableCard instance={inst} definition={def} />
          </div>
        );
      })}
    </div>
  );
}
