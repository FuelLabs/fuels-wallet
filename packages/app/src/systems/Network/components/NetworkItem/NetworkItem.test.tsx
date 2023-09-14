import { CardList } from '@fuel-ui/react';
import { render, screen, testA11y, waitFor } from '@fuel-ui/test-utils';
import { TestWrapper } from '~/systems/Core/components/TestWrapper';

import { MOCK_NETWORKS } from '../../__mocks__/networks';

import type { NetworkItemProps } from './NetworkItem';
import { NetworkItem } from './NetworkItem';

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

  // TODO: enable this when fuel-ui fixes <AlertDialog>  not opening
  it.skip('should show a confirm dialog before remove', async () => {
    const removeHandler = jest.fn();
    const { user } = render(<Content onRemove={removeHandler} />, {
      wrapper: TestWrapper,
    });

    const removeBtn = await screen.findByLabelText('Remove');
    await user.click(removeBtn);

    expect(await screen.findByText('Are you sure?')).toBeInTheDocument();

    const confirmBtn = screen.getByText('Confirm');
    await user.click(confirmBtn);

    expect(removeHandler).toBeCalledTimes(1);
    await waitFor(async () => {
      expect(() => screen.getByText('Are you sure?')).toThrow();
    });
  });
});
