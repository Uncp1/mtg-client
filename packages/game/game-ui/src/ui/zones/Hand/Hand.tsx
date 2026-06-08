import type { PlayerId } from '@mtg/game-core';
import { zoneId } from '@mtg/game-core';

import { useAppSelector } from '../../../store/hooks';
import Card from '../../card/Card';

interface Props {
  playerId: PlayerId;
}

export default function Hand({ playerId }: Props) {
  const hand = useAppSelector((s) => s.board.zones[zoneId(playerId, 'hand')]);
  const cards = useAppSelector((s) => s.board.cards);
  const cardDefs = useAppSelector((s) => s.board.cardDefs);

  return (
    <section>
      <h3>hand ({hand.cardsId.length})</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {hand.cardsId.map((id) => {
          const instance = cards[id];
          const definition = cardDefs[instance.definitionId];
          if (!definition) return null;
          return <Card key={id} instance={instance} definition={definition} />;
        })}
      </div>
    </section>
  );
}
