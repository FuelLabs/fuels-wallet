import type { ReactNode } from 'react';
import { type Colors, type TextSizes, cx } from '../css';
import type { Icons } from '../icons';
import { type BaseProps, render, forwardRef } from './Box';
import { Icon } from './Icon';

type IconSlot = Icons | ReactNode;

function slot(icon: IconSlot | undefined, size?: number, color?: Colors) {
  if (!icon) return null;
  if (typeof icon === 'string') {
    return <Icon icon={icon as Icons} size={size} color={color} inline />;
  }
  return icon;
}

export type TextProps = Omit<BaseProps, 'color'> & {
  fontSize?: TextSizes;
  color?: Colors;
  leftIcon?: IconSlot;
  rightIcon?: IconSlot;
  iconSize?: number;
  iconColor?: Colors;
  iconAriaLabel?: string;
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    as = 'p',
    fontSize,
    color,
    leftIcon,
    rightIcon,
    iconSize = 16,
    iconColor,
    iconAriaLabel: _label,
    css,
    children,
    ...props
  },
  ref
) {
  const hasIcon = Boolean(leftIcon || rightIcon);
  return render(
    as,
    'fuel_Text',
    {
      ...props,
      css: {
        margin: 0,
        fontFamily: '$sans',
        color: color ? `$${color}` : 'inherit',
        ...(fontSize && { textSize: fontSize }),
        ...(hasIcon && {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '$2',
        }),
        ...css,
      },
      children: (
        <>
          {slot(leftIcon, iconSize, iconColor)}
          {children}
          {slot(rightIcon, iconSize, iconColor)}
        </>
      ),
    },
    ref
  );
});

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const HEADING_SIZE: Record<HeadingTag, TextSizes> = {
  h1: '4xl',
  h2: '3xl',
  h3: '2xl',
  h4: 'xl',
  h5: 'lg',
  h6: 'base',
};

export type HeadingProps = TextProps & { as?: HeadingTag };

export const Heading = forwardRef<HTMLElement, HeadingProps>(function Heading(
  { as = 'h2', css, fontSize, color = 'textHeading', className, ...props },
  ref
) {
  return (
    <Text
      ref={ref}
      as={as}
      color={color}
      fontSize={fontSize ?? HEADING_SIZE[as as HeadingTag] ?? 'xl'}
      className={cx('fuel_Heading', className)}
      css={{
        fontWeight: '$medium',
        letterSpacing: '-0.04em',
        ...css,
      }}
      {...props}
    />
  );
});

export type LinkProps = Omit<BaseProps, 'color'> & {
  href?: string;
  isExternal?: boolean;
  color?: Colors;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { as = 'a', isExternal, color = 'brandText', css, children, ...props },
  ref
) {
  return render(
    as,
    'fuel_Link',
    {
      ...props,
      ...(isExternal && { target: '_blank', rel: 'noopener noreferrer' }),
      css: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '$1',
        color: `$${color}`,
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        textDecorationColor:
          'color-mix(in srgb, currentColor 40%, transparent)',
        cursor: 'pointer',
        transition: 'text-decoration-color 200ms',
        '&:hover': { textDecorationColor: 'currentColor' },
        ...css,
      },
      children: (
        <>
          {children}
          {isExternal && <Icon icon="ExternalLink" size={14} inline />}
        </>
      ),
    },
    ref
  );
});
