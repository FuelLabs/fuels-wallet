import { screen } from '@fuel-ui/test-utils';
import { renderWithProvider } from '~/systems/Core/__tests__';

import { NameSystemInput } from './NameSystemInput';

const RECENTS = [
  {
    address:
      '0x0000000000000000000000000000000000000000000000000000000000000001',
    name: 'Account 2',
  },
  {
    address:
      '0x0000000000000000000000000000000000000000000000000000000000000002',
  },
];

describe('NameSystemInput', () => {
  it('should show recent wallets when the empty field is focused', async () => {
    const onChange = jest.fn();
    const { user } = renderWithProvider(
      <NameSystemInput
        value=""
        onChange={onChange}
        onError={jest.fn()}
        recents={RECENTS}
      />
    );
    await user.click(screen.getByLabelText('Address Input'));
    expect(await screen.findByText('Recent')).toBeInTheDocument();
    expect(screen.getByText('Account 2')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Send to Account 2'));
    expect(onChange).toHaveBeenCalledWith(RECENTS[0].address);
    expect(screen.getByLabelText('Address Input')).toHaveValue(
      RECENTS[0].address
    );
  });

  it('should hide recent wallets once the user types', async () => {
    const { user } = renderWithProvider(
      <NameSystemInput
        value=""
        onChange={jest.fn()}
        onError={jest.fn()}
        recents={RECENTS}
      />
    );
    const input = screen.getByLabelText('Address Input');
    await user.click(input);
    expect(await screen.findByText('Recent')).toBeInTheDocument();
    await user.type(input, '0x');
    expect(screen.queryByText('Recent')).not.toBeInTheDocument();
  });
});
