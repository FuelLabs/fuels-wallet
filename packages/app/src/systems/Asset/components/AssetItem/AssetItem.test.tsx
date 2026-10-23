import { screen } from '@fuel-ui/test-utils';
import { renderWithProvider } from '~/systems/Core/__tests__';

import { AssetItem } from './AssetItem';

const FUEL_ASSET = {
  type: 'fuel' as const,
  chainId: 0,
  assetId: '0x01',
  decimals: 9,
  name: 'Ethereum',
  symbol: 'ETH',
  icon: '',
};

describe('AssetItem', () => {
  it('should open the asset when the row is pressed', async () => {
    const onPress = jest.fn();
    const { user } = renderWithProvider(
      <AssetItem fuelAsset={FUEL_ASSET} amount={1} onPress={onPress} />
    );
    await user.click(screen.getByText('Ethereum'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should open the asset with the keyboard', async () => {
    const onPress = jest.fn();
    const { user } = renderWithProvider(
      <AssetItem fuelAsset={FUEL_ASSET} amount={1} onPress={onPress} />
    );
    screen.getByRole('button', { name: /Ethereum/ }).focus();
    await user.keyboard('{Enter}');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not open the asset when an inner button is pressed', async () => {
    const onPress = jest.fn();
    const { user } = renderWithProvider(
      <AssetItem
        fuelAsset={FUEL_ASSET}
        amount={1}
        onPress={onPress}
        shouldShowAddAssetBtn
      />
    );
    await user.click(screen.getByText('(Add)'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
