import { cssObj } from '@fuel-ui/css';
import { Box, Input, InputAmount, Text } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { DECIMAL_UNITS, bn } from 'fuels';
import { useMemo } from 'react';
import { AssetSelect } from '~/systems/Asset';
import { animations, ControlledField, Layout } from '~/systems/Core';
import { TxDetails } from '~/systems/Transaction';

import type { UseSendReturn } from '../../hooks';

const MotionContent = motion(Layout.Content);
type SendSelectProps = UseSendReturn;

export function SendSelect({
  form,
  balanceAssets,
  handlers,
  maxAmountToSend,
  isLoadingInitialFee,
  ...ctx
}: SendSelectProps) {
  const assetId = form.watch('asset', '');
  const decimals = useMemo(() => {
    const selectedAsset = balanceAssets?.find((a) => a.assetId === assetId);
    return selectedAsset?.decimals || DECIMAL_UNITS;
  }, [assetId]);

  return (
    <MotionContent {...animations.slideInTop()}>
      <Box.Stack gap="$4">
        <Box.Flex css={styles.row}>
          <Text as="span" css={styles.title}>
            Send
          </Text>
          <ControlledField
            isRequired
            name="asset"
            control={form.control}
            css={styles.asset}
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
        </Box.Flex>
        <Box.Flex css={styles.row}>
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
                    placeholder="Enter a fuel address"
                  />
                </Input>
              )}
            />
          </Box>
        </Box.Flex>
        <Box.Stack gap="$3">
          <Text as="span" css={{ ...styles.title, ...styles.amountTitle }}>
            Amount
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
                units={decimals}
                onChange={(value) => {
                  const amountValue = value || undefined;
                  form.setValue('amount', amountValue?.toString() || '');
                  handlers.handleValidateAmount(bn(amountValue));
                }}
              />
            )}
          />
        </Box.Stack>
        {isLoadingInitialFee ? (
          <TxDetails.Loader />
        ) : (
          <TxDetails fee={ctx.fee} />
        )}
      </Box.Stack>
    </MotionContent>
  );
}

const styles = {
  asset: cssObj({
    flex: 1,
  }),
  row: cssObj({
    alignItems: 'flex-start',
    gap: '$4',

    '.fuel_form--control': {
      flex: 1,
    },
    '.fuel_Input > input': {
      px: '$3',
      fontFamily: '$sans',
      fontWeight: '$normal',
    },
  }),
  title: cssObj({
    pt: '$2',
    color: '$intentsBase12',
    fontSize: '$xl',
    fontWeight: '$normal',
  }),
  amountTitle: cssObj({
    fontSize: '$md',
  }),
  addressRow: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',

    '.error-msg': {
      fontSize: '$sm',
      color: '$intentsError9',
    },
  }),
};
