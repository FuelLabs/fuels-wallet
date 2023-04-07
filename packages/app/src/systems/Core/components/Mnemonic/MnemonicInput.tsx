import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';

type MnemonicInputProps = {
  value: string;
  onChange: (val: string) => void;
  onPaste?: (ev: React.ClipboardEvent<HTMLInputElement>) => void;
  onFocus?: (ev: React.FocusEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
};

export const MnemonicInput = forwardRef(
  (
    { value, onChange, onPaste, onFocus, readOnly = false }: MnemonicInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input
        role="textbox"
        value={value}
        onPaste={onPaste}
        onFocus={onFocus}
        onChange={(ev) => (readOnly ? null : onChange(ev.target.value))}
        aria-label={value || 'Type your text'}
        readOnly={readOnly}
        ref={ref}
      />
    );
  }
);
