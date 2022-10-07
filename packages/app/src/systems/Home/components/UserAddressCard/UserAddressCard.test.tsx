import { render, screen } from '@fuel-ui/test-utils';

import { UserAddressCard } from '.';

import { TestWrapper } from '~/systems/Core';

const TEST_ACCOUNT =
  'fuel1auahknz6mjuu0am034mlggh55f0tgp9j7fkzrc6xl48zuy5zv7vqa07n30';

describe('UserAddressCard', () => {
  it('should show infos and copy the address', async () => {
    render(<UserAddressCard account={TEST_ACCOUNT} />, {
      wrapper: TestWrapper,
    });
    const accountPreview = await screen.findByTestId('account-preview');
    expect(accountPreview).toBeInTheDocument();
    const copyButton = await screen.findByTestId('copy-account');
    expect(copyButton).toBeInTheDocument();
    copyButton.click();
    const clipboardValue = await navigator.clipboard.readText();
    expect(clipboardValue).toBe(TEST_ACCOUNT);
  });
});
