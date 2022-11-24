/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { Box, Icon, IconButton, Text } from '@fuel-ui/react';
import { Children } from 'react';
import type { ReactNode } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import theme from 'react-syntax-highlighter/dist/cjs/styles/prism/night-owl';

type PreProps = {
  children: ReactNode;
  title?: ReactNode;
};

export function Pre({ children, title }: PreProps) {
  const codeEl: any = Children.toArray(children)[0];
  const codeStr = codeEl?.props.children || '';
  const code = codeStr.endsWith('\n') ? codeStr.slice(0, -1) : codeStr;
  const language = codeEl?.props.className.replace('language-', '');

  return (
    <Box css={styles.root}>
      <IconButton
        size="xs"
        icon={Icon.is('ClipboardText')}
        css={styles.copyIcon}
        variant="ghost"
        color="gray"
        aria-label="Copy to Clipborad"
        onPress={() =>
          typeof window !== 'undefined' && navigator.clipboard.writeText(code)
        }
      />
      {title && <Text as="h6">{title}</Text>}
      <SyntaxHighlighter
        language={language}
        style={theme}
        data-title={Boolean(title)}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}

const styles = {
  root: cssObj({
    boxSizing: 'border-box',
    position: 'relative',
    maxWidth: 'calc(100vw - $8)',

    pre: {
      pr: '50px',
      mb: '$5 !important',
      padding: '$4 $2 !important',
      borderRadius: '$lg',
      fontSize: '14px !important',
      background: '$gray1 !important',
    },
    'pre[data-title=true]': {
      marginTop: '$0 !important',
      borderTopLeftRadius: '$0',
      borderTopRightRadius: '$0',
    },

    h6: {
      display: 'flex',
      alignItems: 'center',
      margin: 0,
      padding: '$1 $3',
      background: '$gray2',
      color: '$gray10',
      borderTopLeftRadius: '$lg',
      borderTopRightRadius: '$lg',
      borderBottom: '2px solid $bodyColor',

      span: {
        fontSize: '$sm',
      },
      a: {
        color: '$gray10',
      },
    },

    '.token.plain': {
      color: '$gray11',
    },

    '.linenumber': {
      boxSizing: 'border-box',
      minWidth: '30px !important',
      color: '$gray8 !important',
      mr: '$1',
    },
  }),
  copyIcon: cssObj({
    position: 'absolute',
    right: 0,
    bottom: 0,
    color: '$gray7 !important',
    transition: 'all .3s',
    background: '$gray1 !important',

    '&:hover': {
      color: '$gray9 !important',
    },
  }),
};
