import { Mnemonic as FuelMnemonic } from '@fuel-ts/mnemonic';
import { render, screen, waitFor } from '@fuel-ui/test-utils';
import { act } from 'react-dom/test-utils';

import { MnemonicWrite } from './MnemonicWrite';

import { MNEMONIC_SIZE } from '~/config';
import { getPhraseFromValue } from '~/systems/Core';
import { shuffle } from '~/systems/Vault/services/untils';

const onFilledHandler = jest.fn();
const onNextHandler = jest.fn();
const onCancelHandler = jest.fn();

const MNEMONIC = getPhraseFromValue(
  FuelMnemonic.generate(MNEMONIC_SIZE)
) as string;

const wordsToConfirm = shuffle(MNEMONIC.split(' ')).splice(0, 9);
const position = shuffle(
  wordsToConfirm.map((word) => MNEMONIC.split(' ').indexOf(word) + 1)
);

describe('MnemonicWrite', () => {
  it('should be able to click on next if canProceed and isFilled', async () => {
    render(
      <MnemonicWrite
        canProceed
        onFilled={onFilledHandler}
        onNext={onNextHandler}
        onCancel={onCancelHandler}
        words={wordsToConfirm}
        positions={position}
      />
    );

    const buttons = screen.getAllByRole('button');
    // remove the last two buttons
    buttons.slice(0, buttons.length - 2).forEach((button) => {
      act(() => {
        button.click();
      });
    });

    await waitFor(() => {
      const btnNext = screen.getByText('Next');
      expect(btnNext).toBeEnabled();
    });
  });

  it('should show error message when have error prop', async () => {
    render(
      <MnemonicWrite
        error="This is an error message"
        onFilled={onFilledHandler}
        onNext={onNextHandler}
        onCancel={onCancelHandler}
      />
    );

    expect(screen.getByText('This is an error message')).toBeInTheDocument();
  });
});
