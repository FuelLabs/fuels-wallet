import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ASSETS } from '../../__mocks__/assets';

import { AssetItem } from './AssetItem';

describe('AssetItem', () => {
  it('a11y', async () => {
    await testA11y(<AssetItem coin={MOCK_ASSETS[0]} />);
  });
  it('should show asset name', () => {
    render(<AssetItem coin={MOCK_ASSETS[0]} />);
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });
  it('should show asset symbol', () => {
    render(<AssetItem coin={MOCK_ASSETS[0]} />);
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });
  it('should show asset amount formatted', () => {
    render(<AssetItem coin={MOCK_ASSETS[0]} />);
    expect(screen.getByText('14.563 ETH')).toBeInTheDocument();
  });
});
