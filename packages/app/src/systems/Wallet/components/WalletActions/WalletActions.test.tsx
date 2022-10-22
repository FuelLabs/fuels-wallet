import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { WalletActions } from './WalletActions';

describe('WalletActions', () => {
  it('a11y', async () => {
    await testA11y(<WalletActions />);
  });

  it("should show 'Send' and 'Receive' button", async () => {
    render(<WalletActions />);
    expect(screen.getByText('Send')).toBeInTheDocument();
    expect(screen.getByText('Receive')).toBeInTheDocument();
  });

  it("should show 'Send' and 'Receive' button disabled", async () => {
    render(<WalletActions isDisabled />);
    expect(screen.getByText('Send')).toBeDisabled();
    expect(screen.getByText('Receive')).toBeDisabled();
  });
});
