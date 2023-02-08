import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { InputPassword, PasswordStrength, Stack } from '@fuel-ui/react';
import { useState } from 'react';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';

export type InputSecurePasswordProps = {
  onChangeStrength?: (strength: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  field: ControllerRenderProps<FieldValues, string> & {
    id: string;
  };
  css?: ThemeUtilsCSS;
};

export function InputSecurePassword({
  field,
  onChangeStrength,
  onBlur,
  placeholder = 'Type your password',
  ariaLabel = 'Your Password',
  css,
}: InputSecurePasswordProps) {
  const [passwordTooltipOpened, setPasswordTooltipOpened] = useState(false);

  return (
    <Stack css={{ ...styles.root, ...css }} gap={0}>
      <PasswordStrength
        onOpenChange={() => setPasswordTooltipOpened(true)}
        password={field.value || ''}
        open={passwordTooltipOpened}
        minLength={8}
        onChangeStrength={onChangeStrength}
        sideOffset={1}
        align="end"
      >
        <InputPassword
          {...field}
          onBlur={() => {
            setPasswordTooltipOpened(false);
            onBlur?.();
          }}
          onFocus={() => setPasswordTooltipOpened(true)}
          placeholder={placeholder}
          aria-label={ariaLabel}
        />
      </PasswordStrength>
    </Stack>
  );
}

const styles = {
  root: cssObj({
    '& [data-radix-popper-content-wrapper]': {
      zIndex: '1 !important',
    },
    '& .fuel_popover--arrow': {
      marginLeft: -140,
    },
  }),
};
