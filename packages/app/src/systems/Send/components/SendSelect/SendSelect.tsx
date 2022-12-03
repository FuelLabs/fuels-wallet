import { cssObj } from '@fuel-ui/css';
import { Flex, Input, Stack, Text } from '@fuel-ui/react';
import { bn } from 'fuels';

import type { UseSendReturn } from '../../hooks/useSend';

import { AmountInput, AssetSelect } from '~/systems/Asset';
import type { useTransactionRequest } from '~/systems/DApp';
import { TxDetails, TxErrors } from '~/systems/Transaction';

type SendSelectProps = {
  tx: ReturnType<typeof useTransactionRequest>;
  send: UseSendReturn;
};

export function SendSelect({ send, tx }: SendSelectProps) {
  return (
    <Stack gap="$4">
      {send.errors.txRequest.hasGeneral && (
        <TxErrors errors={send.errors.txRequest.general} />
      )}
      <Flex css={styles.row}>
        <Text as="span" css={styles.title}>
          Send
        </Text>
        <AssetSelect
          selected={send.inputs?.asset}
          onSelect={send.handlers.setAsset}
          items={tx.account?.balances}
        />
      </Flex>
      <Flex css={styles.row}>
        <Text as="span" css={styles.title}>
          To
        </Text>
        <Input size="sm">
          <Input.Field
            aria-label="Address Input"
            id="address"
            name="address"
            placeholder="Write a fuel address"
            value={send.inputs?.address || ''}
            onChange={(e) => send.handlers.setAddress(e.target.value)}
          />
        </Input>
      </Flex>
      <Stack gap="$3">
        <Text as="span" css={{ ...styles.title, ...styles.amountTitle }}>
          Which amount?
        </Text>
        <AmountInput
          value={send.inputs?.amount || bn(0)}
          onChange={send.handlers.setAmount}
          balance={bn(tx.account?.balance || 0)}
        />
      </Stack>
      {send.response?.fee && (
        <TxDetails fee={send.response.fee} outputAmount={send.inputs?.amount} />
      )}
    </Stack>
  );
}

const styles = {
  row: cssObj({
    alignItems: 'center',
    gap: '$4',

    '.fuel_asset-select, .fuel_input': {
      flex: 1,
    },
    '.fuel_input > input': {
      px: '$3',
      fontFamily: '$sans',
      fontWeight: '$medium',
    },
  }),
  title: cssObj({
    color: '$gray12',
    fontSize: '$xl',
    fontWeight: '$semibold',
  }),
  amountTitle: cssObj({
    fontSize: '$md',
  }),
};
