import { render, screen, testA11y, waitFor } from '@fuel-ui/test-utils';
import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { TestWrapper, shortAddress } from '~/systems/Core';

import { Address } from 'fuels';
import { AccountInfo } from './AccountInfo';

const PROPS = {
  account: MOCK_ACCOUNTS[0],
  headerText: 'Connect to',
};

describe('AccountInfo', () => {
  beforeEach(async () => {
    await AccountService.clearAccounts();
    await AccountService.addAccount({
      data: MOCK_ACCOUNTS[0],
    });
  });

  it('a11y', async () => {
    await testA11y(<AccountInfo {...PROPS} />, { wrapper: TestWrapper });
  });

  it('should show some part of the address', async () => {
    render(<AccountInfo {...PROPS} />);
    expect(
      screen.getByText(
        shortAddress(
          Address.fromDynamicInput(MOCK_ACCOUNTS[0].address).toB256()
        )
      )
    ).toBeInTheDocument();
  });

  it('should show account information', async () => {
    render(<AccountInfo {...PROPS} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Account 1')).toBeInTheDocument();
    });
  });
});
