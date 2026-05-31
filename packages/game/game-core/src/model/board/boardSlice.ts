import { createSlice } from '@reduxjs/toolkit';

import { createInitialState } from '../state/initialState';
import { movementReducer } from './reducers/movement';
import { cardsReducer } from './reducers/card';

const boardSlice = createSlice({
  name: 'boardSlice',
  initialState: createInitialState([]),
  reducers: {
    ...movementReducer,
    ...cardsReducer,
  },
});

export const boardActions = boardSlice.actions;
export const { moveCard, addCards } = boardSlice.actions;
export default boardSlice.reducer;
