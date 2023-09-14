import { render, screen } from '@fuel-ui/test-utils';
import { TestWrapper } from '~/systems/Core/components/TestWrapper';

import { FaucetDialog } from './FaucetDialog';

describe('FaucetDialog', () => {
  it('should show Faucet button', async () => {
    render(<FaucetDialog />, { wrapper: TestWrapper });
    const faucetBtn = screen.getByText(/Give me ETH/i);
    expect(faucetBtn).toBeInTheDocument();
  });
});
