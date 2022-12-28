/* eslint-disable @typescript-eslint/no-explicit-any */

import { fireEvent, render, screen, waitFor } from '@fuel-ui/test-utils';
import type { Account } from '@fuel-wallet/types';
import { Address, Wallet } from 'fuels';

import { sendLoader } from '../../__mocks__/send';
import { findAssetSelect, selectEthereumAsAsset } from '../../__tests__/utils';

import { Select, Confirm } from './Send.stories';

import { shortAddress, storyToComponent, TestWrapper } from '~/systems/Core';

describe('Send', () => {
  let loaded: any;
  let acc: Account | undefined;
  const wallet = Wallet.generate();
  const loader = sendLoader(wallet);

  beforeEach(async () => {
    loaded = await loader();
    acc = loaded.acc1;
  });

  describe('Send.Select()', () => {
    it('should have all inputs rendered by default', async () => {
      render(<Select />, { wrapper: TestWrapper });
      expect(await findAssetSelect()).toBeInTheDocument();
      expect(await screen.findByLabelText('Address Input')).toBeInTheDocument();
      expect(await screen.findByLabelText('amount')).toBeInTheDocument();
    });

    it('should select one asset', async () => {
      const opts = render(<Select />, { wrapper: TestWrapper });
      await selectEthereumAsAsset(opts);
    });

    it('should validate address', async () => {
      render(<Select />, { wrapper: TestWrapper });
      await waitFor(() => findAssetSelect());

      const input = await screen.findByLabelText('Address Input');
      fireEvent.input(input, { target: { value: 'wrong address' } });
      expect(
        await screen.findByText('Invalid bech32 address')
      ).toBeInTheDocument();
    });

    it('should show transaction details by default', async () => {
      render(<Select />, { wrapper: TestWrapper });
      await waitFor(() => findAssetSelect());
      expect(await screen.findByText('Fee (network)')).toBeInTheDocument();
    });
  });

  describe('Send.Confirm()', () => {
    it('should show TxFromTo component', async () => {
      const Content = await storyToComponent(Confirm, {}, loaded);
      render(<Content />, { wrapper: TestWrapper });
      await waitFor(() => screen.findByText('Ethereum'));

      const addr1B256 = Address.fromPublicKey(acc!.publicKey).toB256();
      const addr1 = shortAddress(addr1B256);
      const addr2 = shortAddress(wallet.address.toB256());

      expect(await screen.findByText(addr1)).toBeInTheDocument();
      expect(await screen.findByText(addr2)).toBeInTheDocument();
    });
  });
});
