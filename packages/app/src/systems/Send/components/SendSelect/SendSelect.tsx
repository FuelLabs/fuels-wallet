import { cssObj } from '@fuel-ui/css';
import { Box, Flex, Input, InputAmount, Stack, Text } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { bn } from 'fuels';

import type { UseSendReturn } from '../../hooks';

import { AssetSelect } from '~/systems/Asset';
import { animations, ControlledField, Layout } from '~/systems/Core';
import { TxDetails } from '~/systems/Transaction';

const MotionContent = motion(Layout.Content);
type SendSelectProps = UseSendReturn;

export function SendSelect({
  form,
  balanceAssets,
  handlers,
  maxAmountToSend,
  ...ctx
}: SendSelectProps) {
  return (
    <MotionContent {...animations.slideInTop()}>
      <Stack gap="$4">
        <Flex css={styles.row}>
          <Text as="span" css={styles.title}>
            Send
          </Text>
          <ControlledField
            isRequired
            name="asset"
            control={form.control}
            render={({ field }) => (
              <AssetSelect
                items={balanceAssets}
                selected={field.value}
                onSelect={(assetId) => {
                  form.setValue('asset', assetId || '', {
                    shouldValidate: true,
                  });
                }}
              />
            )}
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
                name={field.name}
                balance={maxAmountToSend}
                value={bn(field.value)}
                onChange={(value) => {
                  form.setValue('amount', value.toString());
                  handlers.handleValidateAmount(value);
                }}
              />
            )}
          />
        </Stack>
        <TxDetails fee={ctx.fee} />
      </Stack>
    </MotionContent>
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
