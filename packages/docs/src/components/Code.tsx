/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

export function Code(props: any) {
  return <Box as="code" css={styles.root} {...props} />;
}

const styles = {
  root: cssObj({
    pt: '2px',
    pb: '3px',
    px: '6px',
    borderRadius: '$md',
    fontFamily: 'monospace',
    background: '$gray3',
    color: '$gray10',
    fontSize: '0.9rem',
  }),
};
