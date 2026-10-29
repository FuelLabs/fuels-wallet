import * as RAvatar from '@radix-ui/react-avatar';
import * as RTooltip from '@radix-ui/react-tooltip';
import type {
  ComponentProps,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import ReactContentLoader from 'react-content-loader';
import { type Colors, colors, cx, keyframes, css as stitches } from '../css';
import type { Icons } from '../icons';
import {
  type BaseProps,
  Box,
  Flex,
  type FlexProps,
  render,
  forwardRef,
} from './Box';
import { popoverMotion } from '../motion';
import { Icon } from './Icon';
import { Text, type TextProps } from './Text';
import { toast } from './Toast';

/* ----------------------------------------------------------------------------
 * Tooltip
 * --------------------------------------------------------------------------*/

const tooltipContent = stitches({
  zIndex: 100,
  maxWidth: '260px',
  px: '$2',
  py: '6px',
  background: '$secondary',
  color: '$secondaryForeground',
  fontSize: '12px',
  lineHeight: '16px',
  boxShadow: 'none',
  ...popoverMotion,
  '& .fuel_TooltipArrow': { fill: '$secondary' },
});

export type TooltipProps = RTooltip.TooltipProps & {
  content: ReactNode;
  side?: RTooltip.TooltipContentProps['side'];
  align?: RTooltip.TooltipContentProps['align'];
  sideOffset?: number;
  alignOffset?: number;
  className?: string;
  arrowClassName?: string;
  as?: string;
  children?: ReactNode;
};

export function Tooltip({
  children,
  content,
  side = 'top',
  align,
  className,
  arrowClassName,
  sideOffset = 5,
  alignOffset,
  as: _as,
  ...props
}: TooltipProps) {
  if (!content) return <>{children}</>;
  return (
    <RTooltip.Provider delayDuration={props.delayDuration ?? 300}>
      <RTooltip.Root {...props}>
        <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
        <RTooltip.Portal>
          <RTooltip.Content
            className={cx('fuel_TooltipContent', tooltipContent(), className)}
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
          >
            <RTooltip.Arrow
              width={10}
              height={5}
              className={cx('fuel_TooltipArrow', arrowClassName)}
            />
            {content}
          </RTooltip.Content>
        </RTooltip.Portal>
      </RTooltip.Root>
    </RTooltip.Provider>
  );
}

/* ----------------------------------------------------------------------------
 * Spinner: a 2px square ring that rotates. Reduced motion pulses instead.
 * --------------------------------------------------------------------------*/

const spin = keyframes({ to: { transform: 'rotate(360deg)' } });
const pulse = keyframes({ '50%': { opacity: 0.4 } });

export type SpinnerProps = BaseProps & { size?: number; color?: Colors };

export const Spinner = forwardRef<HTMLElement, SpinnerProps>(function Spinner(
  { size = 16, color, css, ...props },
  ref
) {
  return render(
    'span',
    'fuel_Spinner',
    {
      role: 'status',
      'aria-label': 'Loading',
      ...props,
      css: {
        display: 'inline-block',
        flexShrink: 0,
        width: size,
        height: size,
        border: '2px solid currentColor',
        borderRightColor: 'transparent',
        borderRadius: '$full',
        color: color ? `$${color}` : 'currentColor',
        animation: `${spin} 700ms linear infinite`,
        '@media (prefers-reduced-motion: reduce)': {
          animation: `${pulse} 1.4s ease-in-out infinite`,
        },
        ...css,
      },
    },
    ref
  );
});

/* ----------------------------------------------------------------------------
 * Avatar. The generated gradient is the @fuel-ui algorithm, unchanged, so
 * account avatars stay the same for existing users.
 * --------------------------------------------------------------------------*/

const AVATAR_SIZES: Record<string, number> = {
  xsm: 24,
  xs: 20,
  sm: 32,
  md: 40,
  lg: 52,
  xl: 80,
  '2xl': 100,
};

function gradientDirection(hash: string) {
  const sum = hash
    .slice(4, 7)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `${sum}deg`;
}

export function hashToGradient(hash?: string): string {
  const length = hash?.length || 0;
  if (!hash || length === 0) return '$cardBg';
  let fixedHex = '';
  for (let i = 0; i < length; i++) {
    const char = hash.charAt(i);
    if (/\d/.test(char)) fixedHex += char;
  }
  if (fixedHex.length < 12) fixedHex += '0'.repeat(12 - fixedHex.length);
  const color1 = fixedHex.slice(0, 6);
  const color2 = fixedHex.slice(6, 12);
  return `linear-gradient(${gradientDirection(hash)}, #${color1}, #${color2})`;
}

export type AvatarSize = keyof typeof AVATAR_SIZES | number;

export type AvatarProps = Omit<BaseProps, 'size'> & {
  name: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
};

const AvatarRoot = forwardRef<HTMLElement, AvatarProps>(function Avatar(
  { name, src, alt, size = 'md', css, className, ...props },
  ref
) {
  const px = typeof size === 'number' ? size : (AVATAR_SIZES[size] ?? 40);
  return (
    <Box
      ref={ref}
      as={RAvatar.Root}
      className={cx('fuel_Avatar', className)}
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
        userSelect: 'none',
        width: px,
        height: px,
        borderRadius: '$full',
        background: '$muted',
        ...css,
      }}
      role="img"
      aria-label={alt || name}
      {...props}
    >
      <RAvatar.Image
        src={src}
        alt={alt || name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <RAvatar.Fallback
        className={stitches({
          fontFamily: '$mono',
          fontSize: '12px',
          color: '$textMid',
          textTransform: 'uppercase',
        })()}
      >
        {name
          .split(' ')
          .map((w) => w.slice(0, 1))
          .join('')}
      </RAvatar.Fallback>
    </Box>
  );
});

