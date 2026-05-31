import { createSlice } from '@reduxjs/toolkit';

import { movementReducer } from './reducers/movement';
import { createInitialState } from '../state/initialState';

const boardSlice = createSlice({
  name: 'boardSlice',
  initialState: createInitialState([]),
  reducers: {
    ...movementReducer,
  },
});

export const boardActions = boardSlice.actions;
export const { moveCard } = boardSlice.actions;
export default boardSlice.reducer;
