import { createSlice } from '@reduxjs/toolkit';

import { createInitialState } from '../state/initialState';
import { movementReducer } from './reducers/movement';
import { cardsReducer } from './reducers/card';
import { libraryReducer } from './reducers/library';

const boardSlice = createSlice({
  name: 'boardSlice',
  initialState: createInitialState([]),
  reducers: {
    ...movementReducer,
    ...cardsReducer,
    ...libraryReducer,
  },
});

export const boardActions = boardSlice.actions;
export const { moveCard, addCards, shuffle, drawCards } = boardSlice.actions;
export default boardSlice.reducer;
