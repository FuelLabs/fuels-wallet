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
      <Input.ElementLeft element={<Icon icon={Icon.is('MagnifyingGlass')} />} />
      <Input.Field
        {...props}
        type="search"
        /**
         * Since we already have type="search" we don't need role here, but
         * @fuel-ui automatically add role to input. So, we need to pass
         * role="null" in order to remove it and pass a11y tests
         * */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            onClick={(e) => {
              console.log(e);
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
    height: '$6',
    background: 'transparent',

    '&:focus-within': {
      borderColor: 'transparent',
    },
    '.fuel_input--element': {
      padding: 0,
    },
    '.fuel_input-element--right > button': {
      padding: '$0 !important',
      display: 'none',
      mr: '$3',
    },

    '&:has(.fuel_input:focus-visible) .fuel-icon': {
      color: '$accent9',
    },
    '&:has(.fuel_input--field[data-has-value="true"])': {
      '.fuel_input-element--right > button': {
        display: 'block',
      },
    },

    '.fuel_input--field': {
      fontSize: '$sm',
    },
    'input[type="search" i]::-webkit-search-cancel-button': {
      display: 'none !important',
    },
  }),
};
