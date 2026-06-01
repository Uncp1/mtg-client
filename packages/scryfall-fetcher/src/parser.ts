interface CardData {
  name: string;
  quantity: number;
}

interface DeckData {
  name: string;
  mainDeck: CardData[];
  sideboard: CardData[];
}

export function parseArenaImport(decklist: string): DeckData {
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

const testList = `
About
Name Izzet Prowess

Deck
3 Colorstorm Stallion
4 Stormchaser's Talent
4 Burst Lightning
1 Great Hall of the Biblioplex
4 Boomerang Basics
3 Secret Identity
1 Impractical Joke
3 Flow State
2 Multiversal Passage
1 Into the Flood Maw
3 Drake Hatcher
4 Riverpyre Verge
4 Sleight of Hand
6 Island
1 Vibrant Outburst
4 Slickshot Show-Off
4 Steam Vents
4 Spirebluff Canal
4 Opt

Sideboard
1 Ral, Crackling Wit
2 Eddymurk Crab
1 Sunspine Lynx
1 Bounce Off
2 Get Out
1 Sear
1 Roaring Furnace // Steaming Sauna
2 Spell Pierce
1 Slagstorm
1 Stock Up
1 Disdainful Stroke
1 Broadside Barrage
`;

const res = parseArenaImport(testList);
console.log(res);
