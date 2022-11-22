/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { Box, Icon, IconButton, Text } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { Children } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import theme from 'react-syntax-highlighter/dist/cjs/styles/prism/night-owl';

type PreProps = {
  children: ReactNode;
  title?: ReactNode;
};

export function Pre({ children, title }: PreProps) {
  const codeEl: any = Children.toArray(children)[0];
  const codeStr = codeEl?.props.children || '';
  const code = codeStr.endsWith('\n') ? codeStr.slice(0, -2) : codeStr;
  const language = codeEl?.props.className.replace('language-', '');

  return (
    <Box css={styles.root}>
      <IconButton
        icon={Icon.is('ClipboardText')}
        css={styles.copyIcon}
        variant="link"
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
    position: 'relative',

    pre: {
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
      color: '$gray8',
      borderTopLeftRadius: '$lg',
      borderTopRightRadius: '$lg',
      borderBottom: '2px solid $bodyColor',

      span: {
        fontSize: '$sm',
      },
    },

    '.token.plain': {
      color: '$gray11',
    },

    '.linenumber': {
      boxSizing: 'border-box',
      minWidth: '40px !important',
      color: '$gray8 !important',
      mr: '$2',
    },
  }),
  copyIcon: cssObj({
    padding: '$0 !important',
    position: 'absolute',
    right: 10,
    bottom: 10,
    color: '$gray7',
    transition: 'all .3s',

    '&:hover': {
      color: '$gray10',
    },
  }),
};
