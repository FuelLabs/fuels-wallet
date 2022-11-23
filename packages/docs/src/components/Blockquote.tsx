/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

export function Blockquote(props: any) {
  return <Box as="blockquote" css={styles.root} {...props} />;
}

const styles = {
  root: cssObj({
    position: 'relative',
    my: '$6',
    mx: '$0',
    py: '$3',
    pl: '$4',
    background: '$gray1',
    color: '$gray9',
    fontStyle: 'italic',

    '& > p': {
      margin: '$0',
    },

    '&:before': {
      position: 'absolute',
      display: 'block',
      content: '""',
      top: 0,
      left: 0,
      width: 4,
      height: '100%',
      background: '$gray3',
    },
  }),
};
