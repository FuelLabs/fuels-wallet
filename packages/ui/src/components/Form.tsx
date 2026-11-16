import * as RCheckbox from '@radix-ui/react-checkbox';
import * as RPopover from '@radix-ui/react-popover';
import * as RRadio from '@radix-ui/react-radio-group';
import * as RSwitch from '@radix-ui/react-switch';
import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
} from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import { type ThemeUtilsCSS, cx, css as stitches } from '../css';
import type { Icons } from '../icons';
import { type BaseProps, Box, Flex, render, forwardRef } from './Box';
import { Icon } from './Icon';
import { Text } from './Text';

/* ----------------------------------------------------------------------------
 * Form.Control carries the field state to the label, input and messages.
 * --------------------------------------------------------------------------*/

type FieldState = {
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  describedBy?: string;
};

const fieldCtx = createContext<FieldState>({});

export type FormControlProps = BaseProps & FieldState;

const FormControl = forwardRef<HTMLElement, FormControlProps>(
  function FormControl(
    { isRequired, isInvalid, isDisabled, isReadOnly, css, className, ...props },
    ref
  ) {
    const describedBy = useId();
    return (
      <fieldCtx.Provider
        value={{ isRequired, isInvalid, isDisabled, isReadOnly, describedBy }}
      >
        <Flex
          ref={ref}
          direction="column"
          gap="$2"
          className={cx('fuel_FormControl', className)}
          data-invalid={isInvalid || undefined}
          css={css}
          {...props}
        />
      </fieldCtx.Provider>
    );
  }
);

const labelStyle: ThemeUtilsCSS = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '$1',
  fontFamily: '$mono',
  fontSize: '12px',
  fontWeight: '$medium',
  lineHeight: '18px',
  letterSpacing: '0.6px',
  textTransform: 'uppercase',
  color: '$textLow',
};

const FormLabel = forwardRef<
  HTMLLabelElement,
  BaseProps & { htmlFor?: string }
>(function FormLabel({ css, children, ...props }, ref) {
  const { isRequired } = useContext(fieldCtx);
  return render(
    'label',
    cx('fuel_FormLabel', isRequired && 'fuel_FormLabel--required'),
    {
      ...props,
      css: { ...labelStyle, ...css },
      children: (
        <>
          {children}
          {isRequired && (
            <span aria-hidden style={{ color: 'var(--fuel-danger-text)' }}>
              *
            </span>
          )}
        </>
      ),
    },
    ref
  );
});

const FormErrorMessage = forwardRef<HTMLElement, BaseProps>(
  function FormErrorMessage({ css, ...props }, ref) {
    const { isInvalid, describedBy } = useContext(fieldCtx);
    if (!isInvalid) return null;
    return (
      <Text
        ref={ref}
        as="div"
        fontSize="sm"
        id={describedBy}
        className="fuel_FormErrorMessage"
        css={{ color: '$dangerText', ...css }}
        {...props}
      />
    );
  }
);

const FormHelperText = forwardRef<HTMLElement, BaseProps>(
  function FormHelperText({ css, ...props }, ref) {
    return (
      <Text
        ref={ref}
        as="div"
        fontSize="sm"
        className="fuel_FormHelperText"
        css={{ color: '$textLow', ...css }}
        {...props}
      />
    );
  }
);

export const Form = {
  Control: FormControl,
  Label: FormLabel,
  ErrorMessage: FormErrorMessage,
  HelperText: FormHelperText,
};

/* ----------------------------------------------------------------------------
 * Input: a hairline box on the card fill. Focus draws a 2px inset ring.
 * --------------------------------------------------------------------------*/

const inputCtx = createContext<FieldState>({});

export type InputSize = 'sm' | 'md' | 'lg';

export type InputProps = BaseProps &
  FieldState & {
    size?: InputSize;
  };

const INPUT_HEIGHT: Record<InputSize, string> = {
  sm: '32px',
  md: '40px',
  lg: '48px',
};

