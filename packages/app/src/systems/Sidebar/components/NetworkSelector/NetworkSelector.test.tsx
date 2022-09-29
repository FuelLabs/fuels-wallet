import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { NetworkSelector } from './NetworkSelector';

import { TestWrapper } from '~/systems/Core/components/TestWrapper';
import { MOCK_NETWORKS } from '~/systems/Network/__mocks__';

const SELECTED = MOCK_NETWORKS[0];
const NOT_SELECTED = MOCK_NETWORKS[1];

const props = {
  networks: MOCK_NETWORKS,
  selected: SELECTED,
};

describe('NetworkSelector', () => {
  afterAll(() => {
    jest.useFakeTimers();
  });
  beforeAll(() => {
    jest.useRealTimers();
  });

  it('a11y', async () => {
    await testA11y(<NetworkSelector {...props} />, {
      wrapper: TestWrapper,
    });
  });

  it('should open dropdown with given networks', async () => {
    const { user } = render(<NetworkSelector {...props} />, {
      wrapper: TestWrapper,
    });

    expect(() => screen.getByText(NOT_SELECTED.name)).toThrow();
    const selector = screen.getByTestId('fuel_network-item');
    await user.click(selector);
    expect(screen.getByText(NOT_SELECTED.name)).toBeInTheDocument();
  });

  it('should dispatch onSelectNetwork handle', async () => {
    const handler = jest.fn();
    const { user } = render(<NetworkSelector {...props} onSelectNetwork={handler} />, {
      wrapper: TestWrapper,
    });

    jest.advanceTimersByTime(1000);
    const selector = screen.getByTestId('fuel_network-item');
    await user.click(selector);
    const item = screen.getByText(NOT_SELECTED.name);
    expect(item).toBeInTheDocument();
    await user.click(item);
    expect(handler).toBeCalledWith(NOT_SELECTED);
  });
});
