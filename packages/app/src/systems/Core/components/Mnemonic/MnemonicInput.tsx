import { useEffect, useState } from "react";

type MnemonicInputProps = {
  defaultValue: string;
  onChange: (val: string) => void;
  onPaste: (ev: React.ClipboardEvent<HTMLInputElement>) => void;
};

export function MnemonicInput({
  defaultValue,
  onChange,
  onPaste,
}: MnemonicInputProps) {
  const [value, setValue] = useState(() => defaultValue);

  useEffect(() => {
    if (value !== defaultValue) {
      onChange(value);
    }
  }, [value]);

  useEffect(() => {
    if (value !== defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <input
      value={value}
      onPaste={onPaste}
      onChange={(ev) => setValue(ev.target.value)}
    />
  );
}
