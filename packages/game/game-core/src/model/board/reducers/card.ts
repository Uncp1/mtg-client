import type { PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';

import type { CardData, CardInstance, GameState } from '../../types';

export const cardsReducer = {
  addCards(
    game: GameState,
    action: PayloadAction<{ cardDefs: CardData[]; cards: CardInstance[] }>,
  ) {
    for (const def of action.payload.cardDefs) {
      game.cardDefs[def.id] = def;
    }
    for (const card of action.payload.cards) {
      game.cards[card.instanceId] = card;
      game.zones[card.zoneId].cardsId.push(card.instanceId);
    }
  },
} satisfies SliceCaseReducers<GameState>;
