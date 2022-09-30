/* eslint-disable no-restricted-syntax */
import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { Mnemonic } from './Mnemonic';

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

describe('Mnemonic', () => {
  describe('type: read', () => {
    it('a11y', async () => {
      await testA11y(<Mnemonic value={WORDS} type="read" />);
    });

    it('should show mnemonic words', async () => {
      render(<Mnemonic value={WORDS} type="read" />);

      for (const word of WORDS) {
        expect(screen.getByText(word)).toBeInTheDocument();
      }
    });

    it('should be able to copy mnemonic words', async () => {
      const { user } = render(<Mnemonic value={WORDS} type="read" />);

      const btn = screen.getByLabelText(/copy button/i);
      expect(btn).toBeInTheDocument();

      await user.click(btn);
      expect(await navigator.clipboard.readText()).toBe(WORDS.join(' '));
    });
  });

  describe('type: write', () => {
    it('a11y', async () => {
      await testA11y(<Mnemonic value={WORDS} type="write" />);
    });

    it('should be able to paste using paste button', async () => {
      const { user } = render(<Mnemonic type="write" />);
      await navigator.clipboard.writeText(WORDS.join(' '));

      const btn = screen.getByLabelText(/paste button/i);
      expect(btn).toBeInTheDocument();

      await user.click(btn);

      for (const word of WORDS) {
        expect(screen.getByLabelText(word)).toBeInTheDocument();
      }
    });

    it('should paste into all inputs when paste on first input', async () => {
      const { user } = render(<Mnemonic type="write" />);
      await navigator.clipboard.writeText(WORDS.join(' '));

      const firstInput = screen.getAllByRole('textbox')[0];
      await user.tab();
      expect(firstInput).toHaveFocus();
      await user.paste();

      for (const word of WORDS) {
        expect(screen.getByLabelText(word)).toBeInTheDocument();
      }
    });
  });
});
