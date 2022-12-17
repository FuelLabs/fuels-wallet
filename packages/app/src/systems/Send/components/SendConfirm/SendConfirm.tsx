/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { cssObj } from '@fuel-ui/css';
import { Heading, Stack, Text } from '@fuel-ui/react';
import { AddressType } from '@fuel-wallet/types';

import type { UseSendReturn } from '../../hooks/useSend';

import { useAccounts } from '~/systems/Account';
import { AssetsAmount } from '~/systems/Asset';
import { TxDetails, TxFromTo, useTxOutputs } from '~/systems/Transaction';

type SendConfirmProps = UseSendReturn;

export function SendConfirm({ inputs, response, errors }: SendConfirmProps) {
  const { account } = useAccounts();
  const { outputsToSend } = useTxOutputs(response?.txRequest);
  return (
    <Stack gap="$3" css={styles.root}>
      <Stack as="header" gap="$1">
        <Heading as="h3">Confirm before approving</Heading>
        <Text>
          Carefully check if all details in your transaction are correct
        </Text>
      </Stack>
      <TxFromTo
        from={{
          type: AddressType.account,
          address: account?.address!,
        }}
        to={{
          type: AddressType.account,
          address: inputs?.address!,
        }}
      />
      <AssetsAmount
        amounts={outputsToSend}
        balanceErrors={errors?.txApprove.all?.InsufficientInputAmount}
        title="Amount Spent"
      />
      {response?.fee && (
        <TxDetails fee={response?.fee} amountSent={inputs?.amount} />
      )}
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
