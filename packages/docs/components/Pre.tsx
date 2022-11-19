/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { Children } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import theme from 'react-syntax-highlighter/dist/cjs/styles/prism/night-owl';

export function Pre(props: any) {
  const codeEl: any = Children.toArray(props.children)[0];
  const code = codeEl?.props.children;
  const language = codeEl?.props.className.replace('language-', '');
  return (
    <Box css={styles.pre}>
      <SyntaxHighlighter language={language} style={theme}>
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}

const styles = {
  pre: cssObj({
    pre: {
      mb: '$5 !important',
      padding: '$4',
      borderRadius: '$lg',
      fontSize: '14px !important',
      background: '$gray1 !important',
    },

    '.token.plain': {
      color: '$gray11',
    },
  }),
};
