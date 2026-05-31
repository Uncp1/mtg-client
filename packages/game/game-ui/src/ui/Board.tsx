import { useAppSelector } from '../store/hooks';

export function Board() {
  const { players, zones, cards, cardDefs } = useAppSelector((s) => s.board);
  //todo внимание аишный ui ниже, плейсхолдер для тестов
  return (
    <div style={{ display: 'flex', gap: 24, padding: 16, fontFamily: 'sans-serif' }}>
      {Object.values(players).map((player) => {
        const playerZones = Object.values(zones).filter((z) => z.ownerId === player.id);

        return (
          <section
            key={player.id}
            style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, minWidth: 220 }}
          >
            <h2 style={{ margin: '0 0 8px' }}>
              {player.name} <small>· life {player.life}</small>
            </h2>

            {playerZones.map((zone) => (
              <div key={zone.id} style={{ marginBottom: 8 }}>
                <strong>{zone.type}</strong> ({zone.cardsId.length})
                <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
                  {zone.cardsId.map((id) => {
                    const card = cards[id];
                    const def = cardDefs[card.definitionId];
                    return <li key={id}>{def?.name ?? card.definitionId}</li>;
                  })}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
