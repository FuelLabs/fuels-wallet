import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { configure } from '@testing-library/react';
import { TestWrapper } from '~/systems/Core/components/TestWrapper';
import { MOCK_NETWORKS } from '~/systems/Network/__mocks__/networks';

import { act } from 'react';
import { NetworkSelector } from './NetworkSelector';

const SELECTED = MOCK_NETWORKS[0];
const NOT_SELECTED = MOCK_NETWORKS[1];

const props = {
  networks: MOCK_NETWORKS,
  selected: SELECTED,
};

beforeEach(() => {
  configure({
    throwSuggestions: true,
  });
});

describe('NetworkSelector', () => {
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
    const selector = screen.getByRole('button', { name: /selected network/i });

    await act(async () => {
      await user.click(selector);
    });
    const item = screen.getByRole('menuitem', {
      name: 'fuel_network-dropdown-item-2',
    });
    expect(item).toBeInTheDocument();
  });

  it('should dispatch onSelectNetwork handle', async () => {
    const handler = jest.fn();
    const { user } = render(
      <NetworkSelector {...props} onSelectNetwork={handler} />,
      { wrapper: TestWrapper }
    );

    const selector = screen.getByRole('button', { name: /selected network/i });
    await user.click(selector);

    const item = screen.getByRole('menuitem', {
      name: 'fuel_network-dropdown-item-2',
    });
    expect(item).toBeInTheDocument();
    await user.click(item);
    expect(handler).toBeCalledWith(NOT_SELECTED);
  });
});
