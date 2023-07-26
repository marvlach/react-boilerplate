import { describe, it } from 'vitest';
import languageReducer, { languageActions } from '../../store/languageSlice';

describe('Renders landing page correctly', async () => {
  it('toggles the theme from light to dark', () => {
    expect(languageReducer({ language: 'gr' }, languageActions.toggleLanguage())).toEqual({ language: 'en' });
  });

  it('toggles the theme from dark to light', () => {
    expect(languageReducer({ language: 'en' }, languageActions.toggleLanguage())).toEqual({ language: 'gr' });
  });
});
