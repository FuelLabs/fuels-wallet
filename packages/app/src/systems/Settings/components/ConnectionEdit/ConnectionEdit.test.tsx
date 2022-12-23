import { fireEvent, screen, waitFor } from '@fuel-ui/test-utils';

import { connectionsLoader } from '../../__mocks__/connection';
import { useConnections } from '../../hooks';

import { Usage } from './ConnectionEdit.stories';

import { TestWrapper } from '~/systems/Core';
import { renderWithRouter } from '~/systems/Core/utils/jest';

function Content() {
  const state = useConnections();
  return <Usage {...state} />;
}

const opts = {
  route: '/settings/connections?origin=fuellabs.github.io/swayswap',
  wrapper: TestWrapper,
};

describe('ConnectionEdit', () => {
  beforeEach(async () => {
    await connectionsLoader();
  });

  it('should render accounts connected', async () => {
    renderWithRouter(<Content />, opts);
    await waitFor(() => {
      expect(screen.getByText('Account 1')).toBeInTheDocument();
      expect(screen.getByText('Account 2')).toBeInTheDocument();
      expect(screen.getByText('2 connected')).toBeInTheDocument();
    });
  });

  it('should disconnect account', async () => {
    const { user } = renderWithRouter(<Content />, opts);
    await waitFor(() => screen.getByText('Account 1'));
    expect(await screen.findByText('2 connected')).toBeInTheDocument();
    const check = screen.getAllByRole('switch')[0];
    await user.click(check);
    expect(await screen.findByText('1 connected')).toBeInTheDocument();
  });

  it('should see an empty list when not found', async () => {
    renderWithRouter(<Content />, opts);
    await waitFor(() => screen.getByText('Account 1'));
    const search = screen.getByLabelText('Search');
    expect(search).toBeInTheDocument();
    fireEvent.change(search, { target: { value: 'not found' } });
    await waitFor(() => {
      expect(screen.getByText('No account found')).toBeInTheDocument();
    });
  });
});
