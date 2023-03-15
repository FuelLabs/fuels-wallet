import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ASSETS } from '../../__mocks__/assets';

import { AssetList } from './AssetList';

import { TestWrapper, RouterProvider, Providers } from '~/systems/Core';

describe('AssetList', () => {
  it('a11y', async () => {
    await testA11y(<AssetList assets={MOCK_ASSETS} />, {
      wrapper: TestWrapper,
    });
  });
  it('a11y empty', async () => {
    await testA11y(
      <RouterProvider>
        <Providers>
          <AssetList.Empty />
        </Providers>
      </RouterProvider>
    );
  });
  it('a11y loading', async () => {
    await testA11y(<AssetList.Loading />);
  });

  it('should show one assets', () => {
    render(<AssetList assets={MOCK_ASSETS} />, { wrapper: TestWrapper });
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it('should show an empty illustration when no assets', () => {
    render(<AssetList.Empty />, { wrapper: TestWrapper });
    expect(screen.getByText("You don't have any assets")).toBeInTheDocument();
    expect(screen.getByAltText('No assets')).toBeInTheDocument();
  });
});
