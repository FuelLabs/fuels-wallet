type MnemonicInputProps = {
  value: string;
  onChange: (val: string) => void;
  onPaste?: (ev: React.ClipboardEvent<HTMLInputElement>) => void;
  onFocus?: (ev: React.FocusEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
};

export function MnemonicInput({
  value,
  onChange,
  onPaste,
  onFocus,
  readOnly,
}: MnemonicInputProps) {
  return (
    <input
      role="textbox"
      value={value}
      onPaste={onPaste}
      onFocus={onFocus}
      onChange={(ev) => onChange(ev.target.value)}
      aria-label={value || 'Type your text'}
      readOnly={readOnly}
    />
  );
}
