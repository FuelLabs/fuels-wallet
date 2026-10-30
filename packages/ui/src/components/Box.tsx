import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ForwardRefRenderFunction,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { forwardRef as reactForwardRef } from 'react';
import { type ThemeUtilsCSS, css as toClass, cx } from '../css';

// biome-ignore lint/suspicious/noExplicitAny: polymorphic `as` props are open by design
export type AnyProps = Record<string, any>;

export type BaseProps = {
  as?: ElementType;
  css?: ThemeUtilsCSS;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<'div'>, 'color' | 'css'> &
  AnyProps;

/**
 * React's forwardRef runs props through Omit, which drops every named prop of a
 * type with an index signature. This keeps them, so handlers stay typed.
 */
export function forwardRef<T, P>(fn: ForwardRefRenderFunction<T, P>) {
  return reactForwardRef(fn) as unknown as ((
    props: P & { ref?: Ref<T> }
  ) => ReactElement | null) & { displayName?: string };
}

const inline = toClass();

/** Renders `as` with a class built from `css`, plus the given base classes. */
export function render(
  as: ElementType,
  base: string,
  { css, className, ...props }: AnyProps,
  ref: unknown
) {
  const Comp = as;
  // Passed as the css prop, stitches injects it after variant rules, so it wins.
  return (
    <Comp
      ref={ref}
      {...props}
      className={cx(base, css && inline({ css }), className)}
    />
  );
}

const space = (value: unknown) =>
  typeof value === 'number' ? `${value}px` : (value as string | undefined);

export type FlexProps = BaseProps & {
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  direction?: CSSProperties['flexDirection'];
  wrap?: CSSProperties['flexWrap'];
  gap?: string | number;
  grow?: number | string;
  shrink?: number | string;
  basis?: string;
  inline?: boolean;
};

export type StackProps = FlexProps;

function flexCss(
  {
    align,
    justify,
    direction,
    wrap,
    gap,
    grow,
    shrink,
    basis,
    inline,
  }: FlexProps,
  css?: ThemeUtilsCSS
): ThemeUtilsCSS {
  return {
    display: inline ? 'inline-flex' : 'flex',
    ...(align && { alignItems: align }),
    ...(justify && { justifyContent: justify }),
    ...(direction && { flexDirection: direction }),
    ...(wrap && { flexWrap: wrap }),
    ...(gap !== undefined && { gap: space(gap) }),
    ...(grow !== undefined && { flexGrow: grow }),
    ...(shrink !== undefined && { flexShrink: shrink }),
    ...(basis && { flexBasis: basis }),
    ...css,
  } as ThemeUtilsCSS;
}

function makeFlex(base: string, defaults: Partial<FlexProps> = {}) {
  return forwardRef<HTMLElement, FlexProps>(function Flex(props, ref) {
    const {
      as = 'div',
      css,
      align,
      justify,
      direction,
      wrap,
      gap,
      grow,
      shrink,
      basis,
      inline,
      ...rest
    } = { ...defaults, ...props };
    return render(
      as,
      base,
      {
        ...rest,
        css: flexCss(
          { align, justify, direction, wrap, gap, grow, shrink, basis, inline },
          css
        ),
      },
      ref
    );
  });
}

export const Flex = makeFlex('fuel_Box-flex');
export const Stack = makeFlex('fuel_Box-flex fuel_Box-stack', {
  direction: 'column',
  gap: '$2',
});
export const HStack = makeFlex('fuel_Box-flex fuel_Box-stack', {
  direction: 'row',
  gap: '$2',
});
export const VStack = Stack;

const Centered = forwardRef<
  HTMLElement,
  BaseProps & { minWH?: boolean; minHS?: boolean }
>(function Centered({ as = 'div', css, minWH, minHS, ...props }, ref) {
  return render(
    as,
    'fuel_Box-centered',
    {
      ...props,
      css: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(minWH && { minW: '100vw', minH: '100vh' }),
        ...(minHS && { minH: '100vh' }),
        ...css,
      },
    },
    ref
  );
});

const BoxRoot = forwardRef<HTMLElement, BaseProps>(function Box(
  { as = 'div', ...props },
  ref
) {
  return render(as, 'fuel_Box', props, ref);
});

export const Box = Object.assign(BoxRoot, {
  id: 'Box',
  Flex,
  Stack,
  HStack,
  VStack,
  Centered,
});

export type BoxProps = BaseProps;

export type GridProps = BaseProps & {
  gap?: string | number;
  templateColumns?: string;
  templateRows?: string;
};

export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  { as = 'div', css, gap, templateColumns, templateRows, ...props },
  ref
) {
  return render(
    as,
    'fuel_Grid',
    {
      ...props,
      css: {
        display: 'grid',
        ...(gap !== undefined && { gap: space(gap) }),
        ...(templateColumns && { gridTemplateColumns: templateColumns }),
        ...(templateRows && { gridTemplateRows: templateRows }),
        ...css,
      },
    },
    ref
  );
});
