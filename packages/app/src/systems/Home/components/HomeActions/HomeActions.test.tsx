import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { HomeActions } from './HomeActions';

import { TestWrapper } from '~/systems/Core';

describe('HomeActions', () => {
  it('a11y', async () => {
    await testA11y(<HomeActions />, { wrapper: TestWrapper });
  });

  it("should show 'Send' and 'Receive' button", async () => {
    render(<HomeActions />, { wrapper: TestWrapper });
    expect(await screen.findByLabelText('Send Button')).toBeInTheDocument();
    expect(await screen.findByText('Receive')).toBeInTheDocument();
  });

  it("should show 'Send' and 'Receive' button disabled", async () => {
    render(<HomeActions isDisabled />, { wrapper: TestWrapper });
    expect(await screen.findByText('Send')).toHaveAttribute('aria-disabled');
    expect(await screen.findByText('Receive')).toHaveAttribute('aria-disabled');
  });
});
