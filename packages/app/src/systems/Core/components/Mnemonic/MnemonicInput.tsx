type MnemonicInputProps = {
  value: string;
  onChange: (val: string) => void;
  onPaste: (ev: React.ClipboardEvent<HTMLInputElement>) => void;
};

export function MnemonicInput({
  value,
  onChange,
  onPaste,
}: MnemonicInputProps) {
  return (
    <input
      role="textbox"
      value={value}
      onPaste={onPaste}
      onChange={(ev) => onChange(ev.target.value)}
      aria-label={value || 'Type your text'}
    />
  );
}
