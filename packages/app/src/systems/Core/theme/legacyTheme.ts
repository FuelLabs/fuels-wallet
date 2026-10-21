/**
 * Points the @fuel-ui theme tokens at the Fuel design system CSS variables
 * from @fuel-wallet/ui, so components that still render through @fuel-ui
 * take the new look. Delete this file once no screen imports @fuel-ui.
 */
import { darkColors, globalCss } from '@fuel-ui/css';

type Scale = 'gray' | 'green' | 'red' | 'yellow';

const SCALE_PREFIXES: Array<[RegExp, Scale]> = [
  [/^(intentsBase|intentsInfo|gray|indigo)(\d+)$/, 'gray'],
  [/^(intentsPrimary|intentsSuccess|accent|green)(\d+)$/, 'green'],
  [/^(intentsError|intentsSecondary|red|crimson)(\d+)$/, 'red'],
  [/^(intentsWarning|yellow)(\d+)$/, 'yellow'],
];

const INTENT_SCALE: Record<string, Scale> = {
  Base: 'gray',
  Info: 'gray',
  Primary: 'green',
  Success: 'green',
  Error: 'red',
  Secondary: 'red',
  Warning: 'yellow',
};

const v = (name: string) => `var(--fuel-${name})`;

const NAMED: Record<string, string> = {
  brand: v('primary'),
  bodyBg: v('background'),
  bodyColor: v('background'),
  bodyInverse: v('element-high-em'),
  cardBg: v('card'),
  cardBorder: v('line'),
  dialogBg: v('background'),
  overlayBg: v('card'),
  overlayText: v('element-mid-em'),
  border: v('line'),
  borderHover: v('ring'),
  textColor: v('element-mid-em'),
  textHeading: v('element-high-em'),
  textActive: v('element-high-em'),
  textInverse: v('element-high-em'),
  textMuted: v('disabled-text'),
  textSubtext: v('element-low-em'),
  textIcon: v('element-low-em'),
  textLink: v('brand-text'),
  textLinkHover: v('brand-text'),
  textLinkActive: v('brand-text'),
  textLinkVisited: v('brand-text'),
  textLinkDisabled: v('disabled-text'),
  inputBg: v('card'),
  inputBaseBg: v('card'),
  inputActiveBg: v('card'),
  inputErrorBg: v('card'),
  inputSuccessBg: v('card'),
  inputDisabledBg: v('muted'),
  inputBaseBorder: v('line'),
  inputActiveBorder: v('focus'),
  inputErrorBorder: v('danger'),
  inputSuccessBorder: v('brand-text'),
  inputDisabledBorder: v('line'),
  inputBaseColor: v('element-high-em'),
  inputActiveColor: v('element-high-em'),
  inputErrorColor: v('element-high-em'),
  inputSuccessColor: v('element-high-em'),
  inputDisabledColor: v('disabled-text'),
};

/** Button and badge layers: solid fills, hairline outlines, ghost hover fills. */
function semantic(variant: string, intent: string, part: string) {
  const scale = INTENT_SCALE[intent];
  const isBase = scale === 'gray';
  if (part.endsWith('Focus')) return v('focus');
  if (part.startsWith('Disabled')) {
    if (part === 'DisabledBg')
      return variant === 'Solid' ? v('muted') : 'transparent';
    if (part === 'DisabledBorder')
      return variant === 'Link' || variant === 'Ghost'
        ? 'transparent'
        : v('line');
    return v('disabled-text');
  }
  const text = isBase ? v('element-high-em') : v(`${scale}-11`);
  if (variant === 'Solid') {
    const fill = {
      gray: [v('secondary'), v('secondary-hover'), v('secondary-foreground')],
      green: [v('primary'), v('primary-hover'), v('primary-foreground')],
      red: [v('danger'), v('red-10'), v('white')],
      yellow: [v('warning'), v('yellow-10'), v('stone-950')],
    }[scale];
    if (part === 'Bg') return fill[0];
    if (part === 'HoverBg') return fill[1];
    if (part.endsWith('Border')) return 'transparent';
    return fill[2];
  }
  if (part.endsWith('Bg')) {
    if (variant === 'Link' || !part.startsWith('Hover')) return 'transparent';
    return isBase ? v('muted') : v(`${scale}-3`);
  }
  if (part.endsWith('Border')) {
    if (variant !== 'Outlined') return 'transparent';
    if (isBase)
      return part.startsWith('Hover') ? v('element-low-em') : v('border-light');
    return v(`${scale}-9`);
  }
  return text;
}

function mapColors(colors: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const key of Object.keys(colors)) {
    if (NAMED[key]) {
      out[key] = NAMED[key];
      continue;
    }
    const scale = SCALE_PREFIXES.find(([re]) => re.test(key));
    if (scale) {
      out[key] = v(`${scale[1]}-${key.match(/\d+$/)?.[0]}`);
      continue;
    }
    const sem = key.match(
      /^semantic(Solid|Outlined|Ghost|Link)(Base|Primary|Success|Error|Secondary|Warning|Info)(\w+)$/
    );
    if (sem) {
      out[key] = semantic(sem[1], sem[2], sem[3]);
      continue;
    }
    const input = key.match(
      /^input(Base|Active|Error|Success|Disabled)(Icon|Placeholder|Focus)$/
    );
    if (input) {
      if (input[2] === 'Focus') out[key] = v('focus');
      else if (input[1] === 'Error' && input[2] === 'Icon')
        out[key] = v('danger-text');
      else out[key] = v('element-low-em');
    }
  }
  return out;
}

const radii = {
  none: '0px',
  sm: '0px',
  md: '0px',
  lg: '0px',
  xl: '0px',
  '2xl': '0px',
  '3xl': '0px',
  default: '0px',
};

const shadows = {
  sm: 'none',
  base: 'none',
  md: 'none',
  lg: 'none',
  xl: 'none',
  '2xl': 'none',
  inner: 'none',
};

const fonts = {
  sans: 'var(--font-sans)',
  display: 'var(--font-sans)',
  heading: 'var(--font-sans)',
  mono: 'var(--font-mono)',
};

function toVars(group: string, tokens: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [`--${group}-${key}`, value])
  );
}

/**
 * Every value is a CSS variable that already switches with the theme class,
 * so one block serves dark and light. `html:root` outranks the @fuel-ui
 * theme classes.
 */
export const applyLegacyTheme = globalCss({
  'html:root': {
    ...toVars('colors', mapColors(darkColors)),
    ...toVars('radii', radii),
    ...toVars('shadows', shadows),
    ...toVars('fonts', fonts),
  },
});
