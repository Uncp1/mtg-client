import type { PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';

import type { GameState, PlayerId } from '../../types';
import { getHand, getLibrary, mulberry32 } from '../helpers';

export const libraryReducer = {
  drawCards(
    game: GameState,
    action: PayloadAction<{ playerId: PlayerId; numberOfCards: number }>,
  ) {
    const { playerId, numberOfCards } = action.payload;

    const library = getLibrary(game, playerId);
    const hand = getHand(game, playerId);

    //todo add a flag. or not, because lab maniac exists
    //if (library.cardsId.length < numberOfCards) console.log('game over man!');

    const cardsDrawn = library.cardsId.splice(0, numberOfCards);

    for (const cardId of cardsDrawn) {
      hand.cardsId.push(cardId);
      game.cards[cardId].zoneId = hand.id;
    }
  },
  shuffle(
    game: GameState,
    action: PayloadAction<{ playerId: PlayerId; seed: number }>,
  ) {
    const { playerId, seed } = action.payload;

    const library = getLibrary(game, playerId);

    const rng = mulberry32(seed);
    const ids = library.cardsId;

    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
  },
} satisfies SliceCaseReducers<GameState>;