export type AvatarGeneratedProps = Omit<BaseProps, 'size'> & {
  hash: string;
  size?: AvatarSize;
};

const AvatarGenerated = forwardRef<HTMLElement, AvatarGeneratedProps>(
  function AvatarGenerated(
    { as = 'div', hash, size = 'md', css, ...props },
    ref
  ) {
    const px = typeof size === 'number' ? size : (AVATAR_SIZES[size] ?? size);
    return render(
      as,
      'fuel_Avatar-generated',
      {
        ...props,
        css: {
          display: 'inline-block',
          flexShrink: 0,
          overflow: 'hidden',
          borderRadius: '$full',
          width: px,
          height: px,
          background: hashToGradient(hash),
          ...css,
        },
      },
      ref
    );
  }
);

export const Avatar = Object.assign(AvatarRoot, {
  id: 'Avatar',
  Generated: AvatarGenerated,
});

/* ----------------------------------------------------------------------------
 * Badge and Tag: flat label chips, mono uppercase, hairline border.
 * --------------------------------------------------------------------------*/

const CHIP_COLOR: Record<string, string> = {
  primary: '$brandText',
  success: '$brandText',
  base: '$textMid',
  info: '$textMid',
  warning: '$warningText',
  error: '$dangerText',
};

export type BadgeProps = Omit<BaseProps, 'color'> & {
  variant?: 'solid' | 'outlined' | 'ghost';
  intent?: keyof typeof CHIP_COLOR;
  color?: keyof typeof CHIP_COLOR;
};

function chipCss(variant: string, intent: string) {
  const color = CHIP_COLOR[intent] ?? '$textMid';
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '$1',
    height: '20px',
    px: '6px',
    fontFamily: '$mono',
    fontSize: '11px',
    fontWeight: '$medium',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    color,
    background: variant === 'solid' ? '$muted' : 'transparent',
    boxShadow:
      variant === 'ghost' ? 'none' : 'inset 0 0 0 1px var(--fuel-border)',
  };
}

export const Badge = forwardRef<HTMLElement, BadgeProps>(function Badge(
  { as = 'span', variant = 'outlined', intent, color, css, ...props },
  ref
) {
  return render(
    as,
    'fuel_Badge',
    {
      ...props,
      css: { ...chipCss(variant, intent ?? color ?? 'base'), ...css },
    },
    ref
  );
});

