export type PlayerId = string;
export type InstanceId = string;
export type ZoneID = string;

export type ZoneType =
  | 'battlefield'
  | 'hand'
  | 'library'
  | 'graveyard'
  | 'exile'
  | 'command'
  | 'stack'
  | 'tokenStore' // ненастоящая зона, но будем хранить там токены
  | 'phased'; // тоже не зона, но пусть будет для удобства

export interface cardData {
  /** Scryfall id */
  id: string;
  name: string;
  imageURL: string;
  oracleText: string;
  typeLine: string;
  manaCost?: string;
  /** dfc only */
  backName?: string;
  backImageURL?: string;
  backOracleText?: string;
}

export interface cardInstance {
  instanceId: InstanceId;
}
