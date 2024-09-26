import { route } from './route';

describe('route()', () => {
  it('should parse a route based on params', () => {
    const routePath = '/user/:id';
    const user = route<'id'>(routePath);
    // Should return complete path regardless of params on the first run
    expect(`${user({ id: 1 })}`).toBe(routePath);

    expect(`${user({ id: 1 })}`).toBe('/user/1');
  });

  it('should parse optional params when not provided', () => {
    const routePath = '/asset/:assetId?';
    const asset = route<'assetId'>(routePath);
    // Should return complete path regardless of params on the first run
    expect(`${asset()}`).toBe(routePath);

    // Should return complete path regardless of params on the first run
    expect(`${asset()}`).toBe('/asset/');
  });
  it('should parse optional params when provided', () => {
    const routePath = '/asset/:assetId?';
    const asset = route<'assetId'>(routePath);
    // Should return complete path regardless of params on the first run
    expect(`${asset({ assetId: '1' })}`).toBe(routePath);

    expect(`${asset({ assetId: '1' })}`).toBe('/asset/1');
  });
  it('should throw when required param is not provided', () => {
    const routePath = '/asset/:assetId';
    const asset = route<'assetId'>(routePath);
    // Should return complete path regardless of params on the first run
    expect(`${asset({ assetId: 'x' })}`).toBe(routePath);

    expect(() => asset()).toThrow();
  });
});
