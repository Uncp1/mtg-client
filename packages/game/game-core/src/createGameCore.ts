import { configureStore } from '@reduxjs/toolkit';

import boardReducer, { boardActions } from './model/board/boardSlice';
import { createInitialState } from './model/state/initialState';
import type { PlayerId } from './model/types';

export interface PlayerSeed {
  id: PlayerId;
  name: string;
}

export interface GameCoreOptions {
  players: PlayerSeed[];
}

export function createGameCore({ players }: GameCoreOptions) {
  const store = configureStore({
    reducer: {
      board: boardReducer,
    },
    preloadedState: {
      board: createInitialState(players),
    },
  });

  return {
    store,
    actions: boardActions,
    getState: store.getState,
    dispatch: store.dispatch,
    subscribe: store.subscribe,
  };
}

export type GameCore = ReturnType<typeof createGameCore>;
export type GameStore = GameCore['store'];
export type RootState = ReturnType<GameStore['getState']>;
export type AppDispatch = GameStore['dispatch'];

export default createGameCore;
