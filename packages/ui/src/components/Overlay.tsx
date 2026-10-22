import * as RAlert from '@radix-ui/react-alert-dialog';
import * as RDialog from '@radix-ui/react-dialog';
import * as RDropdown from '@radix-ui/react-dropdown-menu';
import * as RPopover from '@radix-ui/react-popover';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type {
  ComponentPropsWithoutRef,
  Key,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react';
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { type ThemeUtilsCSS, cx, keyframes, css as stitches } from '../css';
import {
  type BaseProps,
  Flex,
  type FlexProps,
  render,
  forwardRef,
} from './Box';
import {
  CLOSED,
  OPEN,
  dialogIn,
  dialogOut,
  fadeIn,
  fadeOut,
  popoverMotion,
  reduced,
} from '../motion';
import { Heading } from './Text';

const scrim = stitches({
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  background: '$scrim',
  [`&${OPEN}`]: { animation: `${fadeIn} 200ms var(--fuel-ease-out)` },
  [`&${CLOSED}`]: {
    animation: `${fadeOut} 180ms var(--fuel-ease-in) forwards`,
  },
});

const surface = stitches({
  position: 'fixed',
  zIndex: 51,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  width: 'calc(100% - 32px)',
  maxHeight: 'calc(100% - 32px)',
  background: '$card',
  color: '$textMid',
  boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
  borderRadius: 0,
  outline: 'none',
  [`&${OPEN}`]: { animation: `${dialogIn} 300ms var(--fuel-ease-out)` },
  [`&${CLOSED}`]: {
    animation: `${dialogOut} 180ms var(--fuel-ease-in) forwards`,
  },
  [reduced]: {
    [`&${OPEN}`]: { animation: `${fadeIn} 200ms var(--fuel-ease-out)` },
    [`&${CLOSED}`]: {
      animation: `${fadeOut} 150ms var(--fuel-ease-in) forwards`,
    },
  },
});

const headingCss: ThemeUtilsCSS = {
  m: 0,
  p: '$4',
  pb: '$2',
  fontSize: '$lg',
  color: '$textHigh',
};

const footerCss: ThemeUtilsCSS = {
  p: '$4',
  pt: '$2',
  gap: '$2',
  justifyContent: 'flex-end',
};

/* ----------------------------------------------------------------------------
 * Dialog
 * --------------------------------------------------------------------------*/

const dialogCtx = createContext<{ isBlocked?: boolean }>({});

export type DialogProps = {
  isOpen?: boolean;
  defaultOpen?: boolean;
  isBlocked?: boolean;
  isDismissable?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

function DialogRoot({
  isOpen,
  defaultOpen,
  isBlocked,
  onOpenChange,
  children,
}: DialogProps) {
  return (
    <dialogCtx.Provider value={{ isBlocked }}>
      <RDialog.Root
        open={isOpen}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        {children}
      </RDialog.Root>
    </dialogCtx.Provider>
  );
}

const DialogContent = forwardRef<
  HTMLDivElement,
  BaseProps & { container?: HTMLElement | null }
>(function DialogContent(
  { css, className, children, container, ...props },
  ref
) {
  const { isBlocked } = useContext(dialogCtx);
  const block = (e: Event) => isBlocked && e.preventDefault();
  return (
    <RDialog.Portal container={container}>
      <RDialog.Overlay className={cx('fuel_Dialog-overlay', scrim())} />
      <RDialog.Content
        ref={ref}
        aria-describedby={undefined}
        onEscapeKeyDown={block}
        onPointerDownOutside={block}
        onInteractOutside={block}
        {...props}
        className={cx(
          'fuel_Dialog-content',
          surface(),
          stitches({ maxWidth: '350px', ...css })(),
          className
        )}
      >
        {children}
      </RDialog.Content>
    </RDialog.Portal>
  );
});

const DialogHeading = forwardRef<HTMLHeadingElement, BaseProps>(
  function DialogHeading(
    { as = 'h2', css, className, children, ...props },
    ref
  ) {
    return (
      <RDialog.Title asChild>
        <Heading
          ref={ref}
          as={as as 'h2'}
          className={cx('fuel_Dialog-heading', className)}
          css={{ ...headingCss, ...css }}
          {...props}
        >
          {children}
        </Heading>
      </RDialog.Title>
    );
  }
);

const DialogDescription = forwardRef<HTMLElement, BaseProps>(
  function DialogDescription({ as = 'div', css, ...props }, ref) {
    return render(
      as,
      'fuel_Dialog-description',
      { ...props, css: { px: '$4', py: '$2', fontSize: '$sm', ...css } },
      ref
    );
  }
);

const DialogFooter = forwardRef<HTMLElement, FlexProps>(function DialogFooter(
  { as = 'footer', css, className, ...props },
  ref
) {
  return (
    <Flex
      ref={ref}
      as={as}
      align="center"
      className={cx('fuel_Dialog-footer', className)}
      css={{ ...footerCss, ...css }}
      {...props}
    />
  );
});

function DialogClose({ children }: { children: ReactElement }) {
  return <RDialog.Close asChild>{children}</RDialog.Close>;
}

function DialogTrigger({ children }: { children: ReactElement }) {
  return <RDialog.Trigger asChild>{children}</RDialog.Trigger>;
}

export const Dialog = Object.assign(DialogRoot, {
  id: 'Dialog',
  Content: DialogContent,
  Heading: DialogHeading,
  Description: DialogDescription,
  Footer: DialogFooter,
  Close: DialogClose,
  Trigger: DialogTrigger,
});

/* ----------------------------------------------------------------------------
 * AlertDialog
 * --------------------------------------------------------------------------*/

export type AlertDialogProps = RAlert.AlertDialogProps;

const AlertDialogContent = forwardRef<HTMLDivElement, BaseProps>(
  function AlertDialogContent({ css, className, children, ...props }, ref) {
    return (
      <RAlert.Portal>
        <RAlert.Overlay className={cx('fuel_AlertDialog-overlay', scrim())} />
        <RAlert.Content
          ref={ref}
          {...props}
          className={cx(
            'fuel_AlertDialog-content',
            surface(),
            stitches({ maxWidth: '300px', py: '$2', ...css })(),
            className
          )}
        >
          {children}
        </RAlert.Content>
      </RAlert.Portal>
    );
  }
);

const AlertDialogHeading = forwardRef<HTMLHeadingElement, BaseProps>(
  function AlertDialogHeading(
    { as = 'h2', css, className, children, ...props },
    ref
  ) {
    return (
      <RAlert.Title asChild>
        <Heading
          ref={ref}
          as={as as 'h2'}
          className={cx('fuel_AlertDialog-heading', className)}
          css={{ ...headingCss, ...css }}
          {...props}
        >
          {children}
        </Heading>
      </RAlert.Title>
    );
  }
);

const AlertDialogDescription = forwardRef<HTMLDivElement, BaseProps>(
  function AlertDialogDescription({ css, className, children, ...props }, ref) {
    return (
      <RAlert.Description asChild>
        <div
          ref={ref}
          {...props}
          className={cx(
            'fuel_AlertDialog-description fuel_AlertDialogDescription',
            stitches({ m: 0, px: '$4', py: '$2', fontSize: '$sm', ...css })(),
            className
          )}
        >
          {children}
        </div>
      </RAlert.Description>
    );
  }
);

const AlertDialogFooter = forwardRef<HTMLElement, FlexProps>(
  function AlertDialogFooter({ css, className, ...props }, ref) {
    return (
      <Flex
        ref={ref}
        as="footer"
        align="center"
        className={cx('fuel_AlertDialog-footer', className)}
        css={{ ...footerCss, ...css }}
        {...props}
      />
    );
  }
);

const asChild =
  (Comp: typeof RAlert.Trigger | typeof RAlert.Cancel | typeof RAlert.Action) =>
  ({ children }: { children?: ReactNode }) => (
    <Comp asChild>
      {isValidElement(children) ? children : <span>{children}</span>}
    </Comp>
  );

export const AlertDialog = Object.assign(
  (props: AlertDialogProps) => <RAlert.Root {...props} />,
  {
    id: 'AlertDialog',
    Trigger: asChild(RAlert.Trigger),
    Content: AlertDialogContent,
    Heading: AlertDialogHeading,
    Description: AlertDialogDescription,
    Footer: AlertDialogFooter,
    Cancel: asChild(RAlert.Cancel),
    Action: asChild(RAlert.Action),
  }
);

/* ----------------------------------------------------------------------------
 * Drawer: a dialog that slides from one side, optionally inside a container.
 * --------------------------------------------------------------------------*/

type DrawerSide = 'left' | 'right';

const drawerCtx = createContext<{
  side: DrawerSide;
  size: number | string;
  container: HTMLElement | null;
  shouldCloseOnClickAway?: boolean;
}>({ side: 'right', size: 280, container: null });

export type DrawerProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  side?: DrawerSide;
  size?: number | string;
  isDismissable?: boolean;
  shouldCloseOnClickAway?: boolean;
  containerRef?: RefObject<HTMLElement>;
  children?: ReactNode;
};

function DrawerRoot({
  isOpen,
  onClose,
  onOpenChange,
  side = 'right',
  size = 280,
  shouldCloseOnClickAway = true,
  containerRef,
  children,
}: DrawerProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (containerRef?.current) setContainer(containerRef.current);
  }, [containerRef?.current]);

  return (
    <drawerCtx.Provider
      value={{ side, size, container, shouldCloseOnClickAway }}
    >
      <RDialog.Root
        open={isOpen}
        onOpenChange={(open) => {
          onOpenChange?.(open);
          if (!open) onClose?.();
        }}
      >
        {children}
      </RDialog.Root>
    </drawerCtx.Provider>
  );
}

