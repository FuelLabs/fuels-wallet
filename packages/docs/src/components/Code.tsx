import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function Code(props: any) {
  return <Box as="code" css={styles.root} {...props} />;
}

const styles = {
  root: cssObj({
    pt: '2px',
    pb: '3px',
    px: '6px',
    borderRadius: '$default',
    fontFamily: 'monospace',
    background: '$intentsBase3',
    color: '$intentsBase10',
    fontSize: '0.9rem',
    lineHeight: 'normal',
    '&[data-decoration=line-through]': {
      textDecoration: 'line-through',
    },
  }),
};
