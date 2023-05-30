/* eslint-disable no-restricted-syntax */
import type { render } from '@fuel-ui/test-utils';
import { screen, waitFor } from '@fuel-ui/test-utils';

import { MnemonicRead } from './MnemonicRead';

import { renderWithProvider } from '~/systems/Core/__tests__';

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
    const res = renderWithProvider(
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
    const btn = screen.getByText(/next/i);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-disabled');
  });

  it('should next be enable when confirm checkboxes', async () => {
    const saveCheckbox = screen.getByLabelText(/Confirm Saved/i);
    expect(saveCheckbox).toBeInTheDocument();
    await user.click(saveCheckbox);
    await waitFor(() => {
      const btn = screen.getByText(/next/i);
      expect(btn).toBeEnabled();
    });
  });

  it('should trigger onCancel and onNext', async () => {
    const saveCheckbox = screen.getByLabelText(/Confirm Saved/i);
    expect(saveCheckbox).toBeInTheDocument();
    await user.click(saveCheckbox);

    await waitFor(async () => {
      const btnNext = screen.getByText(/next/i);
      const btnCancel = screen.getByText('Back');

      await user.click(btnNext);
      await user.click(btnCancel);

      expect(onNextHandler).toBeCalledTimes(1);
      expect(onCancelHandler).toBeCalledTimes(1);
    });
  });
});
