/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createTheme,
  loadIcons,
  setFuelThemes,
  ThemeProvider,
} from '@fuel-ui/react';
import { MDXProvider } from '@mdx-js/react';
import type { ReactNode } from 'react';

import * as Examples from '../../examples';

import { Blockquote } from './Blockquote';
import { Code } from './Code';
import { CodeImport } from './CodeImport';
import { ConnectionAlert } from './ConnectionAlert';
import { Demo } from './Demo';
import { DownloadWalletZip } from './DownloadWalletZip';
import { Heading } from './Heading';
import { InstallSection } from './InstallSection';
import { Link } from './Link';
import { UL } from './List';
import { Paragraph } from './Paragraph';
import Player from './Player';
import { Pre } from './Pre';
import { Table, TD, TH } from './Table';

const components = {
  a: Link,
  h1: Heading,
  h2: Heading,
  h3: Heading,
  h4: Heading,
  h5: Heading,
  h6: Heading,
  pre: Pre,
  p: Paragraph,
  code: Code,
  blockquote: Blockquote,
  table: Table,
  td: TD,
  th: TH,
  ul: UL,
  ConnectionAlert,
  CodeImport,
  Player,
  InstallSection,
  Examples,
  Demo,
  DownloadWalletZip,
};

type ProviderProps = {
  children: ReactNode;
};

const theme = createTheme('fuel-docs', {
  components: {
    Button: {
      defaultProps: {
        intent: 'primary',
      },
    },
  },
} as any);

loadIcons('/icons/sprite.svg');
setFuelThemes({
  initial: 'docs',
  themes: {
    docs: theme,
  },
});

export function Provider({ children }: ProviderProps) {
  return (
    <ThemeProvider>
      <MDXProvider components={components as any}>{children}</MDXProvider>
    </ThemeProvider>
  );
}