const slideIn = (from: string) =>
  keyframes({
    from: { transform: `translateX(${from})` },
    to: { transform: 'translateX(0)' },
  });
const slideOut = (to: string) =>
  keyframes({
    from: { transform: 'translateX(0)' },
    to: { transform: `translateX(${to})` },
  });

const DrawerContent = forwardRef<HTMLDivElement, BaseProps>(
  function DrawerContent({ css, className, children, ...props }, ref) {
    const { side, size, container, shouldCloseOnClickAway } =
      useContext(drawerCtx);
    const position = container ? 'absolute' : 'fixed';
    const offscreen = side === 'right' ? '100%' : '-100%';
    return (
      <RDialog.Portal container={container}>
        <RDialog.Overlay
          className={cx(
            'fuel_Drawer-overlay',
            scrim(),
            stitches({ position })()
          )}
        />
        <RDialog.Content
          ref={ref}
          aria-describedby={undefined}
          onPointerDownOutside={(e) =>
            !shouldCloseOnClickAway && e.preventDefault()
          }
          {...props}
          className={cx(
            'fuel_DrawerContent',
            stitches({
              position,
              top: 0,
              bottom: 0,
              [side]: 0,
              zIndex: 51,
              width: typeof size === 'number' ? `${size}px` : size,
              maxWidth: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: '$background',
              boxShadow:
                side === 'right'
                  ? 'inset 1px 0 0 0 var(--fuel-line)'
                  : 'inset -1px 0 0 0 var(--fuel-line)',
              outline: 'none',
              [`&${OPEN}`]: {
                animation: `${slideIn(offscreen)} 300ms var(--fuel-ease-out)`,
              },
              [`&${CLOSED}`]: {
                animation: `${slideOut(offscreen)} 200ms var(--fuel-ease-in) forwards`,
              },
              [reduced]: {
                [`&${OPEN}`]: {
                  animation: `${fadeIn} 200ms var(--fuel-ease-out)`,
                },
                [`&${CLOSED}`]: {
                  animation: `${fadeOut} 150ms var(--fuel-ease-in) forwards`,
                },
              },
              ...css,
            })(),
            className
          )}
        >
          <VisuallyHidden asChild>
            <RDialog.Title>Menu</RDialog.Title>
          </VisuallyHidden>
          {children}
        </RDialog.Content>
      </RDialog.Portal>
    );
  }
);

