interface CardData {
  name: string;
  quantity: number;
}

interface DeckData {
  name: string;
  mainDeck: CardData[];
  sideboard: CardData[];
}

export default function parseArenaImport(decklist: string): DeckData {
  //todo implement later: card n and deck size counter

  const result: DeckData = {
    name: 'nameless deck',
    mainDeck: [],
    sideboard: [],
  };

  let section: 'name' | 'deck' | 'sideboard' | null = null;

  const lines = decklist.split('\n');

  for (const lineRaw of lines) {
    const line = lineRaw.trim();

    if (!line || line === 'About') continue;

    if (line.startsWith('Name ')) {
      result.name = line.replace('Name ', '').trim();
      continue;
    }

    if (line === 'Deck') {
      section = 'deck';
      continue;
    }

    if (line === 'Sideboard') {
      section = 'sideboard';
      continue;
    }

    if (section === 'deck' || section === 'sideboard') {
      const spaceIdx = line.indexOf(' ');
      const quantity = parseInt(line.slice(0, spaceIdx), 10);
      const name = line.slice(spaceIdx + 1);

      const target = section === 'deck' ? result.mainDeck : result.sideboard;
      target.push({ quantity, name });
    }
  }

  return result;
}