export const Tag = forwardRef<HTMLElement, BadgeProps>(function Tag(
  { as = 'span', variant = 'outlined', intent, color, css, ...props },
  ref
) {
  return render(
    as,
    'fuel_Tag',
    {
      ...props,
      css: { ...chipCss(variant, intent ?? color ?? 'base'), ...css },
    },
    ref
  );
});

/* ----------------------------------------------------------------------------
 * ContentLoader: skeletons in the muted fill.
 * --------------------------------------------------------------------------*/

export type ContentLoaderProps = ComponentProps<typeof ReactContentLoader> & {
  isFullWidth?: boolean;
};

/** Accepts theme color names (`cardBg`) as well as raw colors. */
function loaderColor(value: string) {
  return (colors as Record<string, string>)[value] ?? value;
}

function ContentLoaderRoot({
  children,
  className,
  isFullWidth,
  backgroundColor = 'var(--fuel-muted)',
  foregroundColor = 'var(--fuel-gray-5)',
  style,
  ...props
}: ContentLoaderProps) {
  return (
    <ReactContentLoader
      speed={2}
      preserveAspectRatio="none"
      backgroundColor={loaderColor(backgroundColor)}
      foregroundColor={loaderColor(foregroundColor)}
      className={cx('fuel_ContentLoader', className)}
      style={{ width: isFullWidth ? '100%' : props.width, ...style }}
      {...props}
    >
      {children}
    </ReactContentLoader>
  );
}

const px = (v: unknown) =>
  Number.isNaN(Number(String(v).replace(/px/gi, ''))) ? v : `${v}px`;

export type ContentLoaderRectProps = ComponentProps<'rect'> & {
  stickX?: 'left' | 'right';
  stickY?: 'top' | 'bottom';
};

function Rect({ x, y, stickX, stickY, ...props }: ContentLoaderRectProps) {
  const fx =
    stickX === 'right' ? `calc(100% - ${px(x)} - ${px(props.width)})` : x;
  const fy =
    stickY === 'bottom' ? `calc(100% - ${px(y)} - ${px(props.height)})` : y;
  return <rect {...props} x={fx} y={fy} rx={0} ry={0} />;
}

export const ContentLoader = Object.assign(ContentLoaderRoot, { Rect });

/* ----------------------------------------------------------------------------
 * Image
 * --------------------------------------------------------------------------*/

export type ImageProps = Omit<BaseProps, 'onLoad' | 'onError'> &
  Omit<ComponentProps<'img'>, 'css'> & { isLoading?: boolean };

export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { isLoading: _l, ...props },
  ref
) {
  return render('img', 'fuel_Image', props, ref);
});

/* ----------------------------------------------------------------------------
 * FuelLogo: the Fuel mark on a dark square, in the brand green.
 * --------------------------------------------------------------------------*/

export type FuelLogoProps = BaseProps & { size?: number };

export function FuelLogo({
  size = 60,
  css,
  className,
  ...props
}: FuelLogoProps) {
  return render(
    'svg',
    'fuel_Logo',
    {
      viewBox: '0 0 344 344',
      role: 'img',
      'aria-label': 'Fuel logo',
      ...props,
      className,
      css: { width: size, height: size, flexShrink: 0, ...css },
      children: (
        <>
          <rect x="25" y="37" width="292" height="284" fill="#000" />
          <path
            d="M22.8744 0C10.2181 0 0 10.218 0 22.8744V344H284.626C294.246 344 303.497 340.179 310.308 333.368L333.368 310.308C340.179 303.497 344 294.246 344 284.626V0H22.8744ZM224.608 44.231L112.718 156.121C109.956 158.882 106.182 160.447 102.27 160.447C96.5631 160.447 91.3157 157.134 88.8763 151.978L45.5194 60.3402C41.9756 52.8383 47.4525 44.231 55.7374 44.231H224.608ZM44.231 299.769V190.916C44.231 185.117 48.9257 180.422 54.7249 180.422H163.577L44.231 299.769ZM172.598 160.447H136.559L244.998 52.0097C249.968 47.0382 256.734 44.231 263.776 44.231H299.814L191.377 152.668C186.407 157.64 179.64 160.447 172.598 160.447Z"
            fill="var(--fuel-brand-600)"
          />
        </>
      ),
    },
    undefined
  );
}

