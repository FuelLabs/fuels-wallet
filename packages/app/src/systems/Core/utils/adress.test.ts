import { shortAddress } from './address';

describe('shortAddress()', () => {
  it('should show a small version of a full address', () => {
    const addr = 'fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef';
    expect(shortAddress(addr)).toBe('fuel0x...74ef');
  });

  it('should show a small version of a full address with custom length', () => {
    const addr =
      '0xf2Bc792F42A19fC64646787626E4451576b95d123cc525C1583e0462c9a62a23';
    expect(shortAddress(addr, { left: 10, right: 30 })).toBe(
      '0xf2Bc792F...b95d123cc525C1583e0462c9a62a23'
    );
  });
});
