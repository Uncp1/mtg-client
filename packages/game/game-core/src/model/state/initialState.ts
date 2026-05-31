import type { GameState, PlayerId, PlayerState, Zone, ZoneType, ZoneId } from '../types';

//todo move to helpers
const zoneId = (playerId: PlayerId, type: ZoneType): ZoneId => `${playerId}-${type}`;

//todo refactor and move later
export const ZONE_TYPES = [
  'battlefield',
  'hand',
  'library',
  'graveyard',
  'exile',
  'command',
  'stack',
  'tokenStore',
] as const satisfies readonly ZoneType[];

function buildPlayer(seed: { id: PlayerId; name: string }): { player: PlayerState; zones: Zone[] } {
  const zones: Zone[] = ZONE_TYPES.map((type) => ({
    id: zoneId(seed.id, type),
    type,
    ownerId: seed.id,
    cardsId: [],
  }));

  //todo remove hardcoded life points
  const player: PlayerState = { id: seed.id, name: seed.name, life: 20 };
  return { player, zones };
}

export function createInitialState(seeds: { id: PlayerId; name: string }[]): GameState {
  const players: GameState['players'] = {};
  const zones: GameState['zones'] = {};

  for (const seed of seeds) {
    const { player, zones: playerZones } = buildPlayer(seed);
    players[player.id] = player;
    for (const zone of playerZones) zones[zone.id] = zone;
  }

  return {
    players,
    zones,
    cards: {},
    cardDefs: {},
    turn: { activePlayerId: seeds[0]?.id ?? '', phase: 'untap', number: 1 },
  };
}
