import type * as Stitches from '@stitches/react';
import { createStitches } from '@stitches/react';

const v = (name: string) => `var(--fuel-${name})`;

type Scale = 'gray' | 'green' | 'red' | 'yellow';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Steps<P extends string> = Record<`${P}${Step}`, string>;

function scale<P extends string>(prefix: P, to: Scale) {
  return Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [
      `${prefix}${i + 1}`,
      v(`${to}-${i + 1}`),
    ])
  ) as Steps<P>;
}

function alpha<P extends string>(prefix: P, rgb: string): Steps<P> {
  const steps = [
    0.012, 0.024, 0.055, 0.078, 0.106, 0.133, 0.169, 0.267, 0.447, 0.498, 0.608,
    0.875,
  ];
  return Object.fromEntries(
    steps.map((a, i) => [`${prefix}${i + 1}`, `rgb(${rgb} / ${a})`])
  ) as Steps<P>;
}

const INTENT_SCALE: Record<string, Scale> = {
  Base: 'gray',
  Info: 'gray',
  Primary: 'green',
  Success: 'green',
  Error: 'red',
  Secondary: 'red',
  Warning: 'yellow',
};

const SOLID: Record<Scale, [string, string, string]> = {
  gray: [v('secondary'), v('secondary-hover'), v('secondary-foreground')],
  green: [v('primary'), v('primary-hover'), v('primary-foreground')],
  red: [v('danger'), v('red-10'), v('white')],
  yellow: [v('warning'), v('yellow-10'), v('stone-950')],
};

/** The @fuel-ui semantic layer tokens, so `layer: 'layer-solid-primary'` keeps working. */
function semanticTokens() {
  const out: Record<string, string> = {};
  const parts = [
    'Bg',
    'Border',
    'Color',
    'Icon',
    'Focus',
    'HoverBg',
    'HoverBorder',
    'HoverColor',
    'HoverIcon',
    'DisabledBg',
    'DisabledBorder',
    'DisabledColor',
    'DisabledIcon',
  ];
  for (const variant of ['Solid', 'Outlined', 'Ghost', 'Link']) {
    for (const [intent, s] of Object.entries(INTENT_SCALE)) {
      const isBase = s === 'gray';
      const text = isBase ? v('element-high-em') : v(`${s}-11`);
      for (const part of parts) {
        let value: string;
        if (part === 'Focus') value = v('focus');
        else if (part === 'DisabledBg')
          value = variant === 'Solid' ? v('muted') : 'transparent';
        else if (part === 'DisabledBorder')
          value =
            variant === 'Solid' || variant === 'Outlined'
              ? v('line')
              : 'transparent';
        else if (part.startsWith('Disabled')) value = v('disabled-text');
        else if (variant === 'Solid') {
          const [fill, hover, fg] = SOLID[s];
          if (part === 'Bg') value = fill;
          else if (part === 'HoverBg') value = hover;
          else if (part.endsWith('Border')) value = 'transparent';
          else value = fg;
        } else if (part.endsWith('Bg')) {
          value =
            variant === 'Link' || !part.startsWith('Hover')
              ? 'transparent'
              : isBase
                ? v('muted')
                : v(`${s}-3`);
        } else if (part.endsWith('Border')) {
          if (variant !== 'Outlined') value = 'transparent';
          else if (isBase)
            value = part.startsWith('Hover')
              ? v('element-low-em')
              : v('border-light');
          else value = v(`${s}-9`);
        } else value = text;
        out[`semantic${variant}${intent}${part}`] = value;
      }
    }
  }
  for (const state of ['Base', 'Active', 'Error', 'Success', 'Disabled']) {
    const disabled = state === 'Disabled';
    out[`input${state}Bg`] = disabled ? v('muted') : v('card');
    out[`input${state}Border`] = {
      Base: v('line'),
      Active: v('focus'),
      Error: v('danger'),
      Success: v('brand-text'),
      Disabled: v('line'),
    }[state] as string;
    out[`input${state}Color`] = disabled
      ? v('disabled-text')
      : v('element-high-em');
    out[`input${state}Icon`] =
      state === 'Error' ? v('danger-text') : v('element-low-em');
    out[`input${state}Placeholder`] = v('element-low-em');
    out[`input${state}Focus`] = v('focus');
  }
  return out;
}

