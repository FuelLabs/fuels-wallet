import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { bn } from 'fuels';

import { ASSET_LIST } from '../../utils';

import { AssetItem } from './AssetItem';

const AMOUNT = bn('14563943834');

describe('AssetItem', () => {
  it('a11y', async () => {
    await testA11y(
      <AssetItem asset={{ assetId: ASSET_LIST[0].assetId, amount: AMOUNT }} />
    );
  });
  it('should show asset name', () => {
    render(
      <AssetItem asset={{ assetId: ASSET_LIST[0].assetId, amount: AMOUNT }} />
    );
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });
  it('should show asset symbol', () => {
    render(
      <AssetItem asset={{ assetId: ASSET_LIST[0].assetId, amount: AMOUNT }} />
    );
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });
  it('should show asset amount formatted', () => {
    render(
      <AssetItem asset={{ assetId: ASSET_LIST[0].assetId, amount: AMOUNT }} />
    );
    expect(screen.getByText('14,564 ETH')).toBeInTheDocument();
  });
});
