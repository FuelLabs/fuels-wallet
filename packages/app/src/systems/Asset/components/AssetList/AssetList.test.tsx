import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ASSETS } from '../../__mocks__/assets';

import { AssetList } from './AssetList';

import { TestWrapper } from '~/systems/Core';

describe('AssetList', () => {
  it('a11y', async () => {
    await testA11y(<AssetList assets={MOCK_ASSETS} />);
  });

  it('should show tree assets', () => {
    render(<AssetList assets={MOCK_ASSETS} />);
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('Dai')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  });

  it('should show an empty illustration when no assets', () => {
    render(<AssetList.Empty />, { wrapper: TestWrapper });
    expect(screen.getByText("You don't have any assets")).toBeInTheDocument();
    expect(screen.getByAltText('No assets')).toBeInTheDocument();
  });
});
