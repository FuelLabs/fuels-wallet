import { screen, testA11y } from '@fuel-ui/test-utils';
import { TestWrapper } from '~/systems/Core';
import { renderWithProvider } from '~/systems/Core/__tests__';

import { MOCK_ASSETS } from '../../__mocks__/assets';

import { AssetList } from './AssetList';

describe('AssetList', () => {
  it('a11y', async () => {
    await testA11y(<AssetList assets={MOCK_ASSETS} />, {
      wrapper: TestWrapper,
    });
  });

  it('should show one assets', () => {
    renderWithProvider(<AssetList assets={MOCK_ASSETS} />);
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it('should not repeat keys for unknown assets', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const unknown = (assetId: string) => ({
      name: '',
      symbol: '',
      icon: '',
      networks: [{ type: 'fuel', chainId: 0, assetId, decimals: 0 } as const],
    });
    const { user } = renderWithProvider(
      <AssetList assets={[unknown('0x01'), unknown('0x02')]} />
    );
    await user.click(screen.getByLabelText('Show unknown assets'));
    const keyWarnings = errorSpy.mock.calls.filter((args) =>
      String(args[0]).includes('same key')
    );
    expect(keyWarnings).toHaveLength(0);
    errorSpy.mockRestore();
  });

  it('should show an empty illustration when no assets', () => {
    renderWithProvider(<AssetList.Empty />);
    expect(screen.getByText("You don't have any assets")).toBeInTheDocument();
  });
});