const InputRoot = forwardRef<HTMLElement, InputProps>(function Input(
  {
    size = 'md',
    isRequired,
    isInvalid,
    isDisabled,
    isReadOnly,
    css,
    className,
    ...props
  },
  ref
) {
  const parent = useContext(fieldCtx);
  const state = {
    isRequired: isRequired ?? parent.isRequired,
    isInvalid: isInvalid ?? parent.isInvalid,
    isDisabled: isDisabled ?? parent.isDisabled,
    isReadOnly: isReadOnly ?? parent.isReadOnly,
    describedBy: parent.describedBy,
  };
  return (
    <inputCtx.Provider value={state}>
      {render(
        'div',
        cx('fuel_Input', className),
        {
          ...props,
          'aria-disabled': state.isDisabled || undefined,
          'data-invalid': state.isInvalid || undefined,
          css: {
            display: 'flex',
            alignItems: 'center',
            gap: '$2',
            minHeight: INPUT_HEIGHT[size],
            px: '$3',
            background: '$card',
            boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
            color: '$textHigh',
            transition: 'box-shadow 200ms',
            '&:hover:not(:focus-within)': {
              boxShadow: 'inset 0 0 0 1px var(--fuel-element-low-em)',
            },
            '&:focus-within': {
              boxShadow: 'inset 0 0 0 2px var(--fuel-focus)',
            },
            '&[data-invalid="true"]': {
              boxShadow: 'inset 0 0 0 1px var(--fuel-danger)',
            },
            '&[data-invalid="true"]:focus-within': {
              boxShadow: 'inset 0 0 0 2px var(--fuel-danger)',
            },
            '&[aria-disabled="true"]': {
              background: '$muted',
              color: '$textDisabled',
              cursor: 'not-allowed',
            },
            ...css,
          },
        },
        ref
      )}
    </inputCtx.Provider>
  );
});

export const fieldStyle = stitches({
  flex: 1,
  minWidth: 0,
  alignSelf: 'stretch',
  padding: 0,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'inherit',
  fontFamily: '$sans',
  fontSize: '14px',
  '&::placeholder': { color: '$textLow' },
  '&:disabled': { cursor: 'not-allowed' },
  '@media (max-width: 639px)': { fontSize: '16px' },
});

function useFieldProps(props: { name?: string; placeholder?: string }) {
  const { isRequired, isDisabled, isReadOnly, isInvalid, describedBy } =
    useContext(inputCtx);
  return {
    disabled: isDisabled || isReadOnly,
    required: isRequired,
    'aria-describedby': isInvalid ? describedBy : undefined,
    'aria-required': isRequired,
    'aria-invalid': isInvalid,
    'aria-disabled': isDisabled,
    'aria-readonly': isReadOnly,
    'aria-placeholder': props.placeholder,
  };
}

export type InputFieldProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'size'
> & {
  css?: ThemeUtilsCSS;
  htmlSize?: number;
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ htmlSize, className, css, role, ...props }, ref) {
    const field = useFieldProps(props);
    return (
      <input
        ref={ref}
        role={
          role === undefined && props.type !== 'password' ? 'textbox' : role
        }
        size={htmlSize}
        {...field}
        {...props}
        className={cx(
          'fuel_InputField',
          fieldStyle(),
          css && stitches(css)(),
          className
        )}
      />
    );
  }
);

export type InputNumberProps = Omit<NumericFormatProps, 'size' | 'css'> & {
  css?: ThemeUtilsCSS;
  htmlSize?: number;
};

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  function InputNumber(
    { htmlSize, className, css, role = 'textbox', ...props },
    ref
  ) {
    const field = useFieldProps(props);
    return (
      <NumericFormat
        getInputRef={ref}
        role={role}
        size={htmlSize}
        {...field}
        {...props}
        className={cx(
          'fuel_InputField fuel_InputAmount',
          fieldStyle(),
          css && stitches(css)(),
          className
        )}
      />
    );
  }
);

