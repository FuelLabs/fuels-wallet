import { cssObj } from '@fuel-ui/css';
import { Box, Form, Input, Text } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { type BN, bn } from 'fuels';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AssetSelect } from '~/systems/Asset';
import {
  ControlledField,
  Layout,
  MotionFlex,
  MotionStack,
  animations,
} from '~/systems/Core';

import { useController, useWatch } from 'react-hook-form';
import { InputAmount } from '~/systems/Core/components/InputAmount/InputAmount';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';
import { TxFeeOptions } from '~/systems/Transaction/components/TxFeeOptions/TxFeeOptions';
import type { UseSendReturn } from '../../hooks';
import { AddressField } from '../AddressField';

const MotionContent = motion(Layout.Content);

type SendSelectProps = UseSendReturn & { warningMessage?: string };

export function SendSelect({
  form,
  balances,
  balanceAssetSelected,
  baseFee = bn(0),
  gasLimit = bn(0),
  tip,
  regularTip,
  fastTip,
  errorMessage,
  warningMessage,
  provider,
  handlers,
}: SendSelectProps) {
  const [watchMax, setWatchMax] = useState(false);
  const isAmountFocused = useRef<boolean>(false);
  const baseFeeRef = useRef<BN | null>(baseFee);
  const tipRef = useRef<BN>(tip);
  const [baseAssetId, setBaseAssetId] = useState('');

  const { field: amount, fieldState: amountFieldState } = useController({
    control: form.control,
    name: 'amount',
  });

  const assetId = useWatch({
    control: form.control,
    name: 'asset',
  });
  const selectedAsset = useMemo(
    () => balances?.find((a) => a.asset?.assetId === assetId),
    [assetId, balances]
  );

  const decimals = selectedAsset?.asset?.decimals;
  const rate = selectedAsset?.asset?.rate;
  const amountInUsd = useMemo(() => {
    if (amount.value == null || rate == null || decimals == null) return '$0';
    return convertToUsd(bn(amount.value), decimals, rate).formatted;
  }, [amount.value, rate, decimals]);

  useEffect(() => {
    let abort = false;
    provider?.getBaseAssetId().then((_assetId) => {
      if (abort) return;
      setBaseAssetId(_assetId);
    });
    return () => {
      abort = true;
    };
  }, [provider]);

  const isSendingBaseAssetId = useMemo(() => {
    return assetId && baseAssetId.toLowerCase() === assetId.toLowerCase();
  }, [baseAssetId, assetId]);

  useEffect(() => {
    if (
      isSendingBaseAssetId &&
      watchMax &&
      (!baseFeeRef.current?.eq(baseFee) || !tipRef.current.eq(tip))
    ) {
      baseFeeRef.current = baseFee;
      tipRef.current = tip;

      // Adding 1 magical unit to match the fake unit that is added on TS SDK (.add(1))
      const maxFee = baseFee.add(tip).add(1);
      if (maxFee.gt(balanceAssetSelected)) return;

      const newAmount = balanceAssetSelected;
      form.setValue('amount', newAmount);
      handlers.recalculateFromAmount(newAmount);
    }
  }, [
    watchMax,
    balanceAssetSelected,
    baseFee,
    tip,
    form.setValue,
    isSendingBaseAssetId,
    handlers.recalculateFromAmount,
  ]);

  const assetSelectItems = useMemo(
    () =>
      balances
        ?.map((b) => ({
          assetId: b.assetId,
          ...b.asset,
        }))
        .sort((a, b) => {
          if (a.verified !== b.verified) return b.verified ? 1 : -1;
          if (a.isNft !== b.isNft) return b.isNft ? 1 : -1;
          if (a.collection !== b.collection)
            return (a.collection || '').localeCompare(b.collection || '');
          if (a.name !== b.name)
            return (a.name || '').localeCompare(b.name || '');
          return (a.assetId || '').localeCompare(b.assetId || '');
        }),
    [balances]
  );

  return (
    <MotionContent {...animations.slideInTop()}>
      <Box.Stack gap="$3">
        <Box.Flex css={styles.row}>
          <Text as="span" css={styles.title}>
            Asset
          </Text>
          <ControlledField
            isRequired
            name="asset"
            control={form.control}
            css={styles.asset}
            render={({ field }) => {
              const handleAssetSelect = useCallback(
                (asset?: string | null) => {
                  form.setValue('amount', bn(0));
                  setWatchMax(false);
                  field.onChange(asset);
                },
                [form.setValue, field.onChange]
              );

              return (
                <AssetSelect
                  items={assetSelectItems}
                  selected={field.value}
                  onSelect={handleAssetSelect}
                />
              );
            }}
          />
        </Box.Flex>
        <Box.Flex css={styles.row}>
          <Text as="span" css={styles.title}>
            To
          </Text>
          <AddressField warningMessage={warningMessage} />
        </Box.Flex>
        <Box.Stack gap="$3">
          <Text as="span" css={styles.title}>
            Amount
          </Text>
          <Form.Control
            isRequired
            isInvalid={Boolean(errorMessage || amountFieldState.error)}
          >
            <InputAmount
              name={amount.name}
              balance={balanceAssetSelected}
              value={amount.value}
              units={decimals}
              amountInUsd={amountInUsd}
              onChange={(val) => {
                if (isAmountFocused.current) {
                  setWatchMax(false);
                  amount.onChange(val);
                }
              }}
              onClickMax={() => {
                if (isSendingBaseAssetId) {
                  baseFeeRef.current = null; // Workaround just to trigger the watcher when max is clicked and base fee is stable
                  setWatchMax(true);
                } else {
                  form.setValue('amount', balanceAssetSelected);
                  handlers.recalculateFromAmount(balanceAssetSelected);
                }
              }}
              inputProps={{
                onFocus: () => {
                  isAmountFocused.current = true;
                },
                onBlur: () => {
                  isAmountFocused.current = false;
                },
              }}
            />
            {(errorMessage || amountFieldState.error) && (
              <MotionFlex {...animations.fadeIn()} key="error">
                <Form.ErrorMessage aria-label="Error message">
                  {errorMessage || amountFieldState.error?.message}
                </Form.ErrorMessage>
              </MotionFlex>
            )}
          </Form.Control>
        </Box.Stack>

        {amount.value?.gt(0) &&
          assetId &&
          baseFee.gt(0) &&
          regularTip &&
          fastTip && (
            <MotionStack {...animations.slideInTop()} gap="$3">
              <Text as="span" css={styles.titleFee}>
                Fee (network)
              </Text>
              <TxFeeOptions
                initialAdvanced={false}
                baseFee={baseFee}
                gasLimit={gasLimit}
                regularTip={regularTip}
                fastTip={fastTip}
                onRecalculate={handlers.recalculateFromTip}
              />
            </MotionStack>
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
    fontSize: '$md',
    fontWeight: '$normal',
    width: '48px',
  }),
  titleFee: cssObj({
    pt: '$2',
    color: '$intentsBase12',
    fontSize: '$md',
    fontWeight: '$normal',
  }),
  alert: cssObj({
    fontSize: '$sm',
    lineHeight: '$tight',
    color: '$intentsWarning8',
    marginTop: '$2',
  }),
};
