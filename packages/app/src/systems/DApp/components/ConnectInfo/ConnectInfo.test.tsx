import { render, screen, testA11y, waitFor } from '@fuel-ui/test-utils';

import { ConnectInfo } from './ConnectInfo';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { TestWrapper } from '~/systems/Core';

const URL = 'fuellabs.github.io/swayswap/';

const PROPS = {
  origin: URL,
  account: MOCK_ACCOUNTS[0],
};

describe('ConnectInfo', () => {
  beforeEach(async () => {
    await AccountService.clearAccounts();
    await AccountService.addAccount({
      data: MOCK_ACCOUNTS[0],
    });
  });

  it('a11y', async () => {
    await testA11y(<ConnectInfo {...PROPS} />, { wrapper: TestWrapper });
  });

  it('should show some part of the url', async () => {
    render(<ConnectInfo {...PROPS} />);
    expect(screen.getByText(/fuellabs/)).toBeInTheDocument();
  });

  it('should show account information', async () => {
    render(<ConnectInfo {...PROPS} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Account 1')).toBeInTheDocument();
    });
  });
});
