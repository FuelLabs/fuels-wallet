import type { MouseEvent, ReactNode } from 'react';
import { Children, createContext, useContext } from 'react';
import { cx } from '../css';
import type { Icons } from '../icons';
import {
  type BaseProps,
  Flex,
  type FlexProps,
  render,
  forwardRef,
} from './Box';
import { Icon } from './Icon';
import { Text } from './Text';

export type CardProps = BaseProps & {
  variant?: 'outlined' | 'ghost';
  solid?: boolean;
};

const CardRoot = forwardRef<HTMLElement, CardProps>(function Card(
  { as = 'article', css, variant = 'outlined', solid: _s, ...props },
  ref
) {
  return render(
    as,
    'fuel_Card',
    {
      ...props,
      css: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: variant === 'ghost' ? 'transparent' : '$card',
        boxShadow:
          variant === 'ghost' ? 'none' : 'inset 0 0 0 1px var(--fuel-line)',
        color: '$textMid',
        ...css,
      },
    },
    ref
  );
});

const CardHeader = forwardRef<
  HTMLElement,
  BaseProps & { space?: 'compact' | 'normal' }
>(function CardHeader({ as = 'header', css, space = 'normal', ...props }, ref) {
  return render(
    as,
    'fuel_Card-header',
    {
      ...props,
      css: {
        display: 'flex',
        alignItems: 'center',
        gap: '$2',
        px: '$4',
        py: space === 'compact' ? '$2' : '$3',
        borderBottom: '1px solid $line',
        color: '$textHigh',
        ...css,
      },
    },
    ref
  );
});

const CardBody = forwardRef<HTMLElement, BaseProps>(function CardBody(
  { as = 'div', css, ...props },
  ref
) {
  return render(
    as,
    'fuel_Card-body',
    { ...props, css: { p: '$4', flex: 1, ...css } },
    ref
  );
});

const CardFooter = forwardRef<HTMLElement, FlexProps>(function CardFooter(
  { as = 'footer', css, gap = '$2', align = 'center', ...props },
  ref
) {
  return (
    <Flex
      ref={ref}
      as={as}
      gap={gap}
      align={align}
      className={cx('fuel_Card-footer', props.className)}
      css={{ px: '$4', py: '$3', borderTop: '1px solid $line', ...css }}
      {...props}
    />
  );
});

