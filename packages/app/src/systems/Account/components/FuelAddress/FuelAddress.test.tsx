import { screen, testA11y } from '@fuel-ui/test-utils';
import { TestWrapper } from '~/systems/Core';
import { renderWithProvider } from '~/systems/Core/__tests__/utils';
import { FuelAddress } from './FuelAddress';

const accountAddressHex = '0xdafd6d127fe93b8938205bfee6cfd6833cacd95f';
const accountAddressB256 =
  '0x000000000000000000000000dafd6d127fe93b8938205bfee6cfd6833cacd95f';
const shorten = (address: string) =>
  `0x${address.slice(2, 6)}...${address.slice(-4)}`;
const accountAddressBech32 =
  'fuelsequencer1mt7k6ynlayacjwpqt0lwdn7ksv72ek2lwt95nu';

describe('FuelAddress', () => {
  it('a11y', async () => {
    await testA11y(<FuelAddress address={accountAddressHex} />, {
      wrapper: TestWrapper,
    });
  });

  it('should show b256 address from b256', () => {
    renderWithProvider(<FuelAddress address={accountAddressB256} />);
    expect(screen.getByText(shorten(accountAddressB256))).toBeInTheDocument();
  });
  it('should show b256 address from eth', () => {
    renderWithProvider(<FuelAddress address={accountAddressHex} />);
    expect(screen.getByText(shorten(accountAddressB256))).toBeInTheDocument();
  });

  it('should show b256 address from bech32', () => {
    renderWithProvider(<FuelAddress address={accountAddressBech32} />);
    expect(screen.getByText(shorten(accountAddressB256))).toBeInTheDocument();
  });
});
