import { CardList } from '@fuel-ui/react';
import { render, screen, testA11y, waitFor } from '@fuel-ui/test-utils';

import { MOCK_NETWORKS } from '../../__mocks__/networks';

import type { NetworkItemProps } from './NetworkItem';
import { NetworkItem } from './NetworkItem';

import { TestWrapper } from '~/systems/Core/components/TestWrapper';

const NETWORK = MOCK_NETWORKS[0];

const Content = (props: Partial<NetworkItemProps>) => {
  return (
    <CardList>
      <NetworkItem network={NETWORK} {...props} />
    </CardList>
  );
};

describe('NetworkItem', () => {
  it('a11y', async () => {
    await testA11y(<Content />, { wrapper: TestWrapper });
  });

  it('should render item correctly', async () => {
    render(<Content />, { wrapper: TestWrapper });
    expect(screen.getByText(NETWORK.name)).toBeInTheDocument();
  });

  it('should render actions when has any handler prop', async () => {
    const fn = jest.fn();
    render(<Content onUpdate={fn} onRemove={fn} />, { wrapper: TestWrapper });
    expect(screen.getByLabelText('Update')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove')).toBeInTheDocument();
  });

  it('should show a confirm dialog before remove', async () => {
    const removeHandler = jest.fn();
    const { user } = render(<Content onRemove={removeHandler} />, {
      wrapper: TestWrapper,
    });

    const removeBtn = screen.getByLabelText('Remove');
    await user.click(removeBtn);

    expect(
      await screen.findByText('Are you absolutely sure?')
    ).toBeInTheDocument();

    const confirmBtn = screen.getByText('Confirm');
    await user.click(confirmBtn);

    expect(removeHandler).toBeCalledTimes(1);
    await waitFor(async () => {
      expect(() => screen.getByText('Are you absolutely sure?')).toThrow();
    });
  });
});
