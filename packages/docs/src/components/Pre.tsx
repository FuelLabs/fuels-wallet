/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj, styled } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { Children } from 'react';

import { prismTheme } from '../styles/prismTheme';

const Line = styled(Box, {
  display: 'table-row',
});

const LineNo = styled(Box, {
  display: 'table-cell',
  textAlign: 'right',
  pr: '$3',
  userSelect: 'none',
  opacity: '0.2',
});

const LineContent = styled(Box, {
  display: 'table-cell',
});

export function Pre(props: any) {
  const codeEl: any = Children.toArray(props.children).find((child: any) => {
    return child.type.name === 'Code';
  });

  const code = codeEl?.props.children;
  const language = codeEl?.props.className.replace('language-', '');

  return (
    <Highlight
      {...defaultProps}
      code={code}
      language={language}
      theme={prismTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        return (
          <Box as="pre" className={className} style={style} css={styles.pre}>
            {tokens.map((line, i) => {
              if (i === tokens.length - 1) return null;
              return (
                <Line key={i} {...getLineProps({ line, key: i })}>
                  <LineNo as="span">{i + 1}</LineNo>
                  <LineContent as="span">
                    {line.map((token, key) => {
                      return (
                        <Box
                          as="span"
                          key={key}
                          {...getTokenProps({ token, key })}
                        />
                      );
                    })}
                  </LineContent>
                </Line>
              );
            })}
          </Box>
        );
      }}
    </Highlight>
  );
}

const styles = {
  pre: cssObj({
    mb: '$5 !important',
    padding: '$4',
    borderRadius: '$lg',

    '.token.plain': {
      color: '$gray11',
    },
  }),
};
