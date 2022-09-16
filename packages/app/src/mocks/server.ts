import type { GraphQLHandler, RestHandler } from 'msw';
import { setupServer } from 'msw/node';

// This configures a request mocking server with the given request handlers.
export const mockServer = (handlers: [RestHandler | GraphQLHandler]) => {
  const server = setupServer(...handlers);
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  return server;
};
