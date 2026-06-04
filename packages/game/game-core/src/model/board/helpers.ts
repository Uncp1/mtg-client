import type { GameState, PlayerId, Zone, ZoneId, ZoneType } from '../types';

export const zoneId = (playerId: PlayerId, type: ZoneType): ZoneId =>
  `${playerId}-${type}`;

export const getZone = (
  game: GameState,
  playerId: PlayerId,
  type: ZoneType,
): Zone => game.zones[zoneId(playerId, type)];

export const getLibrary = (game: GameState, playerId: PlayerId) =>
  getZone(game, playerId, 'library');
export const getHand = (game: GameState, playerId: PlayerId) =>
  getZone(game, playerId, 'hand');

/** Source https://github.com/cprosche/mulberry32 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
