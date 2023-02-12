import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ASSETS } from '../../__mocks__/assets';

import { AssetItem } from './AssetItem';

import { TestWrapper } from '~/systems/Core';

describe('AssetItem', () => {
  it('a11y', async () => {
    await testA11y(<AssetItem asset={MOCK_ASSETS[0]} />, {
      wrapper: TestWrapper,
    });
  });
  it('should show asset name', () => {
    render(<AssetItem asset={MOCK_ASSETS[0]} />, { wrapper: TestWrapper });
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });
  it('should show asset symbol', () => {
    render(<AssetItem asset={MOCK_ASSETS[0]} />, { wrapper: TestWrapper });
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });
  it('should show asset amount formatted', () => {
    render(<AssetItem asset={MOCK_ASSETS[0]} />, { wrapper: TestWrapper });
    expect(screen.getByText('14.563 ETH')).toBeInTheDocument();
  });
});
