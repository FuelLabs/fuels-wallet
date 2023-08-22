import { render, screen, testA11y, waitFor } from '@fuel-ui/test-utils';

import { byPassDataSpaceError } from '../../__tests__/utils/error';

import { ConnectInfo } from './ConnectInfo';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { TestWrapper } from '~/systems/Core';

const URL = 'fuellabs.github.io/swayswap/';

const PROPS = {
  origin: URL,
  account: MOCK_ACCOUNTS[0],
  headerText: 'Connect to',
  title: 'SwaySwap',
  favIconUrl: 'https://fuellabs.github.io/swayswap/favicon.ico',
};

describe('ConnectInfo', () => {
  byPassDataSpaceError();
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
    await render(<ConnectInfo {...PROPS} />);
    expect(screen.getByText(/fuellabs/)).toBeInTheDocument();
  });

  it('should show the tile ', async () => {
    await render(<ConnectInfo {...PROPS} />);
    await waitFor(() => {
      expect(screen.getByText(/SwaySwap/)).toBeInTheDocument();
    });
  });
});
