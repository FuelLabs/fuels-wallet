import { cssObj } from '@fuel-ui/css';
import { Icon, IconButton, Input } from '@fuel-ui/react';

type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type InputFieldProps = Omit<HTMLInputProps, 'size'> & {
  htmlSize?: HTMLInputProps['size'];
};

export type SearchInputProps = Omit<InputFieldProps, 'onChange'> & {
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
};

export function SearchInput({
  value,
  onChange,
  isDisabled,
  ...props
}: SearchInputProps) {
  return (
    <Input css={styles.input} isDisabled={isDisabled}>
      <Input.ElementLeft element={<Icon icon={Icon.is('Search')} />} />
      <Input.Field
        {...props}
        autoComplete="off"
        type="search"
        id="search-input"
        /**
         * Since we already have type="search" we don't need role here, but
         * @fuel-ui automatically add role to input. So, we need to pass
         * role="null" in order to remove it and pass a11y tests
         * */
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        role={null as any}
        aria-label="Search"
        value={value || ''}
        placeholder="Search..."
        data-has-value={Boolean(value?.length)}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
      />
      <Input.ElementRight
        element={
          <IconButton
            variant="link"
            icon={Icon.is('X')}
            iconSize={16}
            aria-label="Clear search"
            onClick={() => {
              onChange?.('');
            }}
          />
        }
      />
    </Input>
  );
}

const styles = {
  input: cssObj({
    height: '$8',
    background: 'transparent',
    border: 'none',

    '.fuel_InputElement': {
      padding: 0,
    },
    '.fuel_InputElementRight > button': {
      padding: '$0 !important',
      display: 'none',
      mr: '$3',
    },

    '&:has(.fuel_Input:focus-visible) .fuel_Icon': {
      color: '$intentsPrimary9',
    },
    '&:has(.fuel_InputField[data-has-value="true"])': {
      '.fuel_InputElementRight > button': {
        display: 'block',
      },
    },

    '.fuel_InputField': {
      fontSize: '$sm',
    },
    'input[type="search" i]::-webkit-search-cancel-button': {
      display: 'none !important',
    },
  }),
};
