import clsx from 'clsx';
import type { PlayerId } from '@mtg/game-core';

import { useAppSelector } from '../../store/hooks';
import Battlefield from '../zones/Battlefield/Battlefield';
import Hand from '../zones/Hand/Hand';
import ZonePile from '../zones/ZonePile/ZonePile';

import styles from './Player.module.css';

type PlayerType = 'self' | 'opponent';

interface Props {
  playerId: PlayerId;
  playerType?: PlayerType;
}

export default function Player({ playerId }: Props) {
  const player = useAppSelector((s) => s.board.players[playerId]);

  return (
    <section className={clsx(styles.container)}>
      <Battlefield playerId={playerId} />

      <div className={styles.player}>
        <h2 className={styles.header}>
          {player.name} <small>· life {player.life}</small>
        </h2>

        <Hand playerId={playerId} />

        <div className={styles.piles}>
          <ZonePile playerId={playerId} type="library" />
          <ZonePile playerId={playerId} type="graveyard" />
          <ZonePile playerId={playerId} type="exile" />
        </div>
      </div>
    </section>
  );
}
