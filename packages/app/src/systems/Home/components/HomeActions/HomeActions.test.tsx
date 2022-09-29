import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { HomeActions } from './HomeActions';

describe('HomeActions', () => {
  it('a11y', async () => {
    await testA11y(<HomeActions />);
  });

  it("should show 'Send' and 'Receive' button", async () => {
    render(<HomeActions />);
    expect(screen.getByText('Send')).toBeInTheDocument();
    expect(screen.getByText('Receive')).toBeInTheDocument();
  });

  it("should show 'Send' and 'Receive' button disabled", async () => {
    render(<HomeActions isDisabled />);
    expect(screen.getByText('Send')).toBeDisabled();
    expect(screen.getByText('Receive')).toBeDisabled();
  });
});
