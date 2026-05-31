import type { PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';

import type { GameState, InstanceId, ZoneId } from '../../types';

export const movementReducer = {
  moveCard(game: GameState, action: PayloadAction<{ instanceId: InstanceId; zoneId: ZoneId }>) {
    const card = game.cards[action.payload.instanceId];

    card.zoneId = action.payload.zoneId;
  },
} satisfies SliceCaseReducers<GameState>;
