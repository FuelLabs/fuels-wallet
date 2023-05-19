import { fireEvent, render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_CONNECTION } from '../../__mocks__/connection';
import { testQueries } from '../../__test__';

import { ConnectionItem } from './ConnectionItem';

const onEdit = jest.fn();
const onDelete = jest.fn();

function Content() {
  return (
    <ConnectionItem
      connection={MOCK_CONNECTION}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

describe('ConnectionItem', () => {
  it('a11y', async () => {
    await testA11y(<Content />);
  });

  it('should show connection information', async () => {
    render(<Content />);
    expect(await screen.findByText(MOCK_CONNECTION.origin)).toBeInTheDocument();
    expect(await screen.findByText(/1 account connected/i)).toBeInTheDocument();
  });

  it('should trigger onEdit', async () => {
    const { user } = render(<Content />);
    const btn = screen.getByLabelText('Edit');
    await user.click(btn);
    expect(onEdit).toHaveBeenCalled();
  });

  it('should show a dialog before onDelete', async () => {
    render(<Content />);
    fireEvent.click(screen.getByLabelText('Delete'));
    await testQueries.testRemovingConnection(MOCK_CONNECTION, onDelete);
  });
});
