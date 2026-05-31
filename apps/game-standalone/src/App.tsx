import { Provider } from 'react-redux';
import { createGameCore, addCards, zoneId } from '@mtg/game-core';
import type { CardData, CardInstance } from '@mtg/game-core';
import { Board } from '@mtg/game-ui';

const players = [
  { id: 'p1', name: 'Pupa' },
  { id: 'p2', name: 'Buba' },
];

const core = createGameCore({ players });

// --- fake demo seed (no Scryfall yet) ---
const cardDefs: CardData[] = [
  {
    id: 'def-forest',
    name: 'Forest',
    imageURL: '',
    oracleText: '',
    typeLine: 'Basic Land — Forest',
  },
  {
    id: 'def-bear',
    name: 'Grizzly Bears',
    imageURL: '',
    oracleText: '',
    typeLine: 'Creature — Bear',
    manaCost: '{1}{G}',
  },
  {
    id: 'def-bolt',
    name: 'Lightning Bolt',
    imageURL: '',
    oracleText: 'Deal 3 damage to any target.',
    typeLine: 'Instant',
    manaCost: '{R}',
  },
];

const cards: CardInstance[] = [
  {
    instanceId: 'c1',
    definitionId: 'def-bear',
    ownerId: 'p1',
    controllerId: 'p1',
    zoneId: zoneId('p1', 'battlefield'),
    x: 40,
    y: 40,
  },
  {
    instanceId: 'c2',
    definitionId: 'def-bolt',
    ownerId: 'p1',
    controllerId: 'p1',
    zoneId: zoneId('p1', 'hand'),
  },
  {
    instanceId: 'c3',
    definitionId: 'def-forest',
    ownerId: 'p1',
    controllerId: 'p1',
    zoneId: zoneId('p1', 'library'),
  },
];

core.dispatch(addCards({ cardDefs, cards }));

console.log(core.getState());

export default function App() {
  return (
    <Provider store={core.store}>
      <Board />
    </Provider>
  );
}