/* ----------------------------------------------------------------------------
 * List: rows with a leading icon, or the 8px brand square by default.
 * --------------------------------------------------------------------------*/

type ListCtx = { icon?: Icons; iconColor?: Colors };
const listCtx = createContext<ListCtx>({});

export type ListProps = BaseProps & ListCtx;

function ListRoot({ icon, iconColor, children, css, ...props }: ListProps) {
  return render(
    'ul',
    'fuel_List',
    {
      ...props,
      'data-icon': icon,
      css: {
        listStyle: 'none',
        m: 0,
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '$2',
        ...css,
      },
      children: (
        <listCtx.Provider value={{ icon, iconColor }}>
          {children}
        </listCtx.Provider>
      ),
    },
    undefined
  );
}

function ListItem({
  children,
  css,
  icon,
  iconColor,
  ...props
}: BaseProps & ListCtx) {
  const list = useContext(listCtx);
  const i = icon ?? list.icon;
  const c = iconColor ?? list.iconColor;
  return render(
    'li',
    'fuel_ListItem',
    {
      ...props,
      css: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '$2',
        color: '$textMid',
        ...css,
      },
      children: (
        <>
          {i ? (
            <Icon icon={i} color={c} size={16} css={{ mt: '2px' }} />
          ) : (
            <span className="fuel-square" style={{ marginTop: 6 }} />
          )}
          <span>{children}</span>
        </>
      ),
    },
    undefined
  );
}

export const List = Object.assign(ListRoot, { Item: ListItem });

/* ----------------------------------------------------------------------------
 * Copyable and HelperIcon
 * --------------------------------------------------------------------------*/

export type CopyableProps = FlexProps & {
  value: string;
  tooltipMessage?: string;
  iconProps?: Record<string, unknown> & { icon?: Icons };
};

export function Copyable({
  children,
  value,
  tooltipMessage = 'Click here to copy to clipboard',
  iconProps,
  className,
  ...props
}: CopyableProps) {
  const { icon = 'Copy', ...buttonProps } = iconProps ?? {};
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Copied to clipboard');
  }
  return (
    <Flex
      align="center"
      gap="$2"
      className={cx('fuel_Copyable', className)}
      {...props}
    >
      {children}
      <Tooltip content={tooltipMessage}>
        <button
          type="button"
          aria-label="Copy to clipboard"
          onClick={handleCopy}
          className={cx(
            'fuel_copyable-icon',
            stitches({
              all: 'unset',
              display: 'inline-flex',
              cursor: 'pointer',
              color: '$textLow',
              transition: 'color 200ms',
              '&:hover': { color: '$textHigh' },
              '&:focus-visible': {
                outline: '2px solid $focus',
                outlineOffset: '2px',
              },
            })()
          )}
          {...buttonProps}
        >
          {copied ? (
            <Icon
              key="check"
              icon="Check"
              size={16}
              className="fuel-appear"
              css={{ color: '$intentsPrimary9' }}
            />
          ) : (
            <Icon key="copy" icon={icon} size={16} />
          )}
        </button>
      </Tooltip>
    </Flex>
  );
}

export type HelperIconProps = TextProps & {
  message: ReactNode;
  iconSize?: number;
  icon?: Icons | ReactElement;
};

export function HelperIcon({
  message,
  iconSize = 14,
  icon = 'InfoCircle',
  children,
  ...props
}: HelperIconProps) {
  return (
    <Text
      as="div"
      fontSize="sm"
      {...props}
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '$1',
        ...props.css,
      }}
    >
      {children}
      <Tooltip content={message}>
        <Icon
          icon={icon}
          size={iconSize}
          tabIndex={0}
          css={{ color: '$textLow', cursor: 'help' }}
          className="fuel_HelperIcon"
        />
      </Tooltip>
    </Text>
  );
}
