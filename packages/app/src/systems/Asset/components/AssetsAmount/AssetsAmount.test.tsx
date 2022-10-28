import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ASSETS_AMOUNTS } from '../../__mocks__/assets';

import { AssetsAmount } from './AssetsAmount';

describe('AssetsAmount', () => {
  it('a11y', async () => {
    await testA11y(
      <AssetsAmount amounts={MOCK_ASSETS_AMOUNTS} title="Assets to Send" />
    );
  });

  it('should show multiple assets', async () => {
    render(
      <AssetsAmount amounts={MOCK_ASSETS_AMOUNTS} title="Assets to Send" />
    );
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('Dai')).toBeInTheDocument();
  });

  it('should show positive values with plus', async () => {
    render(
      <AssetsAmount amounts={MOCK_ASSETS_AMOUNTS} title="Assets to Send" />
    );
    expect(screen.getByText('14.5 ETH')).toBeInTheDocument();
  });
});
