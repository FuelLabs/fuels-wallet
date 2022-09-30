import { route } from './route';

describe('route()', () => {
  it('should parse a route based on params', () => {
    const user = route<'id'>('/user/:id');
    expect(`${user({ id: 1 })}`).toBe('/user/1');
  });

  it('should parse a query string', () => {
    const user = route<'id'>('/user/:id');
    expect(`${user({ id: 1 }, { page: 1 })}`).toBe('/user/1?page=1');
  });
});
