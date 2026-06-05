import type { ScryfallCard } from './transform';

// Real Scryfall values, trimmed to the fields ScryfallCard models.
// `satisfies` keeps them type-checked without widening away the literal shape.

export const llanowarElves = {
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

// the Vampire token spawned by Legion's Landing (see all_parts below)
export const vampireToken = {
  id: '09293ae7-0629-417b-9eda-9bd3f6d8e118',
  name: 'Vampire',
  type_line: 'Token Creature — Vampire',
  oracle_text: 'Lifelink',
  mana_cost: '',
  colors: ['W'],
  image_uris: {
    small: 'https://cards.scryfall.io/small/front/0/9/09293ae7.jpg',
    normal: 'https://cards.scryfall.io/normal/front/0/9/09293ae7.jpg',
    large: 'https://cards.scryfall.io/large/front/0/9/09293ae7.jpg',
  },
} satisfies ScryfallCard;

// DFC *and* a token producer — exercises both transform (faces) and
// client (all_parts -> token lookup).
export const legionsLanding = {
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
  all_parts: [
    {
      component: 'token',
      id: '09293ae7-0629-417b-9eda-9bd3f6d8e118',
      name: 'Vampire',
      type_line: 'Token Creature — Vampire',
      uri: 'https://api.scryfall.com/cards/09293ae7-0629-417b-9eda-9bd3f6d8e118',
    },
    {
      // not a token — must be ignored by the token collector
      component: 'combo_piece',
      id: '05e2a5e6-3aaa-4096-bdd0-fcc1afe5a36c',
      name: "Legion's Landing // Adanto, the First Fort",
      type_line: 'Legendary Enchantment // Legendary Land',
      uri: 'https://api.scryfall.com/cards/05e2a5e6-3aaa-4096-bdd0-fcc1afe5a36c',
    },
  ],
} satisfies ScryfallCard;
