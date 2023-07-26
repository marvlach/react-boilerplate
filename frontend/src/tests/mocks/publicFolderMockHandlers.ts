import { rest } from 'msw';

const handlers = [
  rest.get('http://localhost:2233/backendUrl', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        FAST_API_BACKEND_URL: 'http://localhost:2233/api/v1',
      })
    );
  }),
];
export default handlers;
