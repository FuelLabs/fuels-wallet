import { fireEvent, screen } from '@fuel-ui/test-utils';
import type { Connection } from '@fuel-wallet/types';
import { TestWrapper } from '~/systems/Core';
import { renderWithRouter } from '~/systems/Core/__tests__/utils';
import { ConnectionService } from '~/systems/DApp/services';

import { connectionsLoader } from '../../__mocks__/connection';
import { testQueries } from '../../__test__';

import { List } from './Connections.stories';

const opts = {
  route: '/settings/connections',
  wrapper: TestWrapper,
};

describe('Connections', () => {
  let conn1: Connection;
  let conn2: Connection;

  beforeEach(async () => {
    const res = await connectionsLoader();
    conn1 = res.connection1!;
    conn2 = res.connection2!;
  });

  it('should do the entire connection management flow', async () => {
    renderWithRouter(<List />, opts);

    /** Check if list screen is working */
    await testQueries.waitShowingConnections(conn1, conn2);

    /** Go to the edit connection page */
    const edit = screen.getAllByLabelText('Edit')[0];
    fireEvent.click(edit);
    await testQueries.waitShowingAccounts();
    await testQueries.testSearch('No account found');
    await testQueries.clickToDisconnectAccount();

    /** Back to the list */
    const back = screen.getByLabelText('Back');
    fireEvent.click(back);

    /** Check if connection was edited */
    await testQueries.waitShowingConnections();
    const connectedText = /1 account connected/;
    const oneConnectedTexts = await screen.findAllByText(connectedText);
    expect(oneConnectedTexts.length).toBe(2);

    /** Check if the connection was removed */
    await testQueries.testSearch('No connection found');
    const deleteFn = jest.spyOn(ConnectionService, 'removeConnection');
    fireEvent.click(screen.getAllByLabelText('Delete')[1]);
    await testQueries.testRemovingConnection(conn1, deleteFn);
    await testQueries.ensureConnectionRemove(conn1);
  });
});
