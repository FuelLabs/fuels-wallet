import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import type { ReactElement } from 'react';
import { cloneElement, isValidElement } from 'react';
import { type Colors, cx } from '../css';
import { ICONS, type Icons } from '../icons';
import { type BaseProps, render, forwardRef } from './Box';

export type IconProps = Omit<BaseProps, 'color'> & {
  icon: Icons | ReactElement;
  size?: number;
  stroke?: number;
  color?: Colors;
  label?: string;
  inline?: boolean;
  wrapperClassName?: string;
};

const IconRoot = forwardRef<HTMLElement, IconProps>(function Icon(
  {
    as = 'i',
    icon,
    size = 18,
    stroke = 1.5,
    color,
    label: initialLabel,
    inline,
    className,
    wrapperClassName,
    css,
    ...rest
  },
  ref
) {
  let label = initialLabel || rest['aria-label'];
  if (!label && typeof icon === 'string') label = `Icon ${icon}`;

  if (isValidElement(icon)) {
    return cloneElement(icon as ReactElement<Record<string, unknown>>, {
      ...rest,
      'aria-label': label,
      className: cx(wrapperClassName, className),
    });
  }

  const Svg = ICONS[icon as Icons];
  return render(
    as,
    cx('fuel_Icon', `fuel_Icon--${icon}`, wrapperClassName),
    {
      ...rest,
      role: 'img',
      'aria-label': label,
      css: {
        display: inline ? 'inline-flex' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...(color && { color: `$${color}` }),
        ...css,
      },
      children: (
        <>
          {Svg && (
            <Svg
              aria-hidden
              focusable={false}
              className={cx(`fuel_Icon-${icon}`, className)}
              size={size}
              strokeWidth={stroke}
            />
          )}
          <VisuallyHidden.Root>{label}</VisuallyHidden.Root>
        </>
      ),
    },
    ref
  );
});

export const Icon = Object.assign(IconRoot, {
  id: 'Icon',
  is: (icon: Icons) => icon,
});