export const colors = {
  inherit: 'inherit',
  current: 'currentColor',
  transparent: 'transparent',
  black: v('black'),
  white: v('white'),

  /** Fuel design system names. Prefer these in new code. */
  background: v('background'),
  card: v('card'),
  muted: v('muted'),
  border: v('line'),
  borderSubtle: v('border'),
  ring: v('ring'),
  line: v('line'),
  textHigh: v('element-high-em'),
  textMid: v('element-mid-em'),
  textLow: v('element-low-em'),
  textDisabled: v('disabled-text'),
  primary: v('primary'),
  primaryHover: v('primary-hover'),
  primaryForeground: v('primary-foreground'),
  brandText: v('brand-text'),
  focus: v('focus'),
  danger: v('danger'),
  dangerText: v('danger-text'),
  warning: v('warning'),
  warningText: v('warning-text'),
  secondary: v('secondary'),
  secondaryHover: v('secondary-hover'),
  secondaryForeground: v('secondary-foreground'),
  scrim: v('scrim'),

  /** Names carried over from @fuel-ui. */
  brand: v('primary'),
  bodyBg: v('background'),
  bodyColor: v('background'),
  bodyInverse: v('element-high-em'),
  cardBg: v('card'),
  cardBorder: v('line'),
  dialogBg: v('background'),
  overlayBg: v('card'),
  overlayText: v('element-mid-em'),
  borderHover: v('ring'),
  text: v('element-mid-em'),
  textColor: v('element-mid-em'),
  textHeading: v('element-high-em'),
  textActive: v('element-high-em'),
  textInverse: v('element-high-em'),
  textMuted: v('disabled-text'),
  textSubtext: v('element-low-em'),
  textSubText: v('element-low-em'),
  textIcon: v('element-low-em'),
  textLink: v('brand-text'),
  textLinkHover: v('brand-text'),
  textLinkActive: v('brand-text'),
  textLinkVisited: v('brand-text'),
  textLinkDisabled: v('disabled-text'),
  inputBg: v('card'),
  ...scale('gray', 'gray'),
  ...scale('intentsBase', 'gray'),
  ...scale('intentsInfo', 'gray'),
  ...scale('indigo', 'gray'),
  ...scale('accent', 'green'),
  ...scale('green', 'green'),
  ...scale('intentsPrimary', 'green'),
  ...scale('intentsSuccess', 'green'),
  ...scale('red', 'red'),
  ...scale('crimson', 'red'),
  ...scale('intentsError', 'red'),
  ...scale('intentsSecondary', 'red'),
  blue: v('brand-text'),
  ...scale('scalesBlue', 'green'),
  ...scale('yellow', 'yellow'),
  ...scale('intentsWarning', 'yellow'),
  ...alpha('blackA', '0 0 0'),
  ...alpha('whiteA', '255 255 255'),
  ...alpha('inverseA', 'from var(--fuel-element-high-em) r g b'),
  ...semanticTokens(),
};

export type Colors = keyof typeof colors;

const space = {
  0: '0px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

const sizes = {
  ...space,
  auto: 'auto',
  none: 'none',
  xs: '18.75rem',
  sm: '27.5rem',
  md: '37.5rem',
  lg: '48rem',
  xl: '64rem',
  '2xl': '80rem',
  full: '100%',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
  screenW: '100vw',
  screenH: '100vh',
};

/** Sized for a 360px popup: 14px body, 12px mono labels. */
const fontSizes = {
  xs: '12px',
  sm: '13px',
  base: '14px',
  default: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '28px',
  '4xl': '32px',
  '5xl': '40px',
  '6xl': '48px',
  '7xl': '56px',
  h1: '32px',
  h2: '28px',
  h3: '24px',
  h4: '20px',
  h5: '18px',
  h6: '16px',
};

const lineHeights = {
  none: '1',
  tight: '1.2',
  snug: '1.35',
  normal: '1.45',
  relaxed: '1.6',
  loose: '2',
  3: '.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
};

const TEXT_SIZE = {
  xs: ['$xs', '16px'],
  sm: ['$sm', '18px'],
  base: ['$base', '20px'],
  lg: ['$lg', '24px'],
  xl: ['$xl', '26px'],
  '2xl': ['$2xl', '28px'],
  '3xl': ['$3xl', '32px'],
  '4xl': ['$4xl', '36px'],
  '5xl': ['$5xl', '1'],
  '6xl': ['$6xl', '1'],
  '7xl': ['$7xl', '1'],
} as const;

export type TextSizes = keyof typeof TEXT_SIZE;

export const mixins = {
  centered: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  noAppearance: {
    appearance: 'none',
    border: 'none',
    background: 'transparent',
    boxShadow: 'none',
  },
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  display: { fontFamily: '$heading', letterSpacing: '-0.04em' },
};

type Mixin = keyof typeof mixins;

function layerStyle(key: string) {
  return {
    bg: `$${key}Bg`,
    border: `1px solid $${key}Border`,
    color: `$${key}Color`,
    transitionProperty: 'background, border-color, color, box-shadow',
    transitionDuration: '200ms',
    '& .fuel_Icon': { color: `$${key}Icon` },
    '&:not([aria-disabled="true"]):hover': {
      bg: `$${key}HoverBg`,
      borderColor: `$${key}HoverBorder`,
      color: `$${key}HoverColor`,
    },
    '&[aria-disabled="true"]': {
      bg: `$${key}DisabledBg`,
      borderColor: `$${key}DisabledBorder`,
      color: `$${key}DisabledColor`,
      cursor: 'not-allowed',
      '& .fuel_Icon': { color: `$${key}DisabledIcon` },
    },
  };
}

const LAYERS: Record<string, object> = {
  'layer-card': {
    background: '$card',
    border: '1px solid $line',
  },
  'layer-dialog': {
    background: '$background',
    border: '1px solid $line',
  },
  'layer-overlay': {
    background: '$card',
    color: '$textMid',
  },
};

function camel(str: string) {
  return str.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());
}

