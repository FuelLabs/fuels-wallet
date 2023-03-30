/* eslint-disable no-restricted-syntax */
import { render, screen, testA11y, fireEvent } from '@fuel-ui/test-utils';

import { MnemonicConfirm } from './MnemonicConfirm';

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
];

const POSITIONS = [4, 5, 7, 3, 2, 6, 8, 1, 9];

describe('Mnemonic Confirmation', () => {
  const onNext = jest.fn();
  const onCancel = jest.fn();
  const onFilled = jest.fn();
  const callbacks = {
    onNext,
    onCancel,
    onFilled,
  };

  it('a11y', async () => {
    await testA11y(
      <MnemonicConfirm {...callbacks} words={WORDS} positions={POSITIONS} />
    );
  });

  it('should only render 9 mnemonic inputs, and 9 words buttons', async () => {
    render(
      <MnemonicConfirm {...callbacks} words={WORDS} positions={POSITIONS} />
    );

    for (const position of POSITIONS) {
      expect(screen.getByText(position)).toBeInTheDocument();
    }

    for (const word of WORDS) {
      expect(screen.getByText(word)).toBeInTheDocument();
    }

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(9);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(9);
  });

  it('should call onFilled function after all buttons are clicked', () => {
    render(
      <MnemonicConfirm words={WORDS} positions={POSITIONS} {...callbacks} />
    );
    const buttons = screen.getAllByRole('button');
    // randomize the order of the buttons
    buttons.sort(() => Math.random() - 0.5);
    // get the text on the buttons
    const words = buttons.map((button) => button.textContent);
    // click all the buttons
    buttons.forEach((button) => {
      fireEvent.click(button);
    });
    // expect the onFilled function to be called with the words in the order of the buttons
    expect(onFilled).toHaveBeenCalledWith(words);
  });
});
