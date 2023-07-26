import { afterAll, afterEach, beforeAll } from 'vitest';
import mockServer from './mocks/mockServer';

// https://github.com/vitest-dev/vitest/issues/821#issuecomment-1046954558
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

beforeAll(() => {
  mockServer.listen({ onUnhandledRequest: 'error' });
  // keep them commented and use them for debugging
  /* mockServer.events.on('request:start', (req) => {
    console.log('Request', req);
  });
  mockServer.events.on('response:mocked', (res) => {
    console.log('Response', res);
  }); */
});
afterAll(() => mockServer.close());
afterEach(() => mockServer.resetHandlers());
