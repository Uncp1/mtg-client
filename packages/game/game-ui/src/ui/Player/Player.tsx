import clsx from 'clsx';
import type { PlayerId } from '@mtg/game-core';

import { useAppSelector } from '../../store/hooks';
import Battlefield from '../zones/Battlefield/Battlefield';
import Hand from '../zones/Hand/Hand';
import ZonePile from '../zones/ZonePile/ZonePile';

import styles from './Player.module.css';

interface Props {
  playerId: PlayerId;
}

export default function Player({ playerId }: Props) {
  const player = useAppSelector((s) => s.board.players[playerId]);

  return (
    <section className={clsx(styles.player)}>
      <h2 className={styles.header}>
        {player.name} <small>· life {player.life}</small>
      </h2>

      <Battlefield playerId={playerId} />

      <div className={styles.piles}>
        <ZonePile playerId={playerId} type="library" />
        <ZonePile playerId={playerId} type="graveyard" />
        <ZonePile playerId={playerId} type="exile" />
      </div>

      <Hand playerId={playerId} />
    </section>
  );
}
