/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { Heading as FuelHeading } from '@fuel-ui/react';

export function Heading({ children, ...props }: any) {
  return (
    <FuelHeading as={props['data-rank']} {...props} css={styles.root}>
      {children}
    </FuelHeading>
  );
}

const styles = {
  root: cssObj({
    '&[data-rank=h1]': {
      mb: '$6',
      color: '$gray12',
    },
    '&[data-rank=h2]': {
      mt: '$12',
      mb: '$5',
      pb: '$2',
      color: '$gray12',
      borderBottom: '1px dashed $gray3',
    },
    '&[data-rank=h3]': {
      mt: '$8',
      mb: '$4',
      color: '$gray11',
    },
    '&[data-rank=h4], &[data-rank=h5], &[data-rank=h6]': {
      mt: '$6',
      mb: '$2',
      color: '$gray11',
    },
  }),
};
