import { cssObj } from '@fuel-ui/css';
import { Box, Form, Input, Text } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { DECIMAL_FUEL, bn } from 'fuels';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AssetSelect } from '~/systems/Asset';
import {
  ControlledField,
  Layout,
  MotionStack,
  animations,
} from '~/systems/Core';

import { useController, useWatch } from 'react-hook-form';
import { InputAmount } from '~/systems/Core/components/InputAmount/InputAmount';
import { TxFeeOptions } from '~/systems/Transaction/components/TxFeeOptions/TxFeeOptions';
import type { UseSendReturn } from '../../hooks';

const MotionContent = motion(Layout.Content);

type SendSelectProps = UseSendReturn;

export function SendSelect({
  form,
  balanceAssets,
  balanceAssetSelected,
  status,
  currentFee,
  maxFee,
  regularTip,
  fastTip,
}: SendSelectProps) {
  const [watchMax, setWatchMax] = useState(false);
  const isAmountFocused = useRef<boolean>(false);

  const { field: amount, fieldState: amountFieldState } = useController({
    control: form.control,
    name: 'amount',
  });

  const assetId = useWatch({
    control: form.control,
    name: 'asset',
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const decimals = useMemo(() => {
    const selectedAsset = balanceAssets?.find((a) => a.assetId === assetId);
    return selectedAsset?.decimals || DECIMAL_FUEL;
  }, [assetId]);

  const _isLoadingTx = status('loadingTx');

  useEffect(() => {
    if (watchMax) {
      form.setValue('amount', balanceAssetSelected.sub(currentFee));
    }
  }, [watchMax, balanceAssetSelected, currentFee, form.setValue]);

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
          <Form.Control isRequired isInvalid={Boolean(amountFieldState.error)}>
            <InputAmount
              name={amount.name}
              balance={balanceAssetSelected}
              value={amount.value}
              units={decimals}
              onChange={(val) => {
                if (isAmountFocused.current) {
                  setWatchMax(false);
                  amount.onChange(val);
                }
              }}
              onClickMax={() => setWatchMax(true)}
              inputProps={{
                onFocus: () => {
                  isAmountFocused.current = true;
                },
                onBlur: () => {
                  isAmountFocused.current = false;
                },
              }}
            />
            {amountFieldState.error && (
              <Form.ErrorMessage aria-label="Error message">
                {amountFieldState.error.message}
              </Form.ErrorMessage>
            )}
          </Form.Control>
        </Box.Stack>

        {assetId && maxFee && regularTip && fastTip && (
          <MotionStack {...animations.slideInTop()} gap="$3">
            <Text as="span" css={{ ...styles.title, ...styles.amountTitle }}>
              Fee (network)
            </Text>
            <TxFeeOptions
              maxFee={maxFee}
              regularTip={regularTip}
              fastTip={fastTip}
            />
          </MotionStack>
        )}

        {/* @TODO: do we still need this loading-state? */}
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
