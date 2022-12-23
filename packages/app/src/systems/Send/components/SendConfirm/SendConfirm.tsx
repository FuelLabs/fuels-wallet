import { cssObj } from '@fuel-ui/css';
import { Heading, Stack, Text } from '@fuel-ui/react';

import type { UseSendReturn } from '../../hooks/useSend';

import { TxDetails, TxErrors, TxOperations } from '~/systems/Transaction';

type SendConfirmProps = UseSendReturn;

export function SendConfirm(ctx: SendConfirmProps) {
  return (
    <Stack gap="$3" css={styles.root}>
      <Stack as="header" gap="$1">
        <Heading as="h3">Confirm before approving</Heading>
        <Text>
          Carefully check if all details in your transaction are correct
        </Text>
      </Stack>
      {ctx.errors.transactionResponse.hasGeneral && (
        <TxErrors errors={ctx.errors.transactionResponse.general} />
      )}
      <TxOperations operations={ctx.tx?.operations} />
      <TxDetails fee={ctx.tx?.fee} amountSent={ctx.ethAmountSent} />
    </Stack>
  );
}

const styles = {
  root: cssObj({
    header: {
      textAlign: 'center',
    },
    h3: {
      margin: 0,
    },
  }),
};
