import { act, render, screen } from '@fuel-ui/test-utils';

import { UserAddressCard } from '.';

import { TestWrapper } from '~/systems/Core';

const TEST_ACCOUNT =
  'fuel1auahknz6mjuu0am034mlggh55f0tgp9j7fkzrc6xl48zuy5zv7vqa07n30';

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