export function layer(name: string) {
  if (LAYERS[name]) return LAYERS[name];
  const sem = name.match(/^layer-(solid|outlined|ghost|link)-(\w+)$/);
  if (sem) return layerStyle(camel(`semantic-${sem[1]}-${sem[2]}`));
  const input = name.match(/^input-(\w+)$/);
  if (input) return layerStyle(camel(`input-${input[1]}`));
  return {};
}

const compose = (props: string[]) => (value: Stitches.PropertyValue<'width'>) =>
  Object.fromEntries(props.map((p) => [p, value]));

export const { css, styled, globalCss, keyframes, getCssText, theme, config } =
  createStitches({
    prefix: 'fw',
    theme: {
      colors,
      space,
      sizes,
      fonts: {
        sans: 'var(--font-sans)',
        display: 'var(--font-sans)',
        heading: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      fontSizes,
      fontWeights: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '500',
        bold: '500',
        extrabold: '500',
        black: '500',
      },
      lineHeights,
      letterSpacings: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      radii: {
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        default: '0px',
        full: '9999px',
      },
      shadows: {
        none: 'none',
        sm: 'none',
        base: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        inner: 'none',
      },
      zIndices: {
        auto: 'auto',
        0: '0',
        10: '10',
        20: '20',
        30: '30',
        40: '40',
        50: '50',
      },
    },
    media: {
      sm: '(min-width: 640px)',
      md: '(min-width: 768px)',
      lg: '(min-width: 1024px)',
      xl: '(min-width: 1280px)',
    },
    utils: {
      bg: (value: Stitches.PropertyValue<'backgroundColor'>) => ({
        backgroundColor: value,
      }),
      br: compose(['borderRadius']),
      w: compose(['width']),
      minW: compose(['minWidth']),
      maxW: compose(['maxWidth']),
      h: compose(['height']),
      minH: compose(['minHeight']),
      maxH: compose(['maxHeight']),
      boxSize: compose(['width', 'height']),
      m: compose(['margin']),
      mt: compose(['marginTop']),
      mr: compose(['marginRight']),
      mb: compose(['marginBottom']),
      ml: compose(['marginLeft']),
      mx: compose(['marginLeft', 'marginRight']),
      my: compose(['marginTop', 'marginBottom']),
      p: compose(['padding']),
      pt: compose(['paddingTop']),
      pr: compose(['paddingRight']),
      pb: compose(['paddingBottom']),
      pl: compose(['paddingLeft']),
      px: compose(['paddingLeft', 'paddingRight']),
      py: compose(['paddingTop', 'paddingBottom']),
      textSize: (value: TextSizes) => ({
        fontSize: TEXT_SIZE[value]?.[0],
        lineHeight: TEXT_SIZE[value]?.[1],
      }),
      is: (list: Mixin[]) =>
        list.reduce((obj, key) => Object.assign(obj, mixins[key]), {}),
      layer: (name: string) => layer(name),
      linearGradient: (value: string) => ({
        backgroundImage: `linear-gradient(${value})`,
      }),
    },
  });

export type ThemeUtilsCSS = Stitches.CSS<typeof config>;
export type CSSFnParams = ThemeUtilsCSS;

export function cssObj(opts: ThemeUtilsCSS) {
  return opts;
}

export function cx(
  ...args: Array<string | false | null | undefined | Record<string, unknown>>
) {
  const out: string[] = [];
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === 'string') out.push(arg);
    // A stitches css() result: use its class names, not its keys.
    else if (typeof arg.className === 'string') out.push(arg.className);
    else for (const [k, on] of Object.entries(arg)) if (on) out.push(k);
  }
  return out.join(' ');
}
