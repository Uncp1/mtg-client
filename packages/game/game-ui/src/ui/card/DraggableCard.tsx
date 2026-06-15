import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { CardData, CardInstance } from '@mtg/game-core';

import Card from './Card';

interface Props {
  instance: CardInstance;
  definition: CardData;
}

export default function DraggableCard({ instance, definition }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: instance.instanceId });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      //todo перекинуть в css
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : undefined,
        zIndex: isDragging ? 1000 : undefined,
        cursor: 'grab',
        touchAction: 'none',
      }}
    >
      <Card instance={instance} definition={definition} />
    </div>
  );
}
