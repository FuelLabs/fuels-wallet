import { fireEvent, screen, waitFor } from '@fuel-ui/test-utils';
import type { Connection } from '@fuel-wallet/types';

import { connectionsLoader } from '../../__mocks__/connection';
import { useConnections } from '../../hooks';

import { Usage } from './ConnectionList.stories';

import { TestWrapper } from '~/systems/Core';
import { renderWithRouter } from '~/systems/Core/utils/jest';
import { ConnectionService } from '~/systems/DApp/services';

function Content() {
  const state = useConnections();
  return <Usage {...state} />;
}

const opts = {
  route: '/settings/connections',
  wrapper: TestWrapper,
};

describe('ConnectionList', () => {
  let conn1: Connection;
  let conn2: Connection;

  beforeEach(async () => {
    const res = await connectionsLoader();
    conn1 = res.connection1!;
    conn2 = res.connection2!;
  });

  it('should render apps connected', async () => {
    renderWithRouter(<Content />, opts);
    await waitFor(() => {
      expect(screen.getByText(conn1.origin)).toBeInTheDocument();
      expect(screen.getByText(conn2.origin)).toBeInTheDocument();
    });
  });

  it('should remove a connection', async () => {
    const deleteFn = jest.spyOn(ConnectionService, 'removeConnection');
    const { user } = renderWithRouter(<Content />, opts);
    await waitFor(() => screen.getByText(conn1.origin));
    const btn = screen.getAllByLabelText('Delete');
    await user.click(btn[1]);

    await waitFor(async () => {
      expect(await screen.findByText('Disconnected App')).toBeInTheDocument();
      const confirm = screen.getByLabelText('Confirm delete');
      expect(confirm).toBeInTheDocument();
      await user.click(confirm);
      expect(deleteFn).toHaveBeenCalled();
    });

    await waitFor(() => {
      const successMsg = screen.getByText('Connection removed successfully');
      expect(successMsg).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(() => screen.getByText(conn1.origin)).toThrow();
    });
  });

  it('should see an empty list when not found', async () => {
    renderWithRouter(<Content />, opts);
    await waitFor(() => screen.getByText(conn1.origin));
    const search = screen.getByLabelText('Search');
    expect(search).toBeInTheDocument();
    fireEvent.change(search, { target: { value: 'not found' } });
    await waitFor(() => {
      expect(screen.getByText('No connection found')).toBeInTheDocument();
    });
  });
});
