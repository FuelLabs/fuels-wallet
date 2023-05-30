import { Mnemonic as FuelMnemonic } from '@fuel-ts/mnemonic';
import { screen, waitFor } from '@fuel-ui/test-utils';
import { act } from 'react-dom/test-utils';

import { MnemonicWrite } from './MnemonicWrite';

import { MNEMONIC_SIZE } from '~/config';
import { getPhraseFromValue } from '~/systems/Core';
import { renderWithProvider } from '~/systems/Core/__tests__';

const onFilledHandler = jest.fn();
const onNextHandler = jest.fn();
const onCancelHandler = jest.fn();

const MNEMONIC = getPhraseFromValue(
  FuelMnemonic.generate(MNEMONIC_SIZE)
) as string;

describe('MnemonicWrite', () => {
  it('should trigger onFilled after paste', async () => {
    renderWithProvider(
      <MnemonicWrite
        canProceed
        onFilled={onFilledHandler}
        onNext={onNextHandler}
        onCancel={onCancelHandler}
      />
    );

    await navigator.clipboard.writeText(MNEMONIC);
    const btn = screen.getByText('Paste');

    act(() => {
      btn.click();
    });

    await waitFor(async () => {
      expect(onFilledHandler).toBeCalledTimes(1);
    });
  });

  it('should be able to click on next if canProceed and isFilled', async () => {
    renderWithProvider(
      <MnemonicWrite
        canProceed
        onFilled={onFilledHandler}
        onNext={onNextHandler}
        onCancel={onCancelHandler}
      />
    );

    await navigator.clipboard.writeText(MNEMONIC);
    const btnPaste = screen.getByText('Paste');

    act(() => {
      btnPaste.click();
    });

    await waitFor(() => {
      const btnNext = screen.getByText(/next/i);
      expect(btnNext).toBeEnabled();
    });
  });

  it('should show error message when have error prop', async () => {
    renderWithProvider(
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
