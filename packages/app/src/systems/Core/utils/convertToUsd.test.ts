import { DECIMAL_FUEL, bn } from 'fuels';
import { convertToUsd } from './convertToUsd';

const MOCK_ETH_RATE = 2742.15;
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
});
