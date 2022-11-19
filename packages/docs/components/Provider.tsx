import { ThemeProvider } from '@fuel-ui/react';
import { MDXProvider } from '@mdx-js/react';
import type { ReactNode } from 'react';

import { Blockquote } from './Blockquote';
import { Code } from './Code';
import { Heading } from './Heading';
import { UL } from './List';
import { Paragraph } from './Paragraph';
import Player from './Player';
import { Pre } from './Pre';
import { Table } from './Table';
import { Testing } from './Testing';

const components = {
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
  ul: UL,
  Testing,
  Player,
};

export function Provider({ children }: { children: ReactNode }) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <MDXProvider components={components as any}>
      <ThemeProvider>{children}</ThemeProvider>
    </MDXProvider>
  );
}
