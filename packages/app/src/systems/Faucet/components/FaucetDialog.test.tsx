import { render, screen } from '@fuel-ui/test-utils';

import { FaucetDialog } from './FaucetDialog';

import { TestWrapper } from '~/systems/Core/components/TestWrapper';

describe('FaucetDialog', () => {
  it('should show Faucet button', async () => {
    render(<FaucetDialog />, { wrapper: TestWrapper });
    const faucetBtn = screen.getByText(/Give me ETH/i);
    expect(faucetBtn).toBeInTheDocument();
  });
});
