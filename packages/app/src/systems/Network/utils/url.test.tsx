import { isValidNetworkUrl } from './url';

describe('isValidNetworkUrl()', () => {
  it('should return true for valid network urls', () => {
    expect(isValidNetworkUrl('http://localhost:4000/graphql')).toBe(true);
    expect(isValidNetworkUrl('https://beta3-5-dev.swayswap.io/graphql')).toBe(
      true
    );
  });

  it('should return false for invalid network urls', () => {
    expect(isValidNetworkUrl('http://localhost:4000')).toBe(false);
    expect(isValidNetworkUrl('localhost:4000/graphql')).toBe(false);
    expect(isValidNetworkUrl('https://beta3-5-dev.swayswap.io')).toBe(false);
    expect(isValidNetworkUrl('beta3-5-devv.swayswap.io/graphql')).toBe(false);
  });
});
