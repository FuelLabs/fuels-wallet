import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ASSETS_AMOUNTS } from '../../__mocks__/assets';

import { AssetsAmount } from './AssetsAmount';

describe('AssetsAmount', () => {
  it('a11y', async () => {
    await testA11y(<AssetsAmount amounts={MOCK_ASSETS_AMOUNTS} />);
  });

  it('should show multiple assets', async () => {
    render(<AssetsAmount amounts={MOCK_ASSETS_AMOUNTS} />);
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('Dai')).toBeInTheDocument();
  });

  it('should show positive values with plus', async () => {
    render(<AssetsAmount amounts={MOCK_ASSETS_AMOUNTS} />);
    expect(screen.getByText('14563943.834 ETH')).toBeInTheDocument();
  });
});
