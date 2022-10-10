import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ACCOUNTS } from '../../__mocks__';

import { AccountList } from './AccountList';

describe('AccountList', () => {
  it('a11y', async () => {
    await testA11y(<AccountList accounts={MOCK_ACCOUNTS} />);
  });

  it('should render two accounts', () => {
    render(<AccountList accounts={MOCK_ACCOUNTS} />);
    expect(screen.getByText('Account 1')).toBeInTheDocument();
    expect(screen.getByText('Account 2')).toBeInTheDocument();
    expect(() => screen.getByText('Account 3')).toThrow();
  });

  it('should show hidden accounts when click on toggle button', async () => {
    const { user } = render(<AccountList accounts={MOCK_ACCOUNTS} />);
    const btn = screen.getByText(/show hidden/i);
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(screen.getByText('Account 3')).toBeInTheDocument();
  });
});
