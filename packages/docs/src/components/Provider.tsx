import {
  ThemeProvider,
  createTheme,
  loadIcons,
  setFuelThemes,
} from '@fuel-ui/react';
import { defaultConnectors } from '@fuels/connectors';
import { FuelProvider } from '@fuels/react';
import { MDXProvider } from '@mdx-js/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
import { SDKSection } from './SDKSection';
import { TD, TH, Table } from './Table';

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
  SDKSection,
  Examples,
  Demo,
  DownloadWalletZip,
};

type ProviderProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

const theme = createTheme('fuel-docs', {
  components: {
    Button: {
      defaultProps: {
        intent: 'primary',
      },
    },
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FuelProvider
          theme="dark"
          fuelConfig={{
            connectors: defaultConnectors({ devMode: true }),
          }}
        >
          {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
          <MDXProvider components={components as any}>
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {children as any}
          </MDXProvider>
        </FuelProvider>
      </ThemeProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
