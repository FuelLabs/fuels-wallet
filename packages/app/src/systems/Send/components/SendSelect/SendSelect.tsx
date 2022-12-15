import { cssObj } from '@fuel-ui/css';
import { Box, Flex, Input, InputAmount, Stack, Text } from '@fuel-ui/react';
import { bn } from 'fuels';

import type { UseSendReturn } from '../../hooks/useSend';

import { AssetSelect } from '~/systems/Asset';
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
        <Box css={styles.addressRow}>
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
          {send.errors.isAddressInvalid && (
            <Text className="error-msg">
              Address is not a bech32 valid address
            </Text>
          )}
        </Box>
      </Flex>
      <Stack gap="$3">
        <Text as="span" css={{ ...styles.title, ...styles.amountTitle }}>
          Which amount?
        </Text>
        <InputAmount
          value={send.inputs?.amount}
          onChange={send.handlers.setAmount}
          balance={bn(tx.account?.balance)}
        />
      </Stack>
      {send.showTxDetails && (
        <TxDetails fee={send.response?.fee} amountSent={send.inputs?.amount} />
      )}
    </Stack>
  );
}

const styles = {
  row: cssObj({
    alignItems: 'flex-start',
    gap: '$4',

    '.fuel_asset-select': {
      flex: 1,
    },
    '.fuel_input > input': {
      px: '$3',
      fontFamily: '$sans',
      fontWeight: '$medium',
    },
  }),
  title: cssObj({
    pt: '$2',
    color: '$gray12',
    fontSize: '$xl',
    fontWeight: '$semibold',
  }),
  amountTitle: cssObj({
    fontSize: '$md',
  }),
  addressRow: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',

    '.error-msg': {
      fontSize: '$xs',
      color: '$red9',
    },
  }),
};
