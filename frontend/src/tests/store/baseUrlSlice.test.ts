import { describe, it } from 'vitest';
import baseUrlReducer, { baseUrlSliceActions } from '../../store/baseUrlSlice';

describe('Renders landing page correctly', async () => {
  it('toggles the theme from light to dark', () => {
    expect(baseUrlReducer({ baseUrl: '' }, baseUrlSliceActions.setBaseUrl({ baseUrl: 'some-url' }))).toEqual({
      baseUrl: 'some-url',
    });
  });
});