export type InputElementProps = BaseProps & {
  element?: ReactNode;
  icon?: Icons | ReactElement;
  size?: InputSize;
};

function makeElement(side: 'Left' | 'Right') {
  return forwardRef<HTMLElement, InputElementProps>(function InputElement(
    { element, icon, size: _size, children, css, ...props },
    ref
  ) {
    return render(
      'div',
      `fuel_InputElement${side}`,
      {
        ...props,
        css: {
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          color: '$textLow',
          ...css,
        },
        children: (
          <>
            {icon &&
              (typeof icon === 'string' ? (
                <Icon icon={icon} size={16} />
              ) : (
                icon
              ))}
            {element}
            {children}
          </>
        ),
      },
      ref
    );
  });
}

export const Input = Object.assign(InputRoot, {
  id: 'Input',
  Field: InputField,
  Number: InputNumber,
  ElementLeft: makeElement('Left'),
  ElementRight: makeElement('Right'),
});

export type InputPasswordProps = InputFieldProps & {
  inputProps?: InputFieldProps;
  size?: InputSize;
  isDisabled?: boolean;
  isInvalid?: boolean;
};

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  function InputPassword(
    { size, css, isDisabled, isInvalid, inputProps, className, ...props },
    ref
  ) {
    const [visible, setVisible] = useState(false);
    return (
      <Input
        size={size}
        css={css}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
      >
        <Input.ElementLeft icon="Lock" />
        <Input.Field
          ref={ref}
          type={visible ? 'text' : 'password'}
          {...props}
          {...inputProps}
          className={cx('fuel_InputPassword', className)}
        />
        <Input.ElementRight>
          <button
            type="button"
            aria-label="Toggle Password"
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
            className={stitches({
              all: 'unset',
              display: 'inline-flex',
              cursor: 'pointer',
              color: '$textLow',
              '&:hover': { color: '$textHigh' },
              '&:focus-visible': {
                outline: '2px solid $focus',
                outlineOffset: '2px',
              },
            })()}
          >
            <Icon icon={visible ? 'Eye' : 'EyeClosed'} size={16} />
          </button>
        </Input.ElementRight>
      </Input>
    );
  }
);

/* ----------------------------------------------------------------------------
 * Password strength. The rules are the @fuel-ui ones, unchanged.
 * --------------------------------------------------------------------------*/

export type PasswordStrengthLevel = 'weak' | 'average' | 'strong';

export const PasswordDictionary: Record<PasswordStrengthLevel, string> = {
  strong: 'Strong',
  average: 'Average',
  weak: 'Weak',
};

export function passwordChecker(
  password: string,
  unsafeList: string[],
  minLength = 6
) {
  const symbolsAndDigitsChecker = /\d/.test(password) && /[_\W]/.test(password);
  const casingChecker = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const lengthChecker = password.length >= minLength;
  const commonChecker = Boolean(
    symbolsAndDigitsChecker &&
      casingChecker &&
      lengthChecker &&
      password?.trim() &&
      !unsafeList.includes(password)
  );
  return {
    lengthChecker,
    casingChecker,
    symbolsAndDigitsChecker,
    commonChecker,
  };
}

export function passwordStrengthCalculator(
  password: string,
  unsafeList: string[],
  minLength = 6
): PasswordStrengthLevel {
  const rules = Object.values(passwordChecker(password, unsafeList, minLength));
  const matched = rules.filter((rule) => rule === true).length;
  if (matched === 4) return 'strong';
  if (matched < 2) return 'weak';
  return 'average';
}

export function usePasswordStrength({
  password,
  minLength = 6,
  unsafeList,
}: {
  password: string;
  minLength?: number;
  unsafeList: string[];
}) {
  const checker = useMemo(
    () => passwordChecker(password, unsafeList, minLength),
    [password, unsafeList, minLength]
  );
  const strength = useMemo(
    () => passwordStrengthCalculator(password, unsafeList, minLength),
    [password, unsafeList, minLength]
  );
  return { checker, strength, label: PasswordDictionary[strength] };
}