const DrawerBody = forwardRef<HTMLElement, BaseProps>(function DrawerBody(
  { as = 'div', css, ...props },
  ref
) {
  return render(
    as,
    'fuel_DrawerBody',
    {
      ...props,
      css: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        ...css,
      },
    },
    ref
  );
});

export const Drawer = Object.assign(DrawerRoot, {
  id: 'Drawer',
  Content: DrawerContent,
  Body: DrawerBody,
  Close: DialogClose,
  Trigger: DialogTrigger,
});

/* ----------------------------------------------------------------------------
 * Menu items share one look: 36px rows, hover fill, mono icons.
 * --------------------------------------------------------------------------*/

const menuItemStyle = stitches({
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  minHeight: '36px',
  px: '$3',
  boxSizing: 'border-box',
  fontSize: '$sm',
  color: '$textHigh',
  cursor: 'pointer',
  userSelect: 'none',
  outline: 'none',
  transition: 'background-color 150ms',
  '&:hover, &[data-highlighted], &:focus-visible': { background: '$muted' },
  '&:focus-visible': { boxShadow: 'inset 0 0 0 2px var(--fuel-focus)' },
  '&[data-disabled], &[aria-disabled="true"]': {
    color: '$textDisabled',
    cursor: 'not-allowed',
  },
  '& .fuel_Icon': { color: '$textLow' },
});

