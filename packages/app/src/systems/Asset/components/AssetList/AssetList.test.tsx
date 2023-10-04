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

  it('should show an empty illustration when no assets', () => {
    renderWithProvider(<AssetList.Empty />);
    expect(screen.getByText("You don't have any assets")).toBeInTheDocument();
  });
});
