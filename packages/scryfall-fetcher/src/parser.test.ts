import { describe, it, expect } from 'vitest';

import parseArenaImport from './parser';

const decklist = `About
Name My Cool Deck

Deck
4 Llanowar Elves
9 Forest
1 Sheltered Thicket

Sideboard
2 Blossoming Defense
1 Carnage Tyrant`;

describe('parseArenaImport', () => {
  it('reads the deck name from the "Name " line', () => {
    expect(parseArenaImport(decklist).name).toBe('My Cool Deck');
  });

  it('falls back to a default name when none is given', () => {
    expect(parseArenaImport('Deck\n4 Forest').name).toBe('nameless deck');
  });

  it('splits entries into mainDeck and sideboard', () => {
    const deck = parseArenaImport(decklist);

    expect(deck.mainDeck).toEqual([
      { quantity: 4, name: 'Llanowar Elves' },
      { quantity: 9, name: 'Forest' },
      { quantity: 1, name: 'Sheltered Thicket' },
    ]);
    expect(deck.sideboard).toEqual([
      { quantity: 2, name: 'Blossoming Defense' },
      { quantity: 1, name: 'Carnage Tyrant' },
    ]);
  });

  it('parses quantity as a number and keeps multi-word names intact', () => {
    const [entry] = parseArenaImport('Deck\n4 Ghor-Clan Rampager').mainDeck;

    expect(entry).toEqual({ quantity: 4, name: 'Ghor-Clan Rampager' });
    expect(typeof entry.quantity).toBe('number');
  });

  it('ignores the "About" header and blank lines', () => {
    const deck = parseArenaImport('About\n\nName X\n\nDeck\n\n1 Plains\n');

    expect(deck.mainDeck).toEqual([{ quantity: 1, name: 'Plains' }]);
  });

  it('returns empty lists for an empty input', () => {
    expect(parseArenaImport('')).toEqual({
      name: 'nameless deck',
      mainDeck: [],
      sideboard: [],
    });
  });
});
