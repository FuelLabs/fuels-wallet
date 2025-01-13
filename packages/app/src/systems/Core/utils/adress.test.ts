import type { B256Address } from 'fuels';
import { shortAddress } from './address';

describe('shortAddress()', () => {
  it('should show a small version of a full address', () => {
    const addr: B256Address =
      '0xef3b7b4c5adcb9c7f76f8d77f422f4a25eb404b2f26c21e346fd4e2e12826798';
    expect(shortAddress(addr)).toBe('0xef3b...6798');
  });
});
