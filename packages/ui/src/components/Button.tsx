import type { MouseEvent, ReactElement, ReactNode } from 'react';
import { type Colors, cx, css as stitches } from '../css';
import type { Icons } from '../icons';
import { type BaseProps, render, forwardRef } from './Box';
import { Icon } from './Icon';
import { Spinner, Tooltip } from './Display';

export type ButtonIntent =
  | 'primary'
  | 'base'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'secondary';
export type ButtonVariant = 'solid' | 'outlined' | 'ghost' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<BaseProps, 'color'> & {
  intent?: ButtonIntent;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: Colors | ButtonIntent;
  leftIcon?: Icons | ReactElement;
  rightIcon?: Icons | ReactElement;
  leftIconAriaLabel?: string;
  rightIconAriaLabel?: string;
  iconSize?: number;
  isLoading?: boolean;
  loadingText?: ReactNode;
  isDisabled?: boolean;
  isLink?: boolean;
  justIcon?: boolean;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  onPress?: (e: MouseEvent<HTMLElement>) => void;
};

const ICON_SIZE: Record<ButtonSize, number> = {
  xs: 14,
  sm: 16,
  md: 16,
  lg: 18,
};

const SOLID: Record<string, { bg: string; hover: string; fg: string }> = {
  primary: { bg: '$primary', hover: '$primaryHover', fg: '$primaryForeground' },
  success: { bg: '$primary', hover: '$primaryHover', fg: '$primaryForeground' },
  base: {
    bg: '$secondary',
    hover: '$secondaryHover',
    fg: '$secondaryForeground',
  },
  info: {
    bg: '$secondary',
    hover: '$secondaryHover',
    fg: '$secondaryForeground',
  },
  error: { bg: '$danger', hover: '$red10', fg: '$white' },
  secondary: { bg: '$danger', hover: '$red10', fg: '$white' },
  warning: { bg: '$warning', hover: '$yellow10', fg: '$primaryForeground' },
};

const TEXT: Record<string, string> = {
  primary: '$brandText',
  success: '$brandText',
  base: '$textHigh',
  info: '$textHigh',
  error: '$dangerText',
  secondary: '$dangerText',
  warning: '$warningText',
};

/**
 * Mono uppercase labels, square corners. The solid primary button keeps the
 * Fuel chamfer: the bottom right corner is cut and a diagonal glyph sits in it.
 */
export const buttonStyle = stitches({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: 0,
  appearance: 'none',
  cursor: 'pointer',
  fontFamily: '$mono',
  fontWeight: '$medium',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  transition: 'background-color 300ms, color 300ms, box-shadow 300ms',
  '&:focus-visible': {
    outline: '2px solid $focus',
    outlineOffset: '2px',
  },
  '&[aria-disabled="true"]': {
    cursor: 'not-allowed',
  },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },

  variants: {
    size: {
      xs: { height: '28px', px: '10px', gap: '6px', fontSize: '11px' },
      sm: { height: '32px', px: '12px', gap: '$2', fontSize: '12px' },
      md: { height: '40px', px: '$4', gap: '$2', fontSize: '12px' },
      lg: { height: '44px', px: '20px', gap: '$2', fontSize: '13px' },
    },
    variant: {
      solid: {},
      outlined: { background: 'transparent' },
      ghost: { background: 'transparent' },
      link: {
        background: 'transparent',
        height: 'auto',
        px: '$1',
        py: '$1',
        textTransform: 'none',
        letterSpacing: 0,
        fontFamily: '$sans',
        fontSize: '$sm',
        '&:not([aria-disabled="true"]):hover': { textDecoration: 'underline' },
      },
    },
    intent: {
      primary: {},
      base: {},
      info: {},
      warning: {},
      error: {},
      success: {},
      secondary: {},
    },
    justIcon: {
      true: { aspectRatio: '1 / 1', px: 0 },
    },
    chamfer: {
      true: {
        clipPath: 'var(--fuel-chamfer-polygon)',
        paddingRight: 'calc($4 + 6px)',
        '&::after': {
          content: '""',
          position: 'absolute',
          right: '4px',
          bottom: '4px',
          width: '13px',
          height: '13px',
          background: 'currentColor',
          maskImage: 'var(--fuel-corner-glyph)',
          WebkitMaskImage: 'var(--fuel-corner-glyph)',
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          pointerEvents: 'none',
        },
      },
    },
  },

  compoundVariants: [
    ...Object.entries(SOLID).map(([intent, c]) => ({
      variant: 'solid' as const,
      intent: intent as ButtonIntent,
      css: {
        background: c.bg,
        color: c.fg,
        '&:not([aria-disabled="true"]):hover': { background: c.hover },
      },
    })),
    ...Object.entries(TEXT).flatMap(([intent, color]) => [
      {
        variant: 'outlined' as const,
        intent: intent as ButtonIntent,
        css: {
          color: intent === 'base' || intent === 'info' ? '$textHigh' : color,
          boxShadow:
            intent === 'base' || intent === 'info'
              ? 'inset 0 0 0 1px var(--fuel-border-light)'
              : 'inset 0 0 0 1px currentColor',
          '&:not([aria-disabled="true"]):hover': { background: '$muted' },
        },
      },
      {
        variant: 'ghost' as const,
        intent: intent as ButtonIntent,
        css: {
          color: intent === 'base' || intent === 'info' ? '$textMid' : color,
          '&:not([aria-disabled="true"]):hover': {
            background: '$muted',
            color: intent === 'base' || intent === 'info' ? '$textHigh' : color,
          },
        },
      },
      {
        variant: 'link' as const,
        intent: intent as ButtonIntent,
        css: { color: intent === 'base' ? '$textMid' : color },
      },
    ]),
    {
      variant: 'solid',
      css: {
        '&[aria-disabled="true"]': {
          background: '$muted',
          color: '$textDisabled',
          boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
        },
      },
    },
    {
      variant: 'outlined',
      css: {
        '&[aria-disabled="true"]': {
          color: '$textDisabled',
          boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
        },
      },
    },
    {
      variant: 'ghost',
      css: { '&[aria-disabled="true"]': { color: '$textDisabled' } },
    },
    {
      variant: 'link',
      css: {
        height: 'auto',
        '&[aria-disabled="true"]': { color: '$textDisabled' },
      },
    },
    {
      size: 'xs',
      chamfer: true,
      css: { paddingRight: '10px', '&::after': { display: 'none' } },
    },
  ],

  defaultVariants: {
    size: 'md',
    variant: 'solid',
    intent: 'base',
  },
});

