import type { CardData, CardImageURLS } from '@mtg/game-core';

export interface ScryfallRelatedCard {
  component: 'token' | 'meld_part' | 'meld_result' | 'combo_piece';
  id: string;
  name: string;
  type_line: string;
  uri: string;
}

interface ScryfallCardFace {
  name: string;
  type_line: string;
  oracle_text: string;
  mana_cost: string;
  colors: string[];
  power?: string;
  toughness?: string;
  image_uris: CardImageURLS;
}

interface ScryfallCardBase {
  id: string;
  name: string;
  type_line: string;
  all_parts?: ScryfallRelatedCard[];
}

interface ScryfallSingleCard extends ScryfallCardBase {
  oracle_text: string;
  mana_cost: string;
  colors: string[];
  power?: string;
  toughness?: string;
  image_uris: CardImageURLS;
  card_faces?: undefined;
}

interface ScryfallDfcCard extends ScryfallCardBase {
  image_uris?: undefined;
  card_faces: ScryfallCardFace[];
}

export type ScryfallCard = ScryfallSingleCard | ScryfallDfcCard;

export function transform(card: ScryfallCard): CardData {
  /** DFC: сужаем по наличию на верхнем уровне image_uris */
  if (!card.image_uris) {
    const [front, back] = card.card_faces;

    return {
      isDFC: true,
      id: card.id,
      name: front.name,
      imageURLS: front.image_uris,
      oracleText: front.oracle_text,
      typeLine: front.type_line,
      power: front.power,
      toughness: front.toughness,
      manaCost: front.mana_cost,
      colors: front.colors,
      backName: back.name,
      backImageURLS: back.image_uris,
      backOracleText: back.oracle_text,
      backTypeLine: back.type_line,
      backPower: back.power,
      backToughness: back.toughness,
      backManaCost: back.mana_cost,
      backColors: back.colors,
    };
  }

  return {
    isDFC: false,
    id: card.id,
    name: card.name,
    imageURLS: card.image_uris,
    oracleText: card.oracle_text,
    typeLine: card.type_line,
    power: card.power,
    toughness: card.toughness,
    manaCost: card.mana_cost,
    colors: card.colors,
  };
}
