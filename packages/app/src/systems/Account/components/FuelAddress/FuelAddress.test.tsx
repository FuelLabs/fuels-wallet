import { screen, testA11y } from '@fuel-ui/test-utils';
import { TestWrapper } from '~/systems/Core';
import { renderWithProvider } from '~/systems/Core/__tests__/utils';
import { FuelAddress } from './FuelAddress';

const accountAddressB256 =
  '0x2230bd556418ddc58b48065208b3958a8db247f11394023e17ff143db7235c6c';
const accountAddressBech32 =
  'fuel1ygct64tyrrwutz6gqefq3vu432xmy3l3zw2qy0shlu2rmdert3kqx97pfj';

describe('FuelAddress', () => {
  it('a11y', async () => {
    await testA11y(<FuelAddress address={accountAddressB256} />, {
      wrapper: TestWrapper,
    });
  });

  it('should show b256 address from b256', () => {
    renderWithProvider(<FuelAddress address={accountAddressB256} />);
    expect(screen.getByText('0x2230...5C6C')).toBeInTheDocument();
  });

  it('should show b256 address from bech32', () => {
    renderWithProvider(<FuelAddress address={accountAddressBech32} />);
    expect(screen.getByText('0x2230...5C6C')).toBeInTheDocument();
  });
});