export const Card = Object.assign(CardRoot, {
  id: 'Card',
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

type CardListCtx = { isClickable?: boolean };
const cardListCtx = createContext<CardListCtx>({});

export type CardListProps = FlexProps & {
  isClickable?: boolean;
  autoFocus?: boolean;
};

const CardListRoot = forwardRef<HTMLElement, CardListProps>(function CardList(
  { isClickable, autoFocus: _a, gap = '$2', className, ...props },
  ref
) {
  return (
    <cardListCtx.Provider value={{ isClickable }}>
      <Flex
        ref={ref}
        direction="column"
        gap={gap}
        className={cx('fuel_CardList', className)}
        {...props}
      />
    </cardListCtx.Provider>
  );
});

export type CardListItemProps = CardProps & {
  isActive?: boolean;
  rightEl?: ReactNode;
};

const ACTION = 'button, a, input, label, [role="menuitem"], [role="switch"]';

/**
 * Controls in the right slot (or their portaled menus) must not also
 * select the item; plain content there, like an amount, still does.
 */
function stopActionClick(e: MouseEvent<HTMLDivElement>) {
  const target = e.target as Element;
  const action = target.closest(ACTION);
  const portaled = !e.currentTarget.contains(target);
  if (portaled || (action && e.currentTarget.contains(action))) {
    e.stopPropagation();
  }
}

const CardListItem = forwardRef<HTMLElement, CardListItemProps>(
  function CardListItem(
    { isActive, rightEl, children, css, className, ...props },
    ref
  ) {
    const { isClickable } = useContext(cardListCtx);
    const clickable = isClickable || Boolean(props.onClick);
    return (
      <CardRoot
        ref={ref}
        data-is-active={isActive || undefined}
        className={cx('fuel_CardList-item', className)}
        css={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: '$3',
          px: '$3',
          py: '$3',
          ...(clickable && {
            cursor: 'pointer',
            transition: 'background-color 300ms, box-shadow 300ms',
            '@media (hover: hover)': {
              '&:hover': { background: '$muted' },
            },
          }),
          '&[data-is-active="true"]': {
            boxShadow:
              'inset 2px 0 0 0 var(--fuel-primary), inset 0 0 0 1px var(--fuel-line)',
          },
          '&[aria-disabled="true"]': { opacity: 0.6, cursor: 'not-allowed' },
          ...css,
        }}
        {...props}
      >
        <Flex align="center" gap="$3" css={{ flex: 1, minWidth: 0 }}>
          {children}
        </Flex>
        {rightEl && (
          <Flex align="center" onClick={stopActionClick}>
            {rightEl}
          </Flex>
        )}
      </CardRoot>
    );
  }
);

export const CardList = Object.assign(CardListRoot, {
  id: 'CardList',
  Item: CardListItem,
});

export type AlertStatus = 'info' | 'warning' | 'success' | 'error';

const STATUS: Record<AlertStatus, { icon: Icons; color: string; bar: string }> =
  {
    info: { icon: 'InfoCircle', color: '$textMid', bar: 'var(--fuel-ring)' },
    warning: {
      icon: 'AlertTriangle',
      color: '$warningText',
      bar: 'var(--fuel-warning)',
    },
    success: {
      icon: 'CircleCheck',
      color: '$brandText',
      bar: 'var(--fuel-primary)',
    },
    error: { icon: 'CircleX', color: '$dangerText', bar: 'var(--fuel-danger)' },
  };

const alertCtx = createContext<{ status: AlertStatus }>({ status: 'info' });

export type AlertProps = BaseProps & {
  status?: AlertStatus;
  hideIcon?: boolean;
  direction?: 'row' | 'column';
};

const AlertRoot = forwardRef<HTMLElement, AlertProps>(function Alert(
  {
    as = 'div',
    status = 'info',
    hideIcon,
    direction = 'column',
    css,
    children,
    ...props
  },
  ref
) {
  const s = STATUS[status] ?? STATUS.info;
  return (
    <alertCtx.Provider value={{ status }}>
      {render(
        as,
        'fuel_Alert',
        {
          ...props,
          'data-status': status,
          css: {
            display: 'flex',
            gap: '$3',
            p: '$3',
            background: '$card',
            boxShadow: `inset 2px 0 0 0 ${s.bar}, inset 0 0 0 1px var(--fuel-line)`,
            color: '$textMid',
            ...css,
          },
          children: (
            <>
              {!hideIcon && (
                <Flex
                  className="fuel_Alert-icon"
                  css={{ color: s.color, pt: '1px' }}
                >
                  <Icon icon={s.icon} size={16} />
                </Flex>
              )}
              <Flex
                className="fuel_Alert-content"
                direction={direction}
                gap="$1"
                css={{ flex: 1, minWidth: 0 }}
              >
                {Children.toArray(children)}
              </Flex>
            </>
          ),
        },
        ref
      )}
    </alertCtx.Provider>
  );
});

const AlertDescription = forwardRef<HTMLElement, BaseProps>(
  function AlertDescription({ as = 'div', css, className, ...props }, ref) {
    return (
      <Text
        ref={ref}
        as={as}
        fontSize="sm"
        className={cx('fuel_Alert-description', className)}
        css={{ color: '$textMid', ...css }}
        {...props}
      />
    );
  }
);

const AlertTitle = forwardRef<HTMLElement, BaseProps>(function AlertTitle(
  { as = 'h6', css, className, ...props },
  ref
) {
  const { status } = useContext(alertCtx);
  return (
    <Text
      ref={ref}
      as={as}
      className={cx('fuel_Alert-title fuel_Heading', className)}
      css={{
        fontFamily: '$mono',
        fontSize: '12px',
        fontWeight: '$medium',
        letterSpacing: '0.6px',
        textTransform: 'uppercase',
        color: STATUS[status]?.color,
        ...css,
      }}
      {...props}
    />
  );
});

const AlertActions = forwardRef<HTMLElement, FlexProps>(
  function AlertActions(props, ref) {
    return <Flex ref={ref} gap="$3" css={{ mt: '$2' }} {...props} />;
  }
);

export const Alert = Object.assign(AlertRoot, {
  id: 'Alert',
  Description: AlertDescription,
  Title: AlertTitle,
  Actions: AlertActions,
});
