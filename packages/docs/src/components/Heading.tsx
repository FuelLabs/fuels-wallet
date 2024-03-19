import { cssObj } from '@fuel-ui/css';
import { Heading as FuelHeading } from '@fuel-ui/react';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
      color: '$intentsBase12',
    },
    '&[data-rank=h2]': {
      mt: '$12',
      mb: '$5',
      pb: '$2',
      color: '$intentsBase12',
      borderBottom: '1px solid $border',
    },
    '&[data-rank=h3]': {
      mt: '$8',
      mb: '$4',
      color: '$intentsBase11',
    },
    '&[data-rank=h4], &[data-rank=h5], &[data-rank=h6]': {
      mt: '$6',
      mb: '$2',
      color: '$intentsBase11',
    },
  }),
};
