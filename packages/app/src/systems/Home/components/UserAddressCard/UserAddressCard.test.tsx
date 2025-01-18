import { render, screen } from '@fuel-ui/test-utils';
import { TestWrapper } from '~/systems/Core';

import { act } from 'react';
import { UserAddressCard } from '.';

const TEST_ACCOUNT = 'fuelsequencer1mt7k6ynlayacjwpqt0lwdn7ksv72ek2lwt95nu';

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