/** Calls `onAction` with each child's React key, the way the old menus did. */
function withActions(
  children: ReactNode,
  onAction?: (key: Key) => void,
  disabledKeys?: Key[]
) {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const key = child.key ?? '';
    type ItemProps = {
      __onAction?: () => void;
      isDisabled?: boolean;
      'data-key'?: string;
    };
    return cloneElement(child as ReactElement<ItemProps>, {
      __onAction: () => onAction?.(key),
      'data-key': String(key),
      ...(disabledKeys?.includes(key) && { isDisabled: true }),
    });
  });
}

/* ----------------------------------------------------------------------------
 * Dropdown
 * --------------------------------------------------------------------------*/

type PopoverProps = {
  arrowClassName?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  alignOffset?: number;
};

const dropdownCtx = createContext<{ popoverProps?: PopoverProps }>({});

export type DropdownProps = {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  popoverProps?: PopoverProps;
  css?: ThemeUtilsCSS;
  children?: ReactNode;
};

function DropdownRoot({
  isOpen,
  defaultOpen,
  onOpenChange,
  popoverProps,
  children,
}: DropdownProps) {
  return (
    <dropdownCtx.Provider value={{ popoverProps }}>
      <RDropdown.Root
        open={isOpen}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        modal={false}
      >
        {children}
      </RDropdown.Root>
    </dropdownCtx.Provider>
  );
}

function DropdownTrigger({
  children,
}: {
  children: ReactElement;
  asChild?: boolean;
}) {
  return <RDropdown.Trigger asChild>{children}</RDropdown.Trigger>;
}

export type DropdownMenuProps = BaseProps & {
  onAction?: (key: Key) => void;
  autoFocus?: boolean;
  autoFocusKey?: Key;
  disabledKeys?: Key[];
};

const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropdownMenu(
    {
      onAction,
      autoFocus: _a,
      autoFocusKey: _k,
      disabledKeys,
      css,
      className,
      children,
      ...props
    },
    ref
  ) {
    const { arrowClassName: _arrow, ...popoverProps } =
      useContext(dropdownCtx).popoverProps ?? {};
    return (
      <RDropdown.Portal>
        <RDropdown.Content
          ref={ref}
          sideOffset={4}
          {...popoverProps}
          {...props}
          className={cx(
            'fuel_Menu fuel_DropdownMenu',
            stitches({
              zIndex: 60,
              minWidth: '180px',
              py: '$1',
              background: '$card',
              boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
              ...popoverMotion,
              ...css,
            })(),
            className
          )}
        >
          {withActions(children, onAction, disabledKeys)}
        </RDropdown.Content>
      </RDropdown.Portal>
    );
  }
);

export type MenuItemProps = BaseProps & {
  textValue?: string;
  isDisabled?: boolean;
  __onAction?: () => void;
};

const DropdownMenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  function DropdownMenuItem(
    {
      textValue,
      isDisabled,
      __onAction,
      onSelect: _s,
      css,
      className,
      ...props
    },
    ref
  ) {
    return (
      <RDropdown.Item
        ref={ref}
        textValue={textValue}
        disabled={isDisabled}
        onSelect={() => __onAction?.()}
        {...props}
        className={cx(
          'fuel_MenuListItem',
          menuItemStyle(),
          css && stitches(css)(),
          className
        )}
      />
    );
  }
);

export const Dropdown = Object.assign(DropdownRoot, {
  id: 'Dropdown',
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
  MenuItem: DropdownMenuItem,
});

/* ----------------------------------------------------------------------------
 * Popover: floating content pinned to an anchor. Unlike Dropdown it leaves
 * focus where it is, so it can hang suggestions under an input.
 * --------------------------------------------------------------------------*/

export type PopoverRootProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

function PopoverRoot({ isOpen, onOpenChange, children }: PopoverRootProps) {
  return (
    <RPopover.Root open={isOpen} onOpenChange={onOpenChange}>
      {children}
    </RPopover.Root>
  );
}

export type PopoverContentProps = BaseProps &
  Pick<
    RPopover.PopoverContentProps,
    'side' | 'align' | 'sideOffset' | 'onInteractOutside' | 'onEscapeKeyDown'
  >;

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    { css, className, sideOffset = 4, children, ...props },
    ref
  ) {
    return (
      <RPopover.Portal>
        <RPopover.Content
          ref={ref}
          sideOffset={sideOffset}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          {...props}
          className={cx(
            'fuel_Popover',
            stitches({
              zIndex: 60,
              width: 'var(--radix-popover-trigger-width)',
              boxSizing: 'border-box',
              py: '$1',
              background: '$card',
              boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
              outline: 'none',
              ...popoverMotion,
              ...css,
            })(),
            className
          )}
        >
          {children}
        </RPopover.Content>
      </RPopover.Portal>
    );
  }
);

