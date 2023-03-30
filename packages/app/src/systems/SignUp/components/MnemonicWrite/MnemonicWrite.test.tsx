import { render, screen, waitFor } from '@fuel-ui/test-utils';
import { act } from 'react-dom/test-utils';

import { MnemonicWrite } from './MnemonicWrite';

const onFilledHandler = jest.fn();
const onNextHandler = jest.fn();
const onCancelHandler = jest.fn();

describe('MnemonicWrite', () => {
  it('should be able to click on next if canProceed and isFilled', async () => {
    render(
      <MnemonicWrite
        canProceed
        onFilled={onFilledHandler}
        onNext={onNextHandler}
        onCancel={onCancelHandler}
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
