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
      <AssetsAmount
        amounts={MOCK_ASSETS_AMOUNTS}
        title="Assets to Send"
        isPositive
      />
    );
    expect(screen.getByText('+14.5 ETH')).toBeInTheDocument();
  });

  it('should show negative values with substract signal', async () => {
    render(
      <AssetsAmount
        amounts={MOCK_ASSETS_AMOUNTS}
        title="Assets to Send"
        isNegative
      />
    );
    expect(screen.getByText('-14.5 ETH')).toBeInTheDocument();
  });

  it('should not show positive/negative signal', async () => {
    render(
      <AssetsAmount amounts={MOCK_ASSETS_AMOUNTS} title="Assets to Send" />
    );
    const el = screen.getByText('14.5 ETH');
    expect(el.innerHTML.indexOf('+')).toEqual(-1);
    expect(el.innerHTML.indexOf('-')).toEqual(-1);
    expect(el).toBeInTheDocument();
  });
});
