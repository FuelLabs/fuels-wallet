import { cssObj } from '@fuel-ui/css';
import { Box, Input, Text } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { DECIMAL_FUEL, bn } from 'fuels';
import { useEffect, useMemo, useState } from 'react';
import { AssetSelect } from '~/systems/Asset';
import { ControlledField, Layout, animations } from '~/systems/Core';
import { TxFee } from '~/systems/Transaction';

import { InputAmount } from '~/systems/Core/components/InputAmount/InputAmount';
import { TxFeeOptions } from '~/systems/Transaction/components/TxFeeOptions/TxFeeOptions';
import type { FeeType, UseSendReturn } from '../../hooks';

const MotionContent = motion(Layout.Content);
type SendSelectProps = UseSendReturn;

export function SendSelect({
  form,
  balanceAssets,
  handlers,
  balanceAssetSelected,
  status,
  regularFee,
  fastFee,
  currentFee,
  currentFeeType,
  baseAssetId,
}: SendSelectProps) {
  const [watchMax, setWatchMax] = useState(false);
  const assetId = form.watch('asset', '');
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const decimals = useMemo(() => {
    const selectedAsset = balanceAssets?.find((a) => a.assetId === assetId);
    return selectedAsset?.decimals || DECIMAL_FUEL;
  }, [assetId]);
  const _isLoadingTx = status('loadingTx');

  const handleChangeCurrentFeeType = (feeType: FeeType) => {
    handlers.changeCurrentFeeType(feeType);
  };

  const handleOverrideMaxAmount = () => {
    if (assetId === baseAssetId) {
      const newAmount = balanceAssetSelected.sub(bn(currentFee)).toString();
      const currentAmount = form.getValues('amount');

      if (currentAmount !== newAmount) {
        form.setValue('amount', newAmount);
        handlers.handleValidateAmount(newAmount);
      }
    }
  };

  useEffect(() => {
    if (currentFee && watchMax) {
      handleOverrideMaxAmount();
    }
  }, [currentFee, watchMax, handleOverrideMaxAmount]);

  // If max balance is set on the input assume the user wants to send the max
  // and change the amount to the max balance minus the fee.
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  // useEffect(() => {
  //   const amount = form.getValues('amount');
  //   if (watchMax && assetId === baseAssetId && balanceAssetSelected.eq(amount)) {
  //     if (currentFeeType === 'fast' && fastFee) {
  //       const newAmount = balanceAssetSelected.sub(fastFee).toString();
  //       form.setValue('amount', newAmount);
  //       handlers.handleValidateAmount(newAmount);

  //     } else if (currentFeeType === 'regular' && regularFee) {
  //       const newAmount = balanceAssetSelected.sub(regularFee).toString()
  //       form.setValue(
  //         'amount',
  //         newAmount
  //       );
  //       handlers.handleValidateAmount(newAmount);
  //     }
  //   }
  // }, [regularFee, fastFee, currentFeeType, balanceAssetSelected, watchMax]);

  return (
    <MotionContent {...animations.slideInTop()}>
      <Box.Stack gap="$4">
        <Box.Flex css={styles.row}>
          <Text as="span" css={styles.title}>
            Asset
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
                    id="search-address"
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
            render={({ field }) => {
              return (
                <InputAmount
                  name={field.name}
                  balance={balanceAssetSelected}
                  value={bn(field.value)}
                  units={decimals}
                  onChange={(value, isMaxClick) => {
                    if (isMaxClick) {
                      setWatchMax(true);
                      handleOverrideMaxAmount();

                      return;
                    }

                    const amountValue = value || undefined;
                    const prevAmount = form.getValues('amount');

                    console.log(
                      'onChange input',
                      prevAmount !== amountValue?.toString(),
                      prevAmount,
                      amountValue?.toString()
                    );
                    if (prevAmount !== amountValue?.toString()) {
                      form.setValue('amount', amountValue?.toString() || '');
                      handlers.handleValidateAmount(amountValue?.toString());
                      setWatchMax(false);
                    }
                  }}
                />
              );
            }}
          />
        </Box.Stack>
        {!!(form.formState.isValid && currentFeeType) && (
          <Box.Stack gap="$3">
            <Text as="span" css={{ ...styles.title, ...styles.amountTitle }}>
              Fee (network)
            </Text>
            <TxFeeOptions
              fastFee={fastFee}
              regularFee={regularFee}
              currentFeeType={currentFeeType}
              onChangeCurrentFeeType={handleChangeCurrentFeeType}
            />
          </Box.Stack>
        )}
        {/* {isLoadingTx ? <TxFee.Loader /> : <TxFee fee={regularFee} />} */}
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
    fontSize: '$lg',
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
