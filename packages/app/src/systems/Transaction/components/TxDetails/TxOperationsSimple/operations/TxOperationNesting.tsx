import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

type TxOperationNestingProps = {
  depth: number;
};

export function TxOperationNesting({ depth }: TxOperationNestingProps) {
  if (depth === 0) return null;

  return (
    <Box css={styles.root}>
      {Array.from({ length: depth }).map((_, _i) => (
        <Box key={depth} css={styles.line} />
      ))}
    </Box>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    marginRight: '$2',
  }),
  line: cssObj({
    width: '12px',
    height: '100%',
    borderLeft: '1px solid $gray4',
  }),
};
