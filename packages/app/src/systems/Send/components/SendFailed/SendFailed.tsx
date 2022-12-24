import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';

import { Layout } from '~/systems/Core';
import type { UseTransactionRequestReturn } from '~/systems/DApp';
import { TxContent } from '~/systems/DApp';

export type SendFailedProps = {
  txRequest: UseTransactionRequestReturn;
};

export function SendFailed({ txRequest }: SendFailedProps) {
  return (
    <Layout.Content css={styles.content}>
      <TxContent.Failed
        footer={
          <Button
            color="red"
            variant="ghost"
            onPress={txRequest.handlers.tryAgain}
            css={styles.actionBtn}
          >
            Try again
          </Button>
        }
      />
    </Layout.Content>
  );
}

const styles = {
  actionBtn: cssObj({
    mt: '$4',
  }),
  content: cssObj({
    '.content_header': {
      px: '$8',
    },
  }),
};
