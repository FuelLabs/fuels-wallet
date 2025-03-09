import { DECIMAL_FUEL, DECIMAL_WEI, bn } from 'fuels';
import { convertToUsd } from './convertToUsd';

const MOCK_ETH_RATE = 2742.15;
const MOCK_FUEL_RATE = 0.01167;
const MOCK_SCIENTIFIC_RATE = 1e-7;
const MOCK_REALLY_LOW_RATE = 0.0000007427;

describe('Convert to USD', () => {
  it('should render 0 with no decimals', () => {
    const { formatted, value } = convertToUsd(
      bn(0),
      DECIMAL_FUEL,
      MOCK_ETH_RATE
    );
    expect(formatted).toBe('$0');
    expect(value).toBe(0);
  });

  it('should render only first valid number after 2 leading zeroes when < 1.00', () => {
    const { formatted, value } = convertToUsd(
      bn(1265),
      DECIMAL_FUEL,
      MOCK_ETH_RATE
    );
    expect(formatted).toBe('$0.003');
    expect(value).toBe(0.003);
  });

  it('should always render 2 decimal places for numbers >= 1.00', () => {
    const { formatted, value } = convertToUsd(
      bn(3648500),
      DECIMAL_FUEL,
      MOCK_ETH_RATE
    );
    expect(formatted).toBe('$10.00');
    expect(value).toBe(10);
  });

  it('should not lose precision when dealing with really small amounts', () => {
    const { formatted, value } = convertToUsd(
      bn(1),
      DECIMAL_FUEL,
      MOCK_ETH_RATE
    );
    expect(formatted).toBe('$0.000002');
    expect(value).toBe(0.000002);
  });

  it('should be able to handle really large amounts', () => {
    const { formatted, value } = convertToUsd(
      bn(Number.MAX_SAFE_INTEGER),
      DECIMAL_FUEL,
      MOCK_ETH_RATE
    );
    expect(formatted).toBe('$24,699,091,436.38');
    expect(value).toBe(24699091436.38);
  });

  it('should be able to handle large amounts with high precision and regular rate', () => {
    const { formatted, value } = convertToUsd(
      bn('123456789999999999900000000000000001'),
      DECIMAL_WEI,
      MOCK_ETH_RATE
    );
    expect(formatted).toBe('$338,537,036,698,499,999,725.78');
    expect(value).toBe(338537036698500000000);
  });

  it('should be able to handle large amounts with high precision decimal and low rate', () => {
    const { formatted, value } = convertToUsd(
      bn('123456789999999999900000000000000001'),
      DECIMAL_WEI,
      MOCK_REALLY_LOW_RATE
    );
    expect(formatted).toBe('$91,691,357,932.99');
    expect(value).toBe(91691357932.99);
  });

  it('should be able to handle scientific notation', () => {
    const { formatted, value } = convertToUsd(
      bn('10000000'),
      DECIMAL_WEI,
      MOCK_SCIENTIFIC_RATE
    );
    expect(formatted).toBe('$0.000000000000000001');
    expect(value).toBe(1e-18);
  });

  it('should be able to handle lower rates', () => {
    const { formatted, value } = convertToUsd(
      bn(100_000_000_000),
      DECIMAL_FUEL,
      MOCK_FUEL_RATE
    );
    expect(formatted).toBe('$1.16');
    expect(value).toBe(1.16);
  });

  it('should be able to handle asset with less decimals than the rate', () => {
    const { formatted, value } = convertToUsd(bn(100_00), 2, MOCK_FUEL_RATE);
    expect(formatted).toBe('$1.16');
    expect(value).toBe(1.16);
  });

  it('should be able to handle crazy low rates', () => {
    const { formatted, value } = convertToUsd(
      bn(100_000_000_000),
      DECIMAL_FUEL,
      MOCK_REALLY_LOW_RATE
    );
    expect(formatted).toBe('$0.00007');
    expect(value).toBe(0.00007);
  });
});