function iconEl(
  icon: Icons | ReactElement | undefined,
  size: number,
  label?: string
) {
  if (!icon) return null;
  if (typeof icon === 'string') {
    return <Icon icon={icon} size={size} label={label} inline />;
  }
  return icon;
}

const INTENT_ALIASES = new Set(Object.keys(SOLID));

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      as = 'button',
      intent,
      variant = 'solid',
      size = 'md',
      color,
      leftIcon,
      rightIcon,
      leftIconAriaLabel,
      rightIconAriaLabel,
      iconSize,
      isLoading,
      loadingText,
      isDisabled,
      disabled: nativeDisabled,
      isLink,
      justIcon,
      onPress,
      onClick,
      className,
      css,
      children,
      type,
      ...props
    },
    ref
  ) {
    const resolvedIntent = (intent ??
      (color && INTENT_ALIASES.has(color) ? color : 'base')) as ButtonIntent;
    const disabled = Boolean(isDisabled || isLoading || nativeDisabled);
    const size_ = ICON_SIZE[size] ?? 16;
    const isButton = as === 'button';
    const chamfer =
      variant === 'solid' &&
      (resolvedIntent === 'primary' || resolvedIntent === 'success') &&
      !justIcon;

    /* Like react-aria's usePress, a press never also clicks a parent. */
    const handleClick = (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (disabled) {
        e.preventDefault();
        return;
      }
      onPress?.(e);
      onClick?.(e);
    };

    return render(
      as,
      cx(
        'fuel_Button',
        buttonStyle({
          size,
          variant,
          intent: resolvedIntent,
          justIcon,
          chamfer,
        }).className
      ),
      {
        ...props,
        className,
        css,
        ...(isButton && { type: type ?? 'button', disabled }),
        'aria-disabled': disabled || undefined,
        'aria-busy': isLoading || undefined,
        onClick: handleClick,
        children: (
          <>
            {isLoading ? (
              <Spinner size={size_} />
            ) : (
              iconEl(leftIcon, iconSize ?? size_, leftIconAriaLabel)
            )}
            {isLoading && loadingText ? loadingText : children}
            {!isLoading &&
              iconEl(rightIcon, iconSize ?? size_, rightIconAriaLabel)}
          </>
        ),
      },
      ref
    );
  }
);

export type IconButtonProps = Omit<
  ButtonProps,
  'children' | 'leftIcon' | 'rightIcon'
> & {
  icon: Icons | ReactElement;
  'aria-label'?: string;
  tooltip?: ReactNode;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      iconSize,
      size = 'md',
      variant = 'ghost',
      className,
      tooltip,
      ...props
    },
    ref
  ) {
    const s = iconSize ?? ICON_SIZE[size] ?? 16;
    const button = (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        justIcon
        className={cx('fuel_IconButton', className)}
        {...props}
      >
        {typeof icon === 'string' ? <Icon icon={icon} size={s} /> : icon}
      </Button>
    );
    return tooltip ? <Tooltip content={tooltip}>{button}</Tooltip> : button;
  }
);

export const ButtonLink = forwardRef<HTMLButtonElement, ButtonProps>(
  function ButtonLink(props, ref) {
    return <Button ref={ref} variant="link" {...props} />;
  }
);
