import { describe, it } from 'vitest';
import themeReducer, { themeActions } from '../../store/themeSlice';

describe('Renders landing page correctly', async () => {
  it('toggles the theme from light to dark', () => {
    expect(themeReducer({ theme: 'light' }, themeActions.toggleTheme())).toEqual({ theme: 'dark' });
  });

  it('toggles the theme from dark to light', () => {
    expect(themeReducer({ theme: 'dark' }, themeActions.toggleTheme())).toEqual({ theme: 'light' });
  });
});
