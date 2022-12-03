import { cssObj } from '@fuel-ui/css';
import { Alert, Copyable } from '@fuel-ui/react';

import type { GroupedErrors } from '../../utils';

export function TxErrors({ errors }: { errors?: GroupedErrors }) {
  return (
    <Alert status="error" css={styles.root}>
      <Alert.Description>Invalid Transaction</Alert.Description>
      <Alert.Actions>
        <Alert.Button size="sm">
          <Copyable
            value={JSON.stringify(errors)}
            tooltipMessage="Click to copy Error Logs"
          >
            Copy Error Message
          </Copyable>
        </Alert.Button>
      </Alert.Actions>
    </Alert>
  );
}

const styles = {
  root: cssObj({
    padding: '$3 $4',

    '.fuel_alert--content': {
      gap: '$1',
    },
  }),
};
