import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { createGameCore, addCards, zoneId } from '@mtg/game-core';
import type { CardData, CardInstance, ZoneType } from '@mtg/game-core';
import { Board } from '@mtg/game-ui';
import { parseArenaImport, fetchDecklist } from '@mtg/scryfall-fetcher';

const players = [
  { id: 'p1', name: 'Pupa' },
  { id: 'p2', name: 'Buba' },
];

const core = createGameCore({ players });

// --- real demo: Arena decklists fetched through @mtg/scryfall-fetcher ---
const monoWhite = `About
Name monoW

Deck
4 Adanto Vanguard
4 Benalish Marshal
4 Conclave Tribunal
4 Dauntless Bodyguard
4 History of Benalia
4 Legion's Landing
16 Plains
2 Pride of Conquerors
4 Shefet Dunes
4 Skymarcher Aspirant
2 Snubhorn Sentry
4 Thraben Inspector
4 Venerated Loxodon

Sideboard
3 Ajani, Adversary of Tyrants
2 Fateful Absence
2 Imposing Sovereign
4 Surge of Salvation
4 Tocatli Honor Guard`;

const gruul = `About
Name beginnerGruulNoAdventure

Deck
4 Domri Rade
9 Forest
4 Ghor-Clan Rampager
4 Hellrider
4 Llanowar Elves
6 Mountain
2 Paradise Druid
4 Pelt Collector
4 Rootbound Crag
1 Sheltered Thicket
4 Stomping Ground
2 Thundering Rebuke
4 Werewolf Pack Leader

Sideboard
2 Blossoming Defense
1 Carnage Tyrant
4 Cindervines
2 Heroic Intervention
1 Nissa, Vital Force
2 Pillar of Flame
1 Reclamation Sage
1 Zealous Conscripts`;

/** Fetch a decklist via Scryfall and build the card defs + instances for one player. */
async function buildSeed(
  decklist: string,
  ownerId: string,
): Promise<{ cardDefs: CardData[]; cards: CardInstance[] }> {
  const deck = parseArenaImport(decklist);
  const names = [...deck.mainDeck, ...deck.sideboard].map((entry) => entry.name);

  const { found, tokens, notFound } = await fetchDecklist(names);

  if (notFound.length) {
    console.warn(`[${deck.name}] not found on Scryfall:`, notFound.map((n) => n.name).join(', '));
  }

  const defByName = new Map(found.map((def) => [def.name, def]));

  let counter = 0;
  const cards: CardInstance[] = [];

  const place = (entries: { name: string; quantity: number }[], zone: ZoneType) => {
    for (const entry of entries) {
      const def = defByName.get(entry.name);
      if (!def) continue; // missing card already reported above
      for (let i = 0; i < entry.quantity; i++) {
        cards.push({
          instanceId: `${ownerId}-${++counter}`,
          definitionId: def.id,
          ownerId,
          controllerId: ownerId,
          zoneId: zoneId(ownerId, zone),
        });
      }
    }
  };

  place(deck.mainDeck, 'library');
  place(deck.sideboard, 'sideboard');

  // tokens referenced by the deck live in the token store
  for (const token of tokens) {
    cards.push({
      instanceId: `${ownerId}-${++counter}`,
      definitionId: token.id,
      ownerId,
      controllerId: ownerId,
      zoneId: zoneId(ownerId, 'tokenStore'),
    });
  }

  return { cardDefs: [...found, ...tokens], cards };
}

export default function App() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [white, green] = await Promise.all([
          buildSeed(monoWhite, 'p1'),
          buildSeed(gruul, 'p2'),
        ]);
        if (cancelled) return;

        core.dispatch(
          addCards({
            cardDefs: [...white.cardDefs, ...green.cardDefs],
            cards: [...white.cards, ...green.cards],
          }),
        );
        console.log(core.getState());
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        console.error('failed to fetch decklists', err);
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading')
    return <p style={{ fontFamily: 'sans-serif', padding: 16 }}>Loading decks from Scryfall…</p>;
  if (status === 'error')
    return (
      <p style={{ fontFamily: 'sans-serif', padding: 16 }}>Failed to load decks — check the console.</p>
    );

  return (
    <Provider store={core.store}>
      <Board />
    </Provider>
  );
}
