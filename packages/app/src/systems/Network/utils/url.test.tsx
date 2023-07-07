import { isValidNetworkUrl } from './url';

describe('isValidNetworkUrl()', () => {
  it('should return true for valid network urls', () => {
    expect(isValidNetworkUrl('http://localhost:4000/graphql')).toBe(true);
    expect(isValidNetworkUrl('https://beta-3.fuel.network/graphql')).toBe(true);
  });

  it('should return false for invalid network urls', () => {
    expect(isValidNetworkUrl('http://localhost:4000')).toBe(false);
    expect(isValidNetworkUrl('localhost:4000/graphql')).toBe(false);
    expect(isValidNetworkUrl('https://beta-3.fuel.network')).toBe(false);
    expect(isValidNetworkUrl('beta-3.fuel.network/graphql')).toBe(false);
  });
});
