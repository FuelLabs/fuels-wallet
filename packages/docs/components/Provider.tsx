/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { ThemeProvider } from '@fuel-ui/react';
import { MDXProvider } from '@mdx-js/react';
import type { ReactNode } from 'react';

import { Blockquote } from './Blockquote';
import { Code } from './Code';
import { CodeImport } from './CodeImport';
import { Heading } from './Heading';
import { UL } from './List';
import { Paragraph } from './Paragraph';
import Player from './Player';
import { Pre } from './Pre';
import { Table } from './Table';
import { Testing } from './Testing';

export const defaultComponents = {
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
  CodeImport,
  Testing,
  Player,
};

type ProviderProps = {
  children: ReactNode;
};

export function Provider({ children }: ProviderProps) {
  return (
    <MDXProvider components={defaultComponents as any}>
      <ThemeProvider>{children}</ThemeProvider>
    </MDXProvider>
  );
}
