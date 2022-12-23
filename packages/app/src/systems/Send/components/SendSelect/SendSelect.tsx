import { cssObj } from '@fuel-ui/css';
import { Box, Flex, Input, InputAmount, Stack, Text } from '@fuel-ui/react';
import { bn } from 'fuels';

import type { UseSendReturn } from '../../hooks/useSend';

import { AssetSelect, ASSET_MAP } from '~/systems/Asset';
import { ControlledField } from '~/systems/Core';
import type { useTransactionRequest } from '~/systems/DApp';
import { TxDetails, TxErrors } from '~/systems/Transaction';

type SendSelectProps = {
  tx: ReturnType<typeof useTransactionRequest>;
  send: UseSendReturn;
};

export function SendSelect({ send, tx }: SendSelectProps) {
  const { form, errors, showTxDetails, response } = send;
  return (
    <Stack gap="$4">
      {errors.transactionRequest.hasGeneral && (
        <TxErrors errors={errors.transactionRequest.general} />
      )}
      <Flex css={styles.row}>
        <Text as="span" css={styles.title}>
          Send
        </Text>
        <ControlledField
          isRequired
          name="asset"
          control={form.control}
          render={({ field }) => {
            const selected = ASSET_MAP[field.value];
            return (
              <AssetSelect
                items={tx.account?.balances}
                selected={selected}
                onSelect={(asset) => {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                  form.setValue('asset', asset?.assetId.toString()!, {
                    shouldValidate: true,
                  });
                }}
              />
            );
          }}
        />
      </Flex>
      <Flex css={styles.row}>
        <Text as="span" css={styles.title}>
          To
        </Text>
        <Box css={styles.addressRow}>
          <ControlledField
            isRequired
            name="address"
            control={form.control}
            isInvalid={Boolean(form.formState.errors?.address)}
            render={({ field }) => (
              <Input size="sm">
                <Input.Field
                  {...field}
                  id="address"
                  aria-label="Address Input"
                  placeholder="Write a fuel address"
                />
              </Input>
            )}
          />
        </Box>
      </Flex>
      <Stack gap="$3">
        <Text as="span" css={{ ...styles.title, ...styles.amountTitle }}>
          Which amount?
        </Text>
        <ControlledField
          isRequired
          name="amount"
          control={form.control}
          isInvalid={Boolean(form.formState.errors?.amount)}
          render={({ field }) => (
            <InputAmount
              balance={bn(tx.account?.balance)}
              value={bn(field.value)}
              onChange={(value) => {
                form.setValue('amount', value.toString(), {
                  shouldValidate: true,
                });
              }}
            />
          )}
        />
      </Stack>
      {showTxDetails && (
        <TxDetails fee={response?.fee} amountSent={bn(form.watch('amount'))} />
      )}
    </Stack>
  );
}

const styles = {
  row: cssObj({
    alignItems: 'flex-start',
    gap: '$4',

    '.fuel_form--control': {
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
