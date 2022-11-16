/* eslint-disable @typescript-eslint/no-explicit-any */
import '../styles/index.css';
import '../styles/docsearch/_variables.css';
import '../styles/docsearch/button.css';
import '../styles/docsearch/modal.css';
import '../styles/docsearch/style.css';

import { ThemeProvider } from '@fuel-ui/react';
import { MDXProvider } from '@mdx-js/react';
import type { AppProps } from 'next/app';

import { Blockquote } from '../components/Blockquote';
import { Code } from '../components/Code';
import { Heading } from '../components/Heading';
import { UL } from '../components/List';
import { Paragraph } from '../components/Paragraph';
import { Pre } from '../components/Pre';
import { Table } from '../components/Table';
import { Testing } from '../components/Testing';

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
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={components as any}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </MDXProvider>
  );
}
