type MnemonicInputProps = {
  value: string;
  index: number;
  isInvalid?: boolean;
  onChange: (val: string, index: number) => void;
  onPaste: (ev: React.ClipboardEvent<HTMLInputElement>, index: number) => void;
  onFocus?: (index: number) => void;
  onBlur?: () => void;
};

export function MnemonicInput({
  value,
  index,
  isInvalid,
  onChange,
  onPaste,
  onFocus,
  onBlur,
}: MnemonicInputProps) {
  return (
    <input
      value={value}
      onPaste={(ev) => onPaste(ev, index)}
      onChange={(ev) => onChange(ev.target.value, index)}
      onFocus={() => onFocus?.(index)}
      onBlur={onBlur}
      aria-invalid={isInvalid || undefined}
      aria-label={value || 'Enter word here'}
    />
  );
}
