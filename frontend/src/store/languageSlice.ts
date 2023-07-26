/*
We need to disable ESLINT argument mutation rule for these files,
because it clashes with the ability to mutate the state, 
that is provided by RTK 
*/
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

type LanguageStateSlice = {
  language: 'gr' | 'en';
};

const initialState: LanguageStateSlice = {
  language: 'gr',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    toggleLanguage(state: LanguageStateSlice) {
      state.language = state.language === 'gr' ? 'en' : 'gr';
    },
  },
});

export const languageActions = languageSlice.actions;

export default languageSlice.reducer;

export const getCurrentLanguage = (state: LanguageStateSlice) => state.language;
