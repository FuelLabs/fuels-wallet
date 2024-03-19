import { fireEvent, screen, waitFor } from '@fuel-ui/test-utils';
import type { Connection } from '@fuel-wallet/types';
import { ConnectionService } from '~/systems/DApp/services';

export async function waitShowingConnections(...conns: Connection[]) {
  await waitFor(() => {
    for (const conn of conns) {
      expect(screen.getByText(conn.origin)).toBeInTheDocument();
    }
  });
}

export async function testRemovingConnection(
  _conn: Connection,
  deleteFn: jest.SpyInstance = jest.spyOn(ConnectionService, 'removeConnection')
) {
  expect(await screen.findByText(/Disconnecting App/i)).toBeInTheDocument();
  const confirm = screen.getByLabelText('Confirm delete');
  expect(confirm).toBeInTheDocument();
  fireEvent.click(confirm);
  expect(deleteFn).toHaveBeenCalled();
}

export async function ensureConnectionRemove(conn: Connection) {
  const successMsg = await screen.findByText(/Connection removed/i);
  expect(successMsg).toBeInTheDocument();
  await waitFor(() => {
    expect(() => screen.getByText(conn.origin)).toThrow();
  });
}

export async function waitShowingAccounts() {
  expect(await screen.findByText('Account 1')).toBeInTheDocument();
  expect(await screen.findByText('Account 2')).toBeInTheDocument();
  expect(await screen.findByText('2 connected')).toBeInTheDocument();
}

export async function clickToDisconnectAccount() {
  const check = screen.getAllByRole('switch')[0];
  fireEvent.click(check);
  expect(await screen.findByText('1 connected')).toBeInTheDocument();
}

export async function testSearch(emptyText: string) {
  const search = screen.getByLabelText('Search');
  expect(search).toBeInTheDocument();

  fireEvent.change(search, { target: { value: 'not found' } });
  expect(await screen.findByText(emptyText)).toBeInTheDocument();

  fireEvent.change(search, { target: { value: '' } });
  await waitFor(() => expect(() => screen.getByText(emptyText)).toThrow());
}
