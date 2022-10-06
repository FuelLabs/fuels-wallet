import { render, screen, testA11y, waitFor } from '@fuel-ui/test-utils';

import { ConnectInfo } from './ConnectInfo';

import { AccountService } from '~/systems/Account';
import { TestWrapper } from '~/systems/Core';

const URL = 'https://fuellabs.github.io/swayswap/';
const ACCOUNT = {
  name: 'Account 1',
  address: 'fuel1yal7nrhm4lpwuzjn8eq3qjlsk9366dwpsrpd5ns5q049g30kyp7qcey6wk',
  publicKey: '0x00',
};

const PROPS = {
  url: URL,
  account: ACCOUNT,
};

describe('ConnectInfo', () => {
  beforeEach(async () => {
    await AccountService.clearAccounts();
    await AccountService.addAccount({
      data: {
        name: 'Account 1',
        address:
          'fuel1yal7nrhm4lpwuzjn8eq3qjlsk9366dwpsrpd5ns5q049g30kyp7qcey6wk',
        publicKey: '0x00',
      },
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
