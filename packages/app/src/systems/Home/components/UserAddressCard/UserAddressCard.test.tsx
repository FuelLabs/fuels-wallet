import { render, screen } from '@fuel-ui/test-utils';
import { TestWrapper } from '~/systems/Core';

import { act } from 'react';
import { UserAddressCard } from '.';

const TEST_ACCOUNT =
  '0xef3b7b4c5adcb9c7f76f8d77f422f4a25eb404b2f26c21e346fd4e2e12826798';

describe('UserAddressCard', () => {
  it('should show infos and copy the address', async () => {
    render(<UserAddressCard address={TEST_ACCOUNT} />, {
      wrapper: TestWrapper,
    });
    const accountPreview = screen.getByLabelText('account-preview');
    expect(accountPreview).toBeInTheDocument();
    const copyButton = screen.getByLabelText('copy-account');
    expect(copyButton).toBeInTheDocument();

    act(() => {
      copyButton.click();
    });

    const clipboardValue = await navigator.clipboard.readText();
    expect(clipboardValue).toBe(TEST_ACCOUNT);
  });
});
