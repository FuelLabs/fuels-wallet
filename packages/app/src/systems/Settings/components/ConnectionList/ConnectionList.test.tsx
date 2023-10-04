import { fireEvent, screen } from '@fuel-ui/test-utils';
import type { Connection } from '@fuel-wallet/types';
import { TestWrapper } from '~/systems/Core';
import { renderWithRouter } from '~/systems/Core/__tests__/utils';

import { connectionsLoader } from '../../__mocks__/connection';
import { testQueries } from '../../__test__';
import { useConnections } from '../../hooks';

import { Usage } from './ConnectionList.stories';

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
    await testQueries.waitShowingConnections(conn1, conn2);
  });

  it('should remove a connection', async () => {
    renderWithRouter(<Content />, opts);
    await testQueries.waitShowingConnections(conn1);
    fireEvent.click(screen.getAllByLabelText('Delete')[1]);
    await testQueries.testRemovingConnection(conn1);
    await testQueries.ensureConnectionRemove(conn1);
  });

  it('should see an empty list when not found', async () => {
    renderWithRouter(<Content />, opts);
    await testQueries.waitShowingConnections(conn1);
    await testQueries.testSearch('No connection found');
  });
});
