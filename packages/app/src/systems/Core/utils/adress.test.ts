import { shortAddress } from './address';

describe('shortAddress()', () => {
  it('should show a small version of a full address', () => {
    const addr = 'fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef';
    expect(shortAddress(addr)).toBe('fuel0x...74ef');
  });
});
