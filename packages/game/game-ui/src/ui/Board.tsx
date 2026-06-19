import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import type { InstanceId, ZoneId } from '@mtg/game-core';
import { moveCard } from '@mtg/game-core';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import Player from './Player/Player';
import Inspector from './inspector/Inspector';
import { CardInspectorProvider } from './inspector/CardInspectorProvider';

import styles from './Board.module.css';

export function Board() {
  const dispatch = useAppDispatch();
  const playerIds = useAppSelector((s) => Object.keys(s.board.players));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const data = over.data.current as
      | { type: 'battlefield' | 'hand'; zoneId: ZoneId }
      | undefined;
    if (!data) return;

    const instanceId = active.id as InstanceId;

    if (data.type === 'battlefield') {
      //todo аишный код, нужно разобраться и прочекать
      const dragRect = active.rect.current.translated;
      if (!dragRect) return;

      const x = dragRect.left - over.rect.left;
      const y = dragRect.top - over.rect.top;

      dispatch(
        moveCard({
          instanceId,
          zoneId: data.zoneId,
          x: Math.max(0, x),
          y: Math.max(0, y),
        }),
      );
      return;
    }

    // todo вставлять карту не в конец а куда ее дропнут
    dispatch(moveCard({ instanceId, zoneId: data.zoneId }));
  };

  // todo раскладка под 1/2/4 игроков, сейчас просто колонка
  return (
    <CardInspectorProvider>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className={styles.window}>
          <div className={styles.board}>
            {playerIds.map((id) => (
              <Player key={id} playerId={id} />
            ))}
          </div>
          <Inspector />
        </div>
      </DndContext>
    </CardInspectorProvider>
  );
}
