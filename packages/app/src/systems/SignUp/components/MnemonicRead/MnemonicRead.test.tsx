/* eslint-disable no-restricted-syntax */
import { render, screen, waitFor } from '@fuel-ui/test-utils';

import { MnemonicRead } from './MnemonicRead';

const WORDS = [
  'strange',
  'purple',
  'adamant',
  'crayons',
  'entice',
  'fun',
  'eloquent',
  'missiles',
  'milk',
  'ice',
  'cream',
  'apple',
];

const onNextHandler = jest.fn();
const onCancelHandler = jest.fn();

type UserPatch = ReturnType<typeof render>['user'];

describe('MnemonicRead', () => {
  let user: UserPatch;

  beforeEach(() => {
    const res = render(
      <MnemonicRead
        words={WORDS}
        onNext={onNextHandler}
        onCancel={onCancelHandler}
      />
    );

    user = res.user;
  });

  it('should have show mnemonic as words', () => {
    for (const word of WORDS) {
      expect(screen.getByText(word)).toBeInTheDocument();
    }
  });

  it('should next be disabled by default', async () => {
    const btn = screen.getByText('Next');
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it('should next be enable when confirm checkbox', async () => {
    const checkbox = screen.getByLabelText(/Confirm saved/i);
    expect(checkbox).toBeInTheDocument();
    await user.click(checkbox);
    await waitFor(() => {
      const btn = screen.getByText('Next');
      expect(btn).toBeEnabled();
    });
  });

  it('should trigger onCancel and onNext', async () => {
    const checkbox = screen.getByLabelText(/Confirm saved/i);
    await user.click(checkbox);

    await waitFor(async () => {
      const btnNext = screen.getByText('Next');
      const btnCancel = screen.getByText('Cancel');

      await user.click(btnNext);
      await user.click(btnCancel);

      expect(onNextHandler).toBeCalledTimes(1);
      expect(onCancelHandler).toBeCalledTimes(1);
    });
  });
});