function PopoverAnchor({ children }: { children: ReactElement }) {
  return <RPopover.Anchor asChild>{children}</RPopover.Anchor>;
}

export const Popover = Object.assign(PopoverRoot, {
  id: 'Popover',
  Anchor: PopoverAnchor,
  Content: PopoverContent,
});

/** A pressable row with the menu item look, for lists that are not menus. */
export type OptionItemProps = ComponentPropsWithoutRef<'button'> & {
  css?: ThemeUtilsCSS;
};

export const OptionItem = forwardRef<HTMLButtonElement, OptionItemProps>(
  function OptionItem({ css, className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        {...props}
        className={cx(
          'fuel_OptionItem',
          menuItemStyle(),
          stitches({
            width: '100%',
            m: 0,
            border: 0,
            background: 'transparent',
            font: 'inherit',
            textAlign: 'left',
            ...css,
          })(),
          className
        )}
      />
    );
  }
);

/* ----------------------------------------------------------------------------
 * Menu: an always visible list of actions with arrow key navigation.
 * --------------------------------------------------------------------------*/

export type MenuProps = BaseProps & { onAction?: (key: Key) => void };

function moveFocus(e: KeyboardEvent<HTMLElement>) {
  const step = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
  if (!step) return;
  const menu = e.currentTarget;
  const items = Array.from(
    menu.querySelectorAll<HTMLElement>(
      ':scope > [role="menuitem"]:not([aria-disabled="true"])'
    )
  );
  const index = items.indexOf(document.activeElement as HTMLElement);
  if (index === -1) return;
  e.preventDefault();
  items[(index + step + items.length) % items.length]?.focus();
}

const MenuRoot = forwardRef<HTMLElement, MenuProps>(function Menu(
  { as = 'div', onAction, children, onKeyDown, ...props },
  ref
) {
  return render(
    as,
    'fuel_Menu',
    {
      ...props,
      role: 'menu',
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        moveFocus(e);
        onKeyDown?.(e as KeyboardEvent<HTMLDivElement>);
      },
      children: withActions(children, onAction),
    },
    ref
  );
});

const MenuItem = forwardRef<HTMLElement, MenuItemProps>(function MenuItem(
  {
    as = 'div',
    textValue: _t,
    isDisabled,
    __onAction,
    css,
    className,
    onClick,
    ...props
  },
  ref
) {
  const run = (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    if (
      isDisabled ||
      e.currentTarget !== (e.target as HTMLElement).closest('[role="menuitem"]')
    )
      return;
    __onAction?.();
  };
  return render(
    as,
    cx('fuel_MenuListItem', menuItemStyle()),
    {
      ...props,
      css,
      className,
      role: 'menuitem',
      tabIndex: isDisabled ? -1 : 0,
      'aria-disabled': isDisabled || undefined,
      onClick: (e: MouseEvent<HTMLElement>) => {
        run(e);
        onClick?.(e as MouseEvent<HTMLDivElement>);
      },
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          run(e);
        }
      },
    },
    ref
  );
});

export const Menu = Object.assign(MenuRoot, { id: 'Menu', Item: MenuItem });

/* ----------------------------------------------------------------------------
 * Focus
 * --------------------------------------------------------------------------*/

export type FocusScopeProps = {
  autoFocus?: boolean;
  contain?: boolean;
  restoreFocus?: boolean;
  children?: ReactNode;
};

const FIELD = 'input, textarea, select';

/* Focus a field now, or as soon as it stops being disabled (e.g. loading). */
function focusWhenEnabled(field: HTMLElement & { disabled?: boolean }) {
  if (!field.disabled) return field.focus();
  const observer = new MutationObserver(() => {
    if (field.disabled) return;
    observer.disconnect();
    if (field.isConnected) field.focus();
  });
  observer.observe(field, { attributes: true, attributeFilter: ['disabled'] });
  setTimeout(() => observer.disconnect(), 2000);
}

function Scope({ autoFocus, contain, children }: FocusScopeProps) {
  /* Autofocus lands on the first field, not a help icon in its label. */
  const onMountAutoFocus = (e: Event) => {
    if (!autoFocus) return e.preventDefault();
    const scope = e.currentTarget as HTMLElement | null;
    const field = scope?.querySelector<HTMLInputElement>(FIELD);
    if (!field) return;
    e.preventDefault();
    focusWhenEnabled(field);
  };
  return (
    <FocusScope
      trapped={contain}
      loop={contain}
      onMountAutoFocus={onMountAutoFocus}
      style={{ display: 'contents' }}
    >
      {children}
    </FocusScope>
  );
}

export const Focus = { Scope };
