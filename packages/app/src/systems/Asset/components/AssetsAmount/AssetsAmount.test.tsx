import { render, screen, testA11y } from '@fuel-ui/test-utils';

import {
  MOCK_ASSETS_AMOUNTS,
  MOCK_MIXED_ASSETS_AMOUNTS,
} from '../../__mocks__/assets';

import { AssetsAmount } from './AssetsAmount';

describe('AssetsAmount', () => {
  it('a11y', async () => {
    await testA11y(
      <AssetsAmount amounts={MOCK_ASSETS_AMOUNTS} title="Assets to Send" />
    );
  });

  it('a11y Loader', async () => {
    await testA11y(<AssetsAmount.Loader />);
  });

  it('should show multiple mixed assets', async () => {
    render(
      <AssetsAmount
        amounts={MOCK_MIXED_ASSETS_AMOUNTS}
        title="Assets to Send"
      />
    );
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
