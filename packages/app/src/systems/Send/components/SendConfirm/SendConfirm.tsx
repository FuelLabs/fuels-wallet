import { cssObj } from '@fuel-ui/css';
import { Text } from '@fuel-ui/react';

import { ContentHeader, Layout } from '~/systems/Core';
import type { UseTransactionRequestReturn } from '~/systems/DApp';
import { TxContent } from '~/systems/DApp';

export type SendConfirmProps = {
  txRequest: UseTransactionRequestReturn;
};

export function SendConfirm({ txRequest }: SendConfirmProps) {
  const amountSent = txRequest.ethAmountSent;
  return (
    <Layout.Content>
      <TxContent.Info
        tx={txRequest.tx}
        amountSent={amountSent}
        header={
          <ContentHeader title="Confirm before approving" css={styles.header}>
            <Text>
              Carefully check if all details in your transaction are correct
            </Text>
          </ContentHeader>
        }
      />
    </Layout.Content>
  );
}

const styles = {
  header: cssObj({
    mb: '$4',
  }),
};
