/*
We need to disable ESLINT argument mutation rule for these files,
because it clashes with the ability to mutate the state, 
that is provided by RTK 
*/
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

type ThemeStateSlice = {
  theme: 'dark' | 'light';
};

const initialState: ThemeStateSlice = {
  theme: 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state: ThemeStateSlice) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
  },
});

export const themeActions = themeSlice.actions;

export default themeSlice.reducer;

export const getCurrentTheme = (state: ThemeStateSlice) => state.theme;