const STRENGTH_FILL: Record<PasswordStrengthLevel, [number, string]> = {
  weak: [1, 'var(--fuel-danger)'],
  average: [2, 'var(--fuel-warning)'],
  strong: [3, 'var(--fuel-primary)'],
};

function StrengthIndicator({
  strength,
  className,
}: {
  strength: PasswordStrengthLevel;
  className?: string;
}) {
  const [filled, color] = STRENGTH_FILL[strength] ?? STRENGTH_FILL.weak;
  return (
    <Flex
      gap="2px"
      className={cx('fuel_PasswordStrength-indicator', className)}
      css={{ flex: 1 }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          data-strength={i < filled ? strength : undefined}
          css={{
            flex: 1,
            height: '4px',
            background: i < filled ? color : '$muted',
          }}
        />
      ))}
    </Flex>
  );
}

export type PasswordStrengthProps = {
  password: string;
  minLength?: number;
  unsafeList: string[];
  open?: boolean;
  children: ReactNode;
  onChangeStrength?: (strength: PasswordStrengthLevel) => void;
};

function Rule({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <Text
      fontSize="xs"
      leftIcon={<Icon icon={ok ? 'Check' : 'X'} size={14} data-error={ok} />}
      css={{ color: ok ? '$brandText' : '$textLow' }}
    >
      {children}
    </Text>
  );
}

function PasswordStrengthRoot({
  password,
  minLength = 6,
  unsafeList,
  open,
  children,
  onChangeStrength,
}: PasswordStrengthProps) {
  const { strength, label, checker } = usePasswordStrength({
    password,
    minLength,
    unsafeList,
  });
  useEffect(() => {
    onChangeStrength?.(strength);
  }, [strength, onChangeStrength]);
  return (
    <RPopover.Root open={open}>
      <RPopover.Anchor asChild>{children}</RPopover.Anchor>
      <RPopover.Portal>
        <RPopover.Content
          side="top"
          align="end"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={stitches({
            zIndex: 100,
            width: '220px',
            p: '$3',
            background: '$background',
            boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
            display: 'flex',
            flexDirection: 'column',
            gap: '$2',
          })()}
        >
          <Text css={{ ...labelStyle, color: '$textHigh' }}>{label}</Text>
          <StrengthIndicator strength={strength} />
          <Text fontSize="xs" css={{ color: '$textLow', mt: '$1' }}>
            A secure password should have:
          </Text>
          <Rule ok={checker.lengthChecker}>Min. {minLength} characteres</Rule>
          <Rule ok={checker.casingChecker}>Upper & lower case letters</Rule>
          <Rule ok={checker.symbolsAndDigitsChecker}>Numbers & Symbols</Rule>
          <Rule ok={checker.commonChecker}>Not common or insecure</Rule>
        </RPopover.Content>
      </RPopover.Portal>
    </RPopover.Root>
  );
}

export const PasswordStrength = Object.assign(PasswordStrengthRoot, {
  Indicator: StrengthIndicator,
});

/* ----------------------------------------------------------------------------
 * Checkbox, Switch, RadioGroup: square controls, green when on.
 * --------------------------------------------------------------------------*/

const focusRing = {
  '&:focus-visible': { outline: '2px solid $focus', outlineOffset: '2px' },
};

