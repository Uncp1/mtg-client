import type { PlayerId, ZoneId, ZoneType } from '../types';

export const zoneId = (playerId: PlayerId, type: ZoneType): ZoneId => `${playerId}-${type}`;
