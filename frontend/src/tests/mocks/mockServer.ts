import { setupServer } from 'msw/node';
import userMockHandlers from './api/userMockHandlers';
import publicFolderMockHandlers from './publicFolderMockHandlers';
// for more info https://github.com/vitest-dev/vitest/blob/main/examples/react-testing-lib-msw/src/setup.ts
// This configures a Service Worker with the given request handlers.
const server = setupServer(...userMockHandlers, ...publicFolderMockHandlers);
export default server;
