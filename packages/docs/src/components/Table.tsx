import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function Table(props: any) {
  return <Box as="table" {...props} css={styles.root} />;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function TD(props: any) {
  return (
    <Box as="td" {...props} css={styles.td}>
      <Box as="div" css={styles.tdContainer}>
        {props.children}
      </Box>
    </Box>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function TH(props: any) {
  return (
    <Box as="th" {...props} css={styles.td}>
      <Box as="div" css={styles.thContainer}>
        {props.children}
      </Box>
    </Box>
  );
}

const styles = {
  root: cssObj({
    py: '$3',
    px: '$4',
    mb: '$6',
    background: '$intentsBase1',
    borderRadius: '$lg',
    border: '1px solid $intentsBase3',
    width: '100%',
  }),
  td: cssObj({
    py: '$2',
    px: '$3',
  }),
  tdContainer: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }),
  thContainer: cssObj({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '$2',
    justifyContent: 'space-between',
    height: '100%',
  }),
};
