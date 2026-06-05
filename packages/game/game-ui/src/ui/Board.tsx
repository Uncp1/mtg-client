import { useAppSelector } from '../store/hooks';
import Card from './card/Card';

export function Board() {
  const { players, zones, cards, cardDefs } = useAppSelector((s) => s.board);
  //todo внимание аишный ui ниже, плейсхолдер для тестов
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 16,
        fontFamily: 'sans-serif',
      }}
    >
      {Object.values(players).map((player) => {
        const hand = zones[`${player.id}-hand`];

        return (
          <section
            key={player.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: 12,
            }}
          >
            <h2 style={{ margin: '0 0 8px' }}>
              {player.name} <small>· life {player.life}</small>
            </h2>
            <strong>hand</strong> ({hand.cardsId.length})
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              {hand.cardsId.map((id) => {
                const instance = cards[id];
                const definition = cardDefs[instance.definitionId];
                if (!definition) return null;
                return (
                  <Card key={id} instance={instance} definition={definition} />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
