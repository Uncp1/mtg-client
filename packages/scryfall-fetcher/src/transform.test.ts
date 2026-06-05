import { describe, it, expect } from 'vitest';

import { transform, type ScryfallCard } from './transform';

/** real Scryfall values, trimmed to the fields ScryfallCard.
 * `satisfies` keeps them type-checked without widening away the literal shape. */

const llanowarElves = {
  id: '6a0b230b-d391-4998-a3f7-7b158a0ec2cd',
  name: 'Llanowar Elves',
  type_line: 'Creature — Elf Druid',
  oracle_text: '{T}: Add {G}.',
  mana_cost: '{G}',
  colors: ['G'],
  power: '1',
  toughness: '1',
  image_uris: {
    small: 'https://cards.scryfall.io/small/front/6/a/6a0b230b.jpg',
    normal: 'https://cards.scryfall.io/normal/front/6/a/6a0b230b.jpg',
    large: 'https://cards.scryfall.io/large/front/6/a/6a0b230b.jpg',
  },
} satisfies ScryfallCard;

const legionsLanding = {
  id: '05e2a5e6-3aaa-4096-bdd0-fcc1afe5a36c',
  name: "Legion's Landing // Adanto, the First Fort",
  type_line: 'Legendary Enchantment // Legendary Land',
  card_faces: [
    {
      name: "Legion's Landing",
      type_line: 'Legendary Enchantment',
      oracle_text:
        "When Legion's Landing enters, create a 1/1 white Vampire creature token with lifelink.",
      mana_cost: '{W}',
      colors: ['W'],
      image_uris: {
        small: 'https://cards.scryfall.io/small/front/0/5/05e2a5e6.jpg',
        normal: 'https://cards.scryfall.io/normal/front/0/5/05e2a5e6.jpg',
        large: 'https://cards.scryfall.io/large/front/0/5/05e2a5e6.jpg',
      },
    },
    {
      name: 'Adanto, the First Fort',
      type_line: 'Legendary Land',
      oracle_text: '{T}: Add {W}.',
      mana_cost: '',
      colors: [],
      image_uris: {
        small: 'https://cards.scryfall.io/small/back/0/5/05e2a5e6.jpg',
        normal: 'https://cards.scryfall.io/normal/back/0/5/05e2a5e6.jpg',
        large: 'https://cards.scryfall.io/large/back/0/5/05e2a5e6.jpg',
      },
    },
  ],
} satisfies ScryfallCard;

describe('transform', () => {
  it('maps a single-faced card to flat CardData', () => {
    expect(transform(llanowarElves)).toEqual({
      isDFC: false,
      id: '6a0b230b-d391-4998-a3f7-7b158a0ec2cd',
      name: 'Llanowar Elves',
      imageURLS: llanowarElves.image_uris,
      oracleText: '{T}: Add {G}.',
      typeLine: 'Creature — Elf Druid',
      power: '1',
      toughness: '1',
      manaCost: '{G}',
      colors: ['G'],
    });
  });

  it('flags double-faced cards and pulls primary fields from the front face', () => {
    const result = transform(legionsLanding);

    expect(result.isDFC).toBe(true);
    expect(result.id).toBe('05e2a5e6-3aaa-4096-bdd0-fcc1afe5a36c');
    expect(result.name).toBe("Legion's Landing");
    expect(result.typeLine).toBe('Legendary Enchantment');
    expect(result.manaCost).toBe('{W}');
    expect(result.imageURLS).toEqual(legionsLanding.card_faces[0].image_uris);
  });

  it('pulls the back* fields from the second face', () => {
    const result = transform(legionsLanding);
    if (!result.isDFC) throw new Error('expected a DFC result');

    expect(result.backName).toBe('Adanto, the First Fort');
    expect(result.backTypeLine).toBe('Legendary Land');
    expect(result.backManaCost).toBe('');
    expect(result.backColors).toEqual([]);
    expect(result.backImageURLS).toEqual(
      legionsLanding.card_faces[1].image_uris,
    );
  });

  it('uses the top-level card id, not the combined "//" name, as the id', () => {
    expect(transform(legionsLanding).id).not.toContain('//');
  });
});
