import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ACCOUNTS } from '../../__mocks__';
import { useAccounts } from '../../hooks';

import { AccountList } from './AccountList';

describe('AccountList', () => {
  const { handlers } = useAccounts();

  it('a11y', async () => {
    await testA11y(
      <AccountList accounts={MOCK_ACCOUNTS} onPress={handlers.selectAccount} />
    );
  });

  it('should render two accounts', () => {
    render(
      <AccountList accounts={MOCK_ACCOUNTS} onPress={handlers.selectAccount} />
    );
    expect(screen.getByText('Account 1')).toBeInTheDocument();
    expect(screen.getByText('Account 2')).toBeInTheDocument();
    expect(() => screen.getByText('Account 3')).toThrow();
  });

  it('should show hidden accounts when click on toggle button', async () => {
    const { user } = render(
      <AccountList accounts={MOCK_ACCOUNTS} onPress={handlers.selectAccount} />
    );
    const btn = screen.getByText(/show hidden/i);
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(screen.getByText('Account 3')).toBeInTheDocument();
  });
});