export type CheckboxProps = ComponentProps<typeof RCheckbox.Root> & {
  css?: ThemeUtilsCSS;
};

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox({ css, className, ...props }, ref) {
    return (
      <RCheckbox.Root
        ref={ref}
        className={cx(
          'fuel_Checkbox',
          stitches({
            all: 'unset',
            boxSizing: 'border-box',
            flexShrink: 0,
            width: '16px',
            height: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 0 1px var(--fuel-ring)',
            cursor: 'pointer',
            '&[data-state="checked"]': {
              background: '$primary',
              boxShadow: 'none',
              color: '$primaryForeground',
            },
            '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
            ...focusRing,
            ...css,
          })(),
          className
        )}
        {...props}
      >
        <RCheckbox.Indicator>
          <Icon icon="Check" size={12} stroke={2.5} />
        </RCheckbox.Indicator>
      </RCheckbox.Root>
    );
  }
);

export type SwitchProps = ComponentProps<typeof RSwitch.Root> & {
  css?: ThemeUtilsCSS;
  size?: 'sm' | 'md' | 'lg';
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch({ css, size: _size, className, ...props }, ref) {
    return (
      <RSwitch.Root
        ref={ref}
        className={cx(
          'fuel_Switch',
          stitches({
            all: 'unset',
            boxSizing: 'border-box',
            position: 'relative',
            flexShrink: 0,
            width: '32px',
            height: '18px',
            padding: '2px',
            background: '$muted',
            boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
            cursor: 'pointer',
            transition: 'background-color 200ms',
            '&[data-state="checked"]': {
              background: '$primary',
              boxShadow: 'none',
            },
            '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
            '& .fuel_Switch-thumb': {
              display: 'block',
              width: '14px',
              height: '14px',
              background: '$textLow',
              transition:
                'transform 200ms var(--fuel-ease-out), background-color 200ms',
            },
            '&[data-state="checked"] .fuel_Switch-thumb': {
              transform: 'translateX(14px)',
              background: '$primaryForeground',
            },
            ...focusRing,
            ...css,
          })(),
          className
        )}
        {...props}
      >
        <RSwitch.Thumb className="fuel_Switch-thumb" />
      </RSwitch.Root>
    );
  }
);

export type RadioGroupProps = ComponentProps<typeof RRadio.Root> & {
  css?: ThemeUtilsCSS;
};

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup({ css, className, ...props }, ref) {
    return (
      <RRadio.Root
        ref={ref}
        className={cx(
          'fuel_RadioGroup',
          stitches({
            display: 'flex',
            flexDirection: 'column',
            gap: '$2',
            ...css,
          })(),
          className
        )}
        {...props}
      />
    );
  }
);

export type RadioGroupItemProps = ComponentProps<typeof RRadio.Item> & {
  label?: ReactNode;
  labelCSS?: ThemeUtilsCSS;
  css?: ThemeUtilsCSS;
  checked?: boolean;
};

export const RadioGroupItem = forwardRef<
  HTMLButtonElement,
  RadioGroupItemProps
>(function RadioGroupItem(
  { label, labelCSS, css, id, className, checked: _c, ...props },
  ref
) {
  const autoId = useId();
  const itemId = id ?? autoId;
  return (
    <Flex align="center" gap="$2">
      <RRadio.Item
        ref={ref}
        id={itemId}
        className={cx(
          'fuel_RadioGroupItem',
          stitches({
            all: 'unset',
            boxSizing: 'border-box',
            flexShrink: 0,
            width: '16px',
            height: '16px',
            borderRadius: '$full',
            boxShadow: 'inset 0 0 0 1px var(--fuel-ring)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&[data-state="checked"]': {
              boxShadow: 'inset 0 0 0 1px var(--fuel-primary)',
            },
            '& span': {
              width: '8px',
              height: '8px',
              borderRadius: '$full',
              background: '$primary',
            },
            ...focusRing,
            ...css,
          })(),
          className
        )}
        aria-label={typeof label === 'string' ? label : undefined}
        {...props}
      >
        <RRadio.Indicator />
      </RRadio.Item>
      {label && (
        <label
          htmlFor={itemId}
          className={stitches({
            fontSize: '14px',
            color: '$textHigh',
            cursor: 'pointer',
            ...labelCSS,
          })()}
        >
          {label}
        </label>
      )}
    </Flex>
  );
});
