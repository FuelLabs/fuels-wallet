import * as RAccordion from '@radix-ui/react-accordion';
import * as RTabs from '@radix-ui/react-tabs';
import type { ComponentProps } from 'react';
import { createContext, useContext } from 'react';
import { type ThemeUtilsCSS, cx, css as stitches } from '../css';
import { forwardRef } from './Box';
import { Card } from './Card';
import { ContentLoader, type ContentLoaderProps } from './Display';
import { Icon } from './Icon';

const cls = (css?: ThemeUtilsCSS) => (css ? stitches(css)() : undefined);

/* ----------------------------------------------------------------------------
 * Tabs: mono uppercase triggers. `link` draws a 2px underline on the active tab,
 * `subtle` fills it.
 * --------------------------------------------------------------------------*/

type TabsVariant = 'link' | 'subtle';
const tabsCtx = createContext<{ variant: TabsVariant }>({ variant: 'link' });

export type TabsProps = ComponentProps<typeof RTabs.Root> & {
  variant?: TabsVariant;
  css?: ThemeUtilsCSS;
};

function TabsRoot({ variant = 'link', css, className, ...props }: TabsProps) {
  return (
    <tabsCtx.Provider value={{ variant }}>
      <RTabs.Root
        {...props}
        className={cx(
          'fuel_Tabs',
          stitches({ display: 'flex', flexDirection: 'column', ...css })(),
          className
        )}
      />
    </tabsCtx.Provider>
  );
}

type TabsPartProps<T> = T & { css?: ThemeUtilsCSS };

const TabsList = forwardRef<
  HTMLDivElement,
  TabsPartProps<ComponentProps<typeof RTabs.List>>
>(function TabsList({ css, className, ...props }, ref) {
  return (
    <RTabs.List
      ref={ref}
      {...props}
      className={cx(
        'fuel_TabsList',
        stitches({
          display: 'flex',
          gap: '$4',
          boxShadow: 'inset 0 -1px 0 0 var(--fuel-line)',
          ...css,
        })(),
        className
      )}
    />
  );
});

const TabsTrigger = forwardRef<
  HTMLButtonElement,
  TabsPartProps<ComponentProps<typeof RTabs.Trigger>>
>(function TabsTrigger({ css, className, ...props }, ref) {
  const { variant } = useContext(tabsCtx);
  return (
    <RTabs.Trigger
      ref={ref}
      {...props}
      className={cx(
        'fuel_TabsTrigger fuel_Tabs-trigger',
        stitches({
          all: 'unset',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '$1',
          height: '36px',
          px: variant === 'subtle' ? '$3' : 0,
          fontFamily: '$mono',
          fontSize: '12px',
          fontWeight: '$medium',
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
          color: '$textLow',
          cursor: 'pointer',
          transition: 'color 150ms, box-shadow 150ms, background-color 150ms',
          '&:hover': { color: '$textHigh' },
          '&:focus-visible': {
            outline: '2px solid $focus',
            outlineOffset: '2px',
          },
          '&[data-state="active"]': {
            color: '$textHigh',
            ...(variant === 'subtle'
              ? { background: '$muted' }
              : { boxShadow: 'inset 0 -2px 0 0 var(--fuel-primary)' }),
          },
          '&[data-disabled]': { color: '$textDisabled', cursor: 'not-allowed' },
          ...css,
        })(),
        className
      )}
    />
  );
});

const TabsContent = forwardRef<
  HTMLDivElement,
  TabsPartProps<ComponentProps<typeof RTabs.Content>>
>(function TabsContent({ css, className, ...props }, ref) {
  return (
    <RTabs.Content
      ref={ref}
      {...props}
      className={cx(
        'fuel_TabsContent',
        stitches({ outline: 'none', ...css })(),
        className
      )}
    />
  );
});

export const Tabs = Object.assign(TabsRoot, {
  id: 'Tabs',
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

/* ----------------------------------------------------------------------------
 * Accordion
 * --------------------------------------------------------------------------*/

export type AccordionProps = ComponentProps<typeof RAccordion.Root> & {
  css?: ThemeUtilsCSS;
};

const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion({ css, className, ...props }, ref) {
    const rest =
      props.type === 'single' ? { collapsible: true, ...props } : props;
    return (
      <RAccordion.Root
        ref={ref}
        {...(rest as ComponentProps<typeof RAccordion.Root>)}
        className={cx('fuel_Accordion', cls(css), className)}
      />
    );
  }
);

const AccordionItem = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof RAccordion.Item> & { css?: ThemeUtilsCSS }
>(function AccordionItem({ css, className, ...props }, ref) {
  return (
    <RAccordion.Item
      ref={ref}
      {...props}
      className={cx(
        'fuel_Accordion-item',
        stitches({
          background: '$card',
          boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
          '&:has(.fuel_Accordion-trigger:focus-visible)': {
            outline: '2px solid $focus',
            outlineOffset: '2px',
          },
          ...css,
        })(),
        className
      )}
    />
  );
});

const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof RAccordion.Trigger> & { css?: ThemeUtilsCSS }
>(function AccordionTrigger({ css, className, children, ...props }, ref) {
  return (
    <RAccordion.Header
      className={cx('fuel_Accordion-header', stitches({ m: 0 })())}
    >
      <RAccordion.Trigger
        ref={ref}
        {...props}
        className={cx(
          'fuel_Accordion-trigger',
          stitches({
            all: 'unset',
            boxSizing: 'border-box',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '$2',
            px: '$3',
            minHeight: '40px',
            fontFamily: '$mono',
            fontSize: '12px',
            fontWeight: '$medium',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            color: '$textHigh',
            cursor: 'pointer',
            '& .fuel_Accordion-icon': {
              transition: 'transform 200ms',
              color: '$textLow',
            },
            '&[data-state="open"] .fuel_Accordion-icon': {
              transform: 'rotate(180deg)',
            },
            '@media (prefers-reduced-motion: reduce)': {
              '& .fuel_Accordion-icon': { transition: 'none' },
            },
            ...css,
          })(),
          className
        )}
      >
        {children}
        <Icon icon="ChevronDown" size={16} className="fuel_Accordion-icon" />
      </RAccordion.Trigger>
    </RAccordion.Header>
  );
});

const AccordionContent = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof RAccordion.Content> & { css?: ThemeUtilsCSS }
>(function AccordionContent({ css, className, ...props }, ref) {
  return (
    <RAccordion.Content
      ref={ref}
      {...props}
      className={cx(
        'fuel_Accordion-content',
        stitches({
          px: '$3',
          pb: '$3',
          fontSize: '$sm',
          color: '$textMid',
          ...css,
        })(),
        className
      )}
    />
  );
});

export const Accordion = Object.assign(AccordionRoot, {
  id: 'Accordion',
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

/* ----------------------------------------------------------------------------
 * InputAmountLoader: the skeleton shown while an amount input loads.
 * --------------------------------------------------------------------------*/

export function InputAmountLoader(props: ContentLoaderProps) {
  return (
    <Card css={{ p: '$0' }}>
      <ContentLoader height={80} {...props}>
        <ContentLoader.Rect x="12" y="21" width="100" height="24" />
        <ContentLoader.Rect x="80%" y="27" width="31" height="18" />
        <ContentLoader.Rect x="12" y="55" width="60" height="12" />
      </ContentLoader>
    </Card>
  );
}
