import { cssObj } from '@fuel-ui/css';
import { Box, Input, InputAmount, Text } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { BaseAssetId, DECIMAL_UNITS, bn } from 'fuels';
import { useEffect, useMemo } from 'react';
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
  balanceAssetSelected,
  status,
  fee,
}: SendSelectProps) {
  const assetId = form.watch('asset', '');
  const decimals = useMemo(() => {
    const selectedAsset = balanceAssets?.find((a) => a.assetId === assetId);
    return selectedAsset?.decimals || DECIMAL_UNITS;
  }, [assetId]);
  const isLoadingTx = status('loadingTx');

  // If max balance is set on the input assume the user wants to send the max
  // and change the amount to the max balance minus the fee.
  useEffect(() => {
    const amount = form.getValues('amount');
    if (assetId === BaseAssetId && balanceAssetSelected.eq(amount) && fee) {
      form.setValue('amount', balanceAssetSelected.sub(fee).toString());
    }
  }, [fee, balanceAssetSelected]);

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
                balance={balanceAssetSelected}
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
        {fee && (isLoadingTx ? <TxDetails.Loader /> : <TxDetails fee={fee} />)}
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
