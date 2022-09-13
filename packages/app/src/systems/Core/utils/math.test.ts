import { bn } from 'fuels';

import { amountToUnits, formatUnits, unitsToAmount } from './math';

describe('Math', () => {
  describe('unitsToAmount()', () => {
    it('should parse units to amount using string', () => {
      expect(unitsToAmount('1.5')).toBe(1500000000);
      expect(unitsToAmount('1')).toBe(1000000000);
    });
    it('should parse units to amount using number', () => {
      expect(unitsToAmount(1.5)).toBe(1500000000);
      expect(unitsToAmount(1)).toBe(1000000000);
    });
    it('should parse units to amount using BigNumberish', () => {
      expect(unitsToAmount(bn(1))).toBe(1000000000);
    });
    it('should safe parse falsy values', () => {
      expect(unitsToAmount(undefined)).toBe(0);
    });
  });

  describe('amountToUnits()', () => {
    it('should parse amount to units using string', () => {
      expect(amountToUnits('1500000000')).toBe(1.5);
      expect(amountToUnits('1000000000')).toBe(1);
    });
    it('should parse amount to units using number', () => {
      expect(amountToUnits(1500000000)).toBe(1.5);
      expect(amountToUnits(1000000000)).toBe(1);
    });
    it('should parse amount to units using BigNumberish', () => {
      expect(amountToUnits(1500000000n)).toBe(1.5);
      expect(amountToUnits(1000000000n)).toBe(1);
    });
    it('should safe parse falsy values', () => {
      expect(amountToUnits(undefined)).toBe(0);
    });
  });

  describe('formatUnits()', () => {
    it('should format units to string using string', () => {
      expect(formatUnits('1500000000')).toBe('1,5');
    });
    it('should format units to string using number', () => {
      expect(formatUnits(1500000000)).toBe('1,5');
    });
    it('should format units to string using BigNumberish', () => {
      expect(formatUnits(1500000000n)).toBe('1,5');
    });
    it('should be able to set minimum and max fraction digits', () => {
      const opts = { minDigits: 4, maxDigits: 4 };
      expect(formatUnits(1512345678n, opts)).toBe('1,5123');
    });
    it('should be round digits when necessary', () => {
      const opts = { minDigits: 3 };
      expect(formatUnits(1512500000n, opts)).toBe('1,513');
    });
  });
});
