import { screen } from '@fuel-ui/test-utils';

import { DECIMAL_FUEL, bn } from 'fuels';
import { convertToUsd } from './convertToUsd';

const MOCK_ETH_RATE = 2742.15;
describe('Convert to USD', () => {
  it('should render 0 with no decimals', () => {
    const { formatted } = convertToUsd(bn(0), DECIMAL_FUEL, MOCK_ETH_RATE);
    expect(formatted).toBe('$0');
  });

  it('should render only first valid number after 2 leading zeroes when < 1.00', () => {
    const { formatted } = convertToUsd(bn(1265), DECIMAL_FUEL, MOCK_ETH_RATE);
    expect(formatted).toBe('$0.003');
  });

  it('should always render 2 decimal places for numbers >= 1.00', () => {
    const { formatted } = convertToUsd(
      bn(3648500),
      DECIMAL_FUEL,
      MOCK_ETH_RATE
    );
    expect(formatted).toBe('$10.00');
  });
});
