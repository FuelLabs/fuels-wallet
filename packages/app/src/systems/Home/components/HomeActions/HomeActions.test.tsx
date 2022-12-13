import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { HomeActions } from './HomeActions';

describe('HomeActions', () => {
  it('a11y', async () => {
    await testA11y(<HomeActions />);
  });

  it("should show 'Send' and 'Receive' button", async () => {
    render(<HomeActions />);
    expect(await screen.findByLabelText('Send Button')).toBeInTheDocument();
    expect(await screen.findByText('Receive')).toBeInTheDocument();
  });

  it("should show 'Send' and 'Receive' button disabled", async () => {
    render(<HomeActions isDisabled />);
    expect(await screen.findByText('Send')).toHaveAttribute('aria-disabled');
    expect(await screen.findByText('Receive')).toHaveAttribute('aria-disabled');
  });
});
