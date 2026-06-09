import clsx from 'clsx';
import { boardActions, type PlayerId, zoneId } from '@mtg/game-core';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';

import styles from './ZonePile.module.css';

interface Props {
  playerId: PlayerId;
  type: 'library' | 'graveyard' | 'exile';
}

export default function ZonePile({ playerId, type }: Props) {
  const dispatch = useAppDispatch();

  const zone = useAppSelector(
    (state) => state.board.zones[zoneId(playerId, type)],
  );

  const cards = useAppSelector((s) => s.board.cards);
  const cardDefs = useAppSelector((s) => s.board.cardDefs);

  const topId = zone.cardsId.at(0);
  const topDef = topId ? cardDefs[cards[topId].definitionId] : undefined;

  const onClick = () =>
    type === 'library'
      ? dispatch(boardActions.drawCards({ playerId, numberOfCards: 1 }))
      : console.log('todo add contextMenu');

  return (
    <div className={clsx(styles.zone)} onClick={onClick}>
      {type === 'library' || !topDef ? (
        <div className={clsx(styles.back)}></div>
      ) : (
        <img src={topDef.imageURLS.normal} alt={topDef.name} />
      )}
      <span>{type}</span>
    </div>
  );
}
