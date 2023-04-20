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
  'sick',
  'squeamish',
  'sugar',
  'dumb',
  'left',
  'reveal',
  'bounce',
  'giant',
  'exotic',
  'rhythm',
  'taste',
  'quartz',
  'butter',
  'erupt',
  'proud',
];

const POSITIONS = [4, 5, 7, 3, 2, 6, 8, 1, 9];

const MNEMONIC_LENGTH = 24;

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

  it('should render the correct amount of mnemonic inputs', async () => {
    await render(
      <MnemonicConfirm
        {...callbacks}
        words={WORDS}
        positions={POSITIONS}
        mnemonicLength={MNEMONIC_LENGTH}
      />
    );

    for (const position of POSITIONS) {
      expect(screen.getByText(position)).toBeInTheDocument();
    }

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(MNEMONIC_LENGTH);
  });

  it('should call onFilled function after all inputs are filled', async () => {
    render(
      <MnemonicConfirm words={WORDS} positions={POSITIONS} {...callbacks} />
    );
    // get all the empty inputs
    const inputs = screen.getAllByRole('textbox');
    const emptyInputs = inputs.filter((input) => input.textContent === '');
    const emptyInputsIndex = [] as number[];
    inputs.forEach((input, index) => {
      if (input.textContent === '') {
        emptyInputsIndex.push(index);
      }
    });
    // fill them all with the correct words from the words array, using the position - 1 as the index
    // wait for the onFilled function to be called with the words in the order of the input
    // console.log(emptyInputsIndex)
    // console.log(emptyInputs)
    await Promise.all([
      ...emptyInputs.map(async (input, index) => {
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, index * 100));
        // console.log(input)
        fireEvent.change(input, {
          target: { value: WORDS[emptyInputsIndex[index]] },
        });
      }),
    ]);
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // expect the onFilled function to be called with the words in the order of the buttons
    expect(onFilled).toHaveBeenCalledWith(WORDS);
  });
});
