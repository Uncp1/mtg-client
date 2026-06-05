export type PlayerId = string;
export type InstanceId = string;
export type ZoneId = string;

export type ZoneType =
  | 'battlefield'
  | 'hand'
  | 'library'
  | 'graveyard'
  | 'exile'
  | 'command'
  | 'stack'
  | 'tokenStore' // ненастоящая зона, но будем хранить там токены
  | 'sideboard';

export type Phase = 'untap' | 'upkeep' | 'draw' | 'main1' | 'combat' | 'main2' | 'end' | 'cleanup';

export interface CardImageURLS {
  small: string;
  normal: string;
  large: string;
}

interface BaseCardData {
  /** Scryfall id */
  id: string;
  name: string;
  imageURLS: CardImageURLS;
  oracleText: string;
  typeLine: string;
  power?: string;
  toughness?: string;
  manaCost?: string;
  colors?: string[];
}

export type CardData =
  | (BaseCardData & {
      isDFC: false;
    })
  | (BaseCardData & {
      isDFC: true;
      backName: string;
      backImageURLS: CardImageURLS;
      backOracleText: string;
      backTypeLine: string;
      backPower?: string;
      backToughness?: string;
      backManaCost?: string;
      backColors?: string[];
    });

export interface CardInstance {
  instanceId: InstanceId;
  definitionId: CardData['id'];
  ownerId: PlayerId;
  controllerId: PlayerId;
  zoneId: ZoneId;

  /** battlefield only */
  x?: number;
  y?: number;
  tapped?: boolean;
  faceDown?: boolean;
  phasedOut?: boolean;
  counters?: Record<string, number>;
  attachedTo?: InstanceId;

  revealedTo?: PlayerId[] | 'all';
}

export interface Zone {
  id: ZoneId;
  type: ZoneType;
  ownerId: PlayerId;
  cardsId: InstanceId[];
}

export interface PlayerState {
  id: PlayerId;
  name: string;
  life: number;
  counters?: Record<string, number>;
}

export interface GameState {
  players: Record<PlayerId, PlayerState>;
  zones: Record<ZoneId, Zone>;
  /** все экземпляры карт по instanceId */
  cards: Record<InstanceId, CardInstance>;
  /** словарь всех карт в игре по Scryfall id (CardData.id) */
  cardDefs: Record<CardData['id'], CardData>;
  turn: { activePlayerId: PlayerId; phase: Phase; number: number };
}
