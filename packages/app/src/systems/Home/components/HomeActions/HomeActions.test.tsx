import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { TestWrapper } from '~/systems/Core';

import { mockServer } from '~/systems/Core/__tests__/utils/msw';
import { HomeActions } from './HomeActions';

describe('HomeActions', () => {
  const server = mockServer();
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

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
    expect(await screen.findByLabelText('Send Button')).toHaveAttribute(
      'aria-disabled'
    );
    expect(await screen.findByText('Receive')).toHaveAttribute('aria-disabled');
  });
});
