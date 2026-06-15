import type { PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';

import type { GameState, InstanceId, ZoneId } from '../../types';

export const movementReducer = {
  moveCard(
    game: GameState,
    action: PayloadAction<{
      instanceId: InstanceId;
      zoneId: ZoneId;
      /** battlefield only*/
      x?: number;
      y?: number;
      /** hand reorder(mb other zones too), default to the end  */
      index?: number;
    }>,
  ) {
    const { instanceId, zoneId, x, y, index } = action.payload;

    const card = game.cards[instanceId];
    const from = game.zones[card.zoneId];
    const to = game.zones[zoneId];

    //todo токены не должны оказываться в большинстве зон, потом пофиксим
    const i = from.cardsId.indexOf(instanceId);
    if (i !== -1) from.cardsId.splice(i, 1);

    const at = index ?? to.cardsId.length;
    to.cardsId.splice(at, 0, instanceId);

    card.zoneId = zoneId;

    if (to.type === 'battlefield') {
      if (x !== undefined) card.x = x;
      if (y !== undefined) card.y = y;
    } else {
      card.x = undefined;
      card.y = undefined;
    }
  },
} satisfies SliceCaseReducers<GameState>;
