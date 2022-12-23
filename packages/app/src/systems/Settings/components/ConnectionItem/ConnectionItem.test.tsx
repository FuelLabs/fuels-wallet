import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_CONNECTION } from '../../__mocks__/connection';

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
    expect(
      await screen.findByText(/1 account\(s\) connected/i)
    ).toBeInTheDocument();
  });

  it('should trigger onEdit', async () => {
    const { user } = render(<Content />);
    const btn = screen.getByLabelText('Edit');
    await user.click(btn);
    expect(onEdit).toHaveBeenCalled();
  });

  it('should show a dialog before onDelete', async () => {
    const { user } = render(<Content />);
    const btn = screen.getByLabelText('Delete');
    await user.click(btn);
    expect(await screen.findByText('Disconnected App')).toBeInTheDocument();
    const confirm = screen.getByText('Confirm');
    await user.click(confirm);
    expect(onDelete).toHaveBeenCalled();
  });
});
