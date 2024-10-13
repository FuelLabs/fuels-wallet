import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Form, Input, Text } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { type BN, bn } from 'fuels';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { TxFeeOptions } from '~/systems/Transaction/components/TxFeeOptions/TxFeeOptions';
import type { UseSendReturn } from '../../hooks';

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
}: SendSelectProps) {
  const [watchMax, setWatchMax] = useState(false);
  const isAmountFocused = useRef<boolean>(false);
  const baseFeeRef = useRef<BN | null>(baseFee);
  const tipRef = useRef<BN>(tip);

  const { field: amount, fieldState: amountFieldState } = useController({
    control: form.control,
    name: 'amount',
  });

  const assetId = useWatch({
    control: form.control,
    name: 'asset',
  });

  const decimals = useMemo(() => {
    const selectedAsset = balances?.find((a) => a.asset?.assetId === assetId);
    return selectedAsset?.asset?.decimals;
  }, [assetId, balances]);

  const isSendingBaseAssetId = useMemo(() => {
    return (
      assetId &&
      provider?.getBaseAssetId().toLowerCase() === assetId.toLowerCase()
    );
  }, [provider, assetId]);

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

      form.setValue('amount', balanceAssetSelected.sub(maxFee));
    }
  }, [
    watchMax,
    balanceAssetSelected,
    baseFee,
    tip,
    form.setValue,
    isSendingBaseAssetId,
  ]);

  const assetSelectItems = balances?.map((b) => ({
    assetId: b.assetId,
    ...b.asset,
  }));

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
            render={({ field }) => (
              <AssetSelect
                items={assetSelectItems}
                selected={field.value}
                onSelect={(asset) => {
                  form.setValue('amount', bn(0));
                  setWatchMax(false);
                  field.onChange(asset);
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
              warning={warningMessage}
              isInvalid={
                Boolean(form.formState.errors?.address) &&
                !form.formState.isValidating
              }
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
              <Text as="span" css={styles.title}>
                Fee (network)
              </Text>
              <TxFeeOptions
                initialAdvanced={false}
                baseFee={baseFee}
                gasLimit={gasLimit}
                regularTip={regularTip}
                fastTip={fastTip}
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
  alert: cssObj({
    fontSize: '$sm',
    lineHeight: '$tight',
    color: '$intentsWarning8',
    marginTop: '$2',
  }),
};
