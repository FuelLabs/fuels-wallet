/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { cssObj } from '@fuel-ui/css';
import { Heading, Stack, Text } from '@fuel-ui/react';
import { AddressType } from '@fuel-wallet/types';

import type { UseSendReturn } from '../../hooks/useSend';

import { AssetsAmount } from '~/systems/Asset';
import { TxDetails, TxFromTo, useTxOutputs } from '~/systems/Transaction';

type SendConfirmProps = UseSendReturn;

export function SendConfirm({ inputs, response, errors }: SendConfirmProps) {
  const { outputsToSend } = useTxOutputs(response?.txRequest);
  return (
    <Stack gap="$3" css={styles.root}>
      <Stack as="header" gap="$1">
        <Heading as="h3">Confirm before send</Heading>
        <Text>
          Check your transaction summary and confirm all details is right before
          send
        </Text>
      </Stack>
      <TxFromTo
        from={{
          type: AddressType.account,
          address: inputs?.wallet?.address.toString()!,
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
