import { cssObj } from '@fuel-ui/css';
import { Alert, Icon } from '@fuel-ui/react';

import type { GroupedErrors } from '../../utils';

export type TxErrorsProps = {
  errors?: GroupedErrors;
};

export function TxErrors({ errors }: TxErrorsProps) {
  /**
   * I didn't use Copyable component here because it's with some wrong
   * behavior for this case that need to be fixed. Since it's fixed on @fuel-ui
   * we can use it here.
   */
  async function handleCopy() {
    await navigator.clipboard.writeText(JSON.stringify(errors, null, 2));
  }

  return (
    <Alert status="error" css={styles.root}>
      <Alert.Description>Invalid Transaction</Alert.Description>
      <Alert.Actions>
        <Alert.Button
          size="sm"
          rightIcon={Icon.is('CopySimple')}
          onPress={handleCopy}
        >
          Copy Error Message
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
