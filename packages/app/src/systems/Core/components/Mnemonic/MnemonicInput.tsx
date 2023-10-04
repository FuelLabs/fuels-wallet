type MnemonicInputProps = {
  value: string;
  index: number;
  onChange: (val: string, index: number) => void;
  onPaste: (ev: React.ClipboardEvent<HTMLInputElement>, index: number) => void;
};

export function MnemonicInput({
  value,
  index,
  onChange,
  onPaste,
}: MnemonicInputProps) {
  return (
    <input
      value={value}
      onPaste={(ev) => onPaste(ev, index)}
      onChange={(ev) => onChange(ev.target.value, index)}
      aria-label={value || 'Type your text'}
    />
  );
}
