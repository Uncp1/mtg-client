import clsx from 'clsx';
import type { CardData, CardInstance } from '@mtg/game-core';

import styles from './Card.module.css';
import { useCardInspector } from '../inspector/CardInspectorProvider';

interface Props {
  instance: CardInstance;
  definition: CardData;
  onClick?: () => void;
  onHover?: () => void;
  onRightClick?: () => void; // add menu later
}

export default function Card({
  instance,
  definition,
  onClick,
  onHover,
  onRightClick,
}: Props) {
  //todo add face down
  const img = definition.imageURLS.normal;

  const { inspect } = useCardInspector();

  return (
    <div
      className={clsx(styles.card, instance.tapped && styles.tapped)}
      onClick={() => {
        inspect(instance.instanceId);
        onClick?.();
      }}
    >
      <img
        className={styles.art}
        src={img}
        alt={definition.name}
        draggable={false}
      />
    </div>
  );
}
