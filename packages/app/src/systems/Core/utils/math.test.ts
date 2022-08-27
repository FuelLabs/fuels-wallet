import { formatUnits, parseUnits } from './math';

describe('Math', () => {
  describe('parseUnits()', () => {
    it('should parse a units to amount', () => {
      expect(parseUnits(1.5, 18)).toBe(1500000000000000000n);
      expect(parseUnits(1, 18)).toBe(1000000000000000000n);
    });
  });
  describe('formatUnits()', () => {
    it('should parse a amount to units', () => {
      expect(formatUnits(1500000000000000000n, 18)).toBe(1.5);
      expect(formatUnits(1000000000000000000n, 18)).toBe(1);
    });
  });
});
