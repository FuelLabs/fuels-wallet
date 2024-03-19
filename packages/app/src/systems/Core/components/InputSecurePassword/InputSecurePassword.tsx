import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import type { InputPasswordProps } from '@fuel-ui/react';
import {
  Box,
  Icon,
  InputPassword,
  PasswordStrength,
  usePasswordStrength,
} from '@fuel-ui/react';
import unsafeList from '@fuel-ui/react/unsafe-passwords';
import { useEffect, useState } from 'react';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';

export type InputSecurePasswordProps = {
  onChangeStrength?: (strength: string) => void;
  onChange?: (e: never) => void;
  onBlur?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  field: ControllerRenderProps<FieldValues, string> & {
    id: string;
  };
  inputProps?: Partial<InputPasswordProps>;
  css?: ThemeUtilsCSS;
};

export function InputSecurePassword({
  inputProps,
  field,
  onChangeStrength,
  onChange,
  onBlur,
  placeholder = 'Type your password',
  ariaLabel = 'Your Password',
  css,
}: InputSecurePasswordProps) {
  const [passwordTooltipOpened, setPasswordTooltipOpened] = useState(false);
  const password = field.value || '';
  const { strength } = usePasswordStrength({
    minLength: 8,
    password,
    unsafeList,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    onChangeStrength?.(strength);
  }, [strength]);

  return (
    <Box.Stack css={{ ...styles.root, ...css }} gap={0}>
      <PasswordStrength
        password={password}
        open={passwordTooltipOpened}
        unsafeList={unsafeList}
      >
        <Box.Flex
          css={styles.indicator}
          align={'center'}
          gap={'$2'}
          onMouseEnter={() => setPasswordTooltipOpened(true)}
          onMouseLeave={() => setPasswordTooltipOpened(false)}
          aria-label="Password strength"
        >
          <PasswordStrength.Indicator
            strength={strength}
            className="indicator"
          />
          <Icon icon={Icon.is('ExclamationCircle')} color="intentsBase7" />
        </Box.Flex>
      </PasswordStrength>
      <InputPassword
        {...field}
        {...inputProps}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </Box.Stack>
  );
}

const styles = {
  indicator: cssObj({
    width: 80,
    alignSelf: 'flex-end',
    marginTop: -24,
    marginBottom: '$2',

    '& .indicator': {
      marginBottom: 0,
    },
  }),
  root: cssObj({
    '& [data-radix-popper-content-wrapper]': {
      zIndex: '1 !important',
    },
    '& .fuel_popover--arrow': {
      marginLeft: -140,
    },
  }),
};
